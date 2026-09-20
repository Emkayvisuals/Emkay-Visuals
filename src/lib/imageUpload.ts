import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export function compressImageToWebP(file: File, maxSizeBytes: number = 300 * 1024, maxWidth: number = 1920, maxHeight: number = 1080): Promise<Blob> {
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

export async function uploadCompressedImageToFirebase(file: File, pathFolder: string = 'portfolio'): Promise<string> {
  const compressedBlob = await compressImageToWebP(file);
  const fileName = `${pathFolder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, compressedBlob, { contentType: 'image/webp' });
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}
