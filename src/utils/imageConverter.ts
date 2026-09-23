import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '../lib/firebase';

export type ImagePreset =
  | 'project'
  | 'profile'
  | 'og'
  | 'favicon'
  | 'logo'
  | 'service'
  | 'general';

export interface ImageProcessingStats {
  originalSizeBytes: number;
  newSizeBytes: number;
  originalSizeFormatted: string;
  newSizeFormatted: string;
  compressionRatio: string;
  width: number;
  height: number;
  format: 'image/webp';
}

export interface UploadResult {
  url: string;
  method: 'firebase_storage' | 'firestore_document';
  stats: ImageProcessingStats;
}

export type UploadStep = 'compressing' | 'uploading' | 'completed';

export interface UploadProgress {
  step: UploadStep;
  percent: number; // 0 to 100
  stage: string;   // Human-readable status message
  bytesTransferred?: number;
  totalBytes?: number;
}

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB limit

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i > 1 ? 2 : 1)} ${sizes[i]}`;
}

/**
 * Validates the raw uploaded file size and mime type.
 * Rejects anything above 15 MB.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/') && !file.name.match(/\.(jpe?g|png|webp|gif|svg|avif|bmp|tiff)$/i)) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload an image (JPG, PNG, WebP, GIF, SVG, AVIF).',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${formatBytes(file.size)}) exceeds the 15 MB maximum limit. Please choose a smaller image.`,
    };
  }

  return { valid: true };
}

/**
 * Calculates target dimensions for resizing based on image preset:
 * - projects: max 1600px wide
 * - profile photos: 800px max dimension
 * - Open Graph: 1200x630
 * - favicon: 256px
 * - logo: 512px max dimension
 * - service: 1200px max dimension
 * - general: 1600px max dimension
 */
export function calculateTargetDimensions(
  origWidth: number,
  origHeight: number,
  preset: ImagePreset
): { width: number; height: number; cropToOg?: boolean } {
  switch (preset) {
    case 'project': {
      // Max 1600px wide, maintain aspect ratio
      if (origWidth > 1600) {
        const height = Math.round((origHeight * 1600) / origWidth);
        return { width: 1600, height };
      }
      return { width: origWidth, height: origHeight };
    }

    case 'profile': {
      // 800px max dimension, maintain aspect ratio
      const maxDim = 800;
      if (origWidth > maxDim || origHeight > maxDim) {
        if (origWidth >= origHeight) {
          const height = Math.round((origHeight * maxDim) / origWidth);
          return { width: maxDim, height };
        } else {
          const width = Math.round((origWidth * maxDim) / origHeight);
          return { width, height: maxDim };
        }
      }
      return { width: origWidth, height: origHeight };
    }

    case 'og': {
      // Open Graph exact 1200x630
      return { width: 1200, height: 630, cropToOg: true };
    }

    case 'favicon': {
      // 256px square
      return { width: 256, height: 256 };
    }

    case 'logo': {
      // 512px max
      const maxDim = 512;
      if (origWidth > maxDim || origHeight > maxDim) {
        if (origWidth >= origHeight) {
          const height = Math.round((origHeight * maxDim) / origWidth);
          return { width: maxDim, height };
        } else {
          const width = Math.round((origWidth * maxDim) / origHeight);
          return { width, height: maxDim };
        }
      }
      return { width: origWidth, height: origHeight };
    }

    case 'service': {
      // 1200px max
      if (origWidth > 1200) {
        const height = Math.round((origHeight * 1200) / origWidth);
        return { width: 1200, height };
      }
      return { width: origWidth, height: origHeight };
    }

    case 'general':
    default: {
      if (origWidth > 1600) {
        const height = Math.round((origHeight * 1600) / origWidth);
        return { width: 1600, height };
      }
      return { width: origWidth, height: origHeight };
    }
  }
}

/**
 * Inline Web Worker source code:
 * Offloads decoding, downsampling, and hardware-accelerated WebP encoding
 * to a background thread so the UI remains 100% fluid and responsive.
 */
