import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export function compressImageToWebP(
  file: File,
  maxSizeBytes: number = 300 * 1024,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob failed'));
                return;
              }
              if (blob.size <= maxSizeBytes || quality <= 0.1) {
                resolve(blob);
              } else {
                quality -= 0.1;
                tryCompress();
              }
            },
            'image/webp',
            quality
          );
        };
        tryCompress();
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function uploadCompressedImageToFirebase(
  file: File,
  pathFolder: string = 'portfolio'
): Promise<string> {
  const compressedBlob = await compressImageToWebP(file);
  const fileName = `${pathFolder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, compressedBlob, { contentType: 'image/webp' });
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

/**
 * Resizes and crops an image to exactly 1200x630 (1.91:1 Open Graph standard ratio),
 * encodes to WebP, and iteratively compresses so the file size is strictly under 300 KB.
 */
export function compressAndCropToOGWebP(
  file: File,
  maxSizeBytes: number = 300 * 1024,
  targetWidth: number = 1200,
  targetHeight: number = 630
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context failed'));
          return;
        }

        // Cover logic: scale up to fill canvas, crop evenly from center
        const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
        const renderWidth = img.width * scale;
        const renderHeight = img.height * scale;
        const offsetX = (targetWidth - renderWidth) / 2;
        const offsetY = (targetHeight - renderHeight) / 2;

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

        let quality = 0.92;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to encode image to WebP'));
                return;
              }
              if (blob.size <= maxSizeBytes || quality <= 0.2) {
                resolve(blob);
              } else {
                quality -= 0.08;
                tryCompress();
              }
            },
            'image/webp',
            quality
          );
        };
        tryCompress();
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Compresses an image to 1200x630 WebP under 300 KB and uploads it,
 * storing it with a public URL and returning the URL and size.
 */
export async function uploadOGImageToFirebase(file: File): Promise<{ url: string; sizeKb: number }> {
  const blob = await compressAndCropToOGWebP(file, 300 * 1024, 1200, 630);
  const sizeKb = Math.round(blob.size / 1024);

  // 1. Try server endpoint first so it's instantly hosted locally & on the container
  try {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((res, rej) => {
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
    });
    reader.readAsDataURL(blob);
    const base64 = await base64Promise;

    const res = await fetch('/api/upload-og-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64 }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return { url: data.url, sizeKb };
      }
    }
  } catch {
    // Fall back to Firebase Storage
  }

  // 2. Firebase Storage fallback
  const fileName = `seo/og_image_${Date.now()}.webp`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, blob, { contentType: 'image/webp' });
  const url = await getDownloadURL(storageRef);
  return { url, sizeKb };
}
