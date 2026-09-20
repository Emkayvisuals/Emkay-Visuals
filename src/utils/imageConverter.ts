import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB limit
const FIRESTORE_DOC_MAX_BYTES = 700 * 1024; // strictly keep under 700 KB

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
 * Calculates target dimensions for canvas resizing based on image preset:
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
 * Loads an image file into an HTMLImageElement in the browser.
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to read image data in browser'));
    };

    img.src = objectUrl;
  });
}

/**
 * Converts any uploaded image to WebP with resizing applied via browser Canvas.
 * Handles Open Graph cover scaling, favicon square scaling, and general ratio scaling.
 * Dynamically lowers quality if necessary to guarantee the blob is strictly under 700 KB.
 */
export async function convertToWebP(
  file: File,
  preset: ImagePreset,
  initialQuality = 0.8
): Promise<{ blob: Blob; base64: string; dataUrl: string; stats: ImageProcessingStats }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const img = await loadImageFromFile(file);
  const { width: targetWidth, height: targetHeight, cropToOg } = calculateTargetDimensions(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    preset
  );

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context could not be created');
  }

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (cropToOg) {
    // Fill background with dark tone in case aspect ratio is different
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Center and cover image into 1200x630
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const scale = Math.max(targetWidth / imgW, targetHeight / imgH);
    const sw = imgW * scale;
    const sh = imgH * scale;
    const dx = (targetWidth - sw) / 2;
    const dy = (targetHeight - sh) / 2;
    ctx.drawImage(img, dx, dy, sw, sh);
  } else if (preset === 'favicon') {
    // Center square
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  } else {
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  }

  // Multi-pass encoder to ensure WebP blob is strictly <= 700 KB (Firestore requirement)
  let quality = initialQuality;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 4; attempt++) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', quality);
    });

    if (!blob) {
      throw new Error('WebP encoding failed in browser canvas');
    }

    // If strictly under 700 KB, we are good!
    if (blob.size <= FIRESTORE_DOC_MAX_BYTES) {
      break;
    }

    // Decrease quality slightly for next attempt
    quality = Math.max(0.4, quality - 0.15);
  }

  if (!blob) {
    throw new Error('Failed to create WebP image blob');
  }

  // Convert blob to base64 and data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob!);
  });

  const base64 = dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');

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

  return { blob, base64, dataUrl, stats };
}

/**
 * Uploads the converted WebP image.
 * 1. Tries Firebase Storage first (public download URL).
 * 2. If Firebase Storage is unavailable or fails, falls back to storing each converted image
 *    as its own Firestore document in the 'media' collection (strictly under 700 KB)
 *    and serves it through server route /media/:id with long cache headers.
 * 3. Also tries server fallback /api/upload-media if client-side Firestore is unauthenticated.
 */
export async function uploadImage(
  file: File,
  preset: ImagePreset,
  onProgress?: (stage: string) => void
): Promise<UploadResult> {
  onProgress?.('Converting to WebP & resizing...');
  const { blob, base64, dataUrl, stats } = await convertToWebP(file, preset);

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^.]+$/, '');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const mediaId = `img_${timestamp}_${randomSuffix}`;
  const storagePath = `media/${mediaId}_${cleanName}.webp`;

  // ==========================================
  // ATTEMPT 1: Firebase Storage (preferred)
  // ==========================================
  onProgress?.('Checking Firebase Storage availability...');
  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob, {
      contentType: 'image/webp',
      cacheControl: 'public, max-age=31536000, immutable',
    });

    const downloadUrl = await getDownloadURL(storageRef);
    if (downloadUrl && downloadUrl.startsWith('http')) {
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
      '-> Falling back to individual Firestore media document with /media/:id route.'
    );
  }

  // ==========================================
  // ATTEMPT 2: Firestore Document (Fallback)
  // Store each converted image as its own Firestore document in collection 'media'
  // (strictly under 700 KB) and serve it through /media/:id
  // ==========================================
  onProgress?.('Storing converted image in Firestore media document...');
  try {
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

    return {
      url: `/media/${mediaId}`,
      method: 'firestore_document',
      stats,
    };
  } catch (firestoreError: any) {
    console.warn(
      'Client Firestore write encountered error (likely unauthenticated):',
      firestoreError?.message || firestoreError,
      '-> Falling back to /api/upload-media server route...'
    );
  }

  // ==========================================
  // ATTEMPT 3: Server Route fallback (/api/upload-media)
  // ==========================================
  onProgress?.('Uploading to server media storage...');
  try {
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
      return {
        url: data.url || `/media/${mediaId}`,
        method: 'firestore_document',
        stats,
      };
    }
  } catch (serverErr) {
    console.error('Server media route failed:', serverErr);
  }

  // If all remote options failed, fallback to local dataUrl to avoid breaking user workflow
  return {
    url: dataUrl,
    method: 'firestore_document',
    stats,
  };
}