const WORKER_CODE = `
self.onmessage = async (e) => {
  const { id, file, targetWidth, targetHeight, cropToOg, quality } = e.data;
  try {
    let blob;

    if (cropToOg) {
      // Decode image first to get aspect ratio
      const imgBitmap = await createImageBitmap(file);
      const origW = imgBitmap.width;
      const origH = imgBitmap.height;

      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create offscreen canvas context');

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Center crop & cover into 1200x630
      const scale = Math.max(targetWidth / origW, targetHeight / origH);
      const sw = origW * scale;
      const sh = origH * scale;
      const dx = (targetWidth - sw) / 2;
      const dy = (targetHeight - sh) / 2;

      ctx.drawImage(imgBitmap, dx, dy, sw, sh);
      imgBitmap.close();

      // Encode once to WebP
      blob = await canvas.convertToBlob({
        type: 'image/webp',
        quality: quality || 0.82,
      });
    } else {
      // RESIZE FIRST, ENCODE ONCE:
      // Decode directly into the target resolution in hardware decoder
      let bitmap;
      try {
        bitmap = await createImageBitmap(file, {
          resizeWidth: targetWidth,
          resizeHeight: targetHeight,
          resizeQuality: 'high',
        });
      } catch (resizeErr) {
        bitmap = await createImageBitmap(file);
      }

      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create offscreen canvas context');

      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close();

      // Encode once using browser native hardware-accelerated WebP encoder
      blob = await canvas.convertToBlob({
        type: 'image/webp',
        quality: quality || 0.82,
      });
    }

    self.postMessage({
      id,
      success: true,
      blob,
      width: targetWidth,
      height: targetHeight,
    });
  } catch (err) {
    self.postMessage({
      id,
      success: false,
      error: (err && err.message) || 'Image conversion failed in background worker',
    });
  }
};
`;

let sharedWorker: Worker | null = null;
let sharedWorkerUrl: string | null = null;

function getSharedWorker(): Worker | null {
  if (typeof window === 'undefined' || typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') {
    return null;
  }
  if (!sharedWorker) {
    try {
      const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
      sharedWorkerUrl = URL.createObjectURL(blob);
      sharedWorker = new Worker(sharedWorkerUrl);
    } catch (err) {
      console.warn('Worker creation unavailable, using main-thread fallback:', err);
      sharedWorker = null;
    }
  }
  return sharedWorker;
}

/**
 * Fallback processing function if Web Worker / OffscreenCanvas is unavailable.
 * Uses native createImageBitmap with resize options and canvas.toBlob (hardware-accelerated WebP).
 */
async function processOnMainThread(
  file: File,
  targetWidth: number,
  targetHeight: number,
  cropToOg?: boolean,
  quality = 0.82
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to obtain canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (cropToOg) {
    let imgBitmap: ImageBitmap | HTMLImageElement;
    if (typeof createImageBitmap === 'function') {
      imgBitmap = await createImageBitmap(file);
    } else {
      imgBitmap = await loadImageFromFile(file);
    }

    const origW = (imgBitmap as ImageBitmap).width || (imgBitmap as HTMLImageElement).naturalWidth;
    const origH = (imgBitmap as ImageBitmap).height || (imgBitmap as HTMLImageElement).naturalHeight;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const scale = Math.max(targetWidth / origW, targetHeight / origH);
    const sw = origW * scale;
    const sh = origH * scale;
    const dx = (targetWidth - sw) / 2;
    const dy = (targetHeight - sh) / 2;

    ctx.drawImage(imgBitmap, dx, dy, sw, sh);
    if ('close' in imgBitmap && typeof imgBitmap.close === 'function') {
      imgBitmap.close();
    }
  } else {
    // Resize first during decode:
    let imgBitmap: ImageBitmap | HTMLImageElement;
    if (typeof createImageBitmap === 'function') {
      try {
        imgBitmap = await createImageBitmap(file, {
          resizeWidth: targetWidth,
          resizeHeight: targetHeight,
          resizeQuality: 'high',
        });
      } catch {
        imgBitmap = await createImageBitmap(file);
      }
    } else {
      imgBitmap = await loadImageFromFile(file);
    }

    ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);
    if ('close' in imgBitmap && typeof imgBitmap.close === 'function') {
      imgBitmap.close();
    }
  }

  // Encode ONCE with browser native WebP encoder
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Native WebP encoding failed in canvas'));
      },
      'image/webp',
      quality
    );
  });
}

function processWithWorker(
  file: File,
  targetWidth: number,
  targetHeight: number,
  cropToOg?: boolean,
  quality = 0.82
): Promise<Blob> {
  const worker = getSharedWorker();
  if (!worker) {
    return processOnMainThread(file, targetWidth, targetHeight, cropToOg, quality);
  }

  return new Promise((resolve, reject) => {
    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timeout = setTimeout(() => {
      worker.removeEventListener('message', handleMessage);
      // Fall back to main thread if worker doesn't respond
      processOnMainThread(file, targetWidth, targetHeight, cropToOg, quality)
        .then(resolve)
        .catch(reject);
    }, 12000);

    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.id === id) {
        clearTimeout(timeout);
        worker.removeEventListener('message', handleMessage);
        if (e.data.success && e.data.blob) {
          resolve(e.data.blob);
        } else {
          // If worker fails, fallback to main thread
          processOnMainThread(file, targetWidth, targetHeight, cropToOg, quality)
            .then(resolve)
            .catch(reject);
        }
      }
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage({ id, file, targetWidth, targetHeight, cropToOg, quality });
  });
}

/**
 * Loads an image file into an HTMLImageElement in the browser (fallback).
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to read image data in browser'));
    };

    img.src = objectUrl;
  });
}

/**
 * Helper to convert Blob to base64 (only executed on fallback paths).
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.replace(/^data:image\/[a-z]+;base64,/, ''));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts any uploaded image to WebP with resizing applied BEFORE encoding.
 * Offloads heavy work to a background Web Worker so the main UI never freezes.
 * Uses browser-native hardware-accelerated WebP encoding with a single pass.
 */
export async function convertToWebP(
  file: File,
  preset: ImagePreset,
  initialQuality = 0.82,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ blob: Blob; stats: ImageProcessingStats }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  onProgress?.({
    step: 'compressing',
    percent: 25,
    stage: 'Inspecting dimensions & preparing downsampling...',
  });

  // Fast dimension probe without allocating full RGBA main-thread buffers
  let origWidth = 1920;
  let origHeight = 1080;
  if (typeof createImageBitmap === 'function') {
    try {
      const probe = await createImageBitmap(file);
      origWidth = probe.width;
      origHeight = probe.height;
      probe.close(); // Immediate memory release
    } catch {
      const img = await loadImageFromFile(file);
      origWidth = img.naturalWidth || img.width;
      origHeight = img.naturalHeight || img.height;
    }
  } else {
    const img = await loadImageFromFile(file);
    origWidth = img.naturalWidth || img.width;
    origHeight = img.naturalHeight || img.height;
  }

  const { width: targetWidth, height: targetHeight, cropToOg } = calculateTargetDimensions(
    origWidth,
    origHeight,
    preset
  );

  onProgress?.({
    step: 'compressing',
    percent: 55,
    stage: `Downsampling to ${targetWidth}x${targetHeight} & encoding WebP in background...`,
  });

  // RESIZE FIRST, ENCODE ONCE:
  // Runs in background worker off the main thread with native WebP encoding
  const blob = await processWithWorker(file, targetWidth, targetHeight, cropToOg, initialQuality);

  const originalSizeBytes = file.size;
  const newSizeBytes = blob.size;
  const savings = Math.max(0, Math.round(((originalSizeBytes - newSizeBytes) / originalSizeBytes) * 100));

  const stats: ImageProcessingStats = {
    originalSizeBytes,
    newSizeBytes,
    originalSizeFormatted: formatBytes(originalSizeBytes),
    newSizeFormatted: formatBytes(newSizeBytes),
    compressionRatio: savings > 0 ? `${savings}% smaller` : 'optimized',
    width: targetWidth,
    height: targetHeight,
    format: 'image/webp',
  };

  onProgress?.({
    step: 'compressing',
    percent: 100,
    stage: `Optimized to ${stats.newSizeFormatted} (${stats.compressionRatio})`,
  });

  return { blob, stats };
}

/**
 * Uploads the converted WebP image.
 * 1. Primary destination: Firebase Storage (using uploadBytesResumable for real-time progress events).
 * 2. Compresses before upload to the preset target size, resulting in tiny binary uploads.
 * 3. Never converts to Base64 unless falling back to server / Firestore fallback routes.
 */
export async function uploadImage(
  file: File,
  preset: ImagePreset,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // Step 1: Compress & resize off the main thread
  const { blob, stats } = await convertToWebP(file, preset, 0.82, onProgress);

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^.]+$/, '');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const mediaId = `img_${timestamp}_${randomSuffix}`;
  const storagePath = `media/${mediaId}_${cleanName}.webp`;

  // Step 2: Upload to Firebase Storage with real-time resumable progress events
  onProgress?.({
    step: 'uploading',
    percent: 0,
    stage: 'Connecting to Firebase Storage...',
    totalBytes: blob.size,
  });

  try {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, blob, {
      contentType: 'image/webp',
      cacheControl: 'public, max-age=31536000, immutable',
    });

    const downloadUrl = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const percent = Math.min(99, Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            onProgress?.({
              step: 'uploading',
              percent,
              stage: `Uploading to Firebase Storage: ${percent}% (${formatBytes(snapshot.bytesTransferred)} / ${formatBytes(snapshot.totalBytes)})`,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
            });
          }
        },
        (storageErr) => {
          reject(storageErr);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });

    if (downloadUrl && downloadUrl.startsWith('http')) {
      onProgress?.({
        step: 'completed',
        percent: 100,
        stage: 'Upload complete! Stored in Firebase Storage',
      });

      return {
        url: downloadUrl,
        method: 'firebase_storage',
        stats,
      };
    }
  } catch (storageError: any) {
    console.warn(
      'Firebase Storage unavailable or encountered error:',
      storageError?.message || storageError,
      '-> Falling back to server media storage (/api/upload-media)...'
    );
  }

  // ==========================================
  // FALLBACK 1: Resilient server endpoint (/api/upload-media)
  // ==========================================
  onProgress?.({
    step: 'uploading',
    percent: 40,
    stage: 'Uploading to server media storage...',
  });

  try {
    const base64 = await blobToBase64(blob);
    const response = await fetch('/api/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mediaId,
        base64,
        name: `${cleanName}.webp`,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      onProgress?.({
        step: 'completed',
        percent: 100,
        stage: 'Upload complete! Stored via server route',
      });

      return {
        url: data.url || `/media/${mediaId}`,
        method: 'firestore_document',
        stats,
      };
    }
  } catch (serverErr) {
    console.warn('Server media route fallback failed:', serverErr);
  }

  // ==========================================
  // FALLBACK 2: Firestore Document (media collection)
  // ==========================================
  onProgress?.({
    step: 'uploading',
    percent: 70,
    stage: 'Saving to Firestore media collection...',
  });

  try {
    const base64 = await blobToBase64(blob);
    const mediaDocRef = doc(db, 'media', mediaId);
    await setDoc(mediaDocRef, {
      base64,
      contentType: 'image/webp',
      name: `${cleanName}.webp`,
      sizeBytes: blob.size,
      width: stats.width,
      height: stats.height,
      createdAt: new Date().toISOString(),
    });

    onProgress?.({
      step: 'completed',
      percent: 100,
      stage: 'Upload complete!',
    });

    return {
      url: `/media/${mediaId}`,
      method: 'firestore_document',
      stats,
    };
  } catch (firestoreError) {
    console.warn('Client Firestore media document save failed:', firestoreError);
  }

  // If all persistent remotes failed, return local object URL
  const localUrl = URL.createObjectURL(blob);
  return {
    url: localUrl,
    method: 'firestore_document',
    stats,
  };
}
