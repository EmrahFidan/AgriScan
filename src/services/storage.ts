import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UploadProgress } from '../types';

// Gorseli yeniden boyutlandir (max 800px)
function resizeImage(file: File, maxSize: number = 800): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // JPEG formatinda %80 kalite
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(
  file: File,
  onProgress: (progress: UploadProgress) => void
): Promise<string> {
  onProgress({
    fileName: file.name,
    progress: 10,
    status: 'uploading'
  });

  try {
    // Gorseli yeniden boyutlandir ve base64'e cevir
    onProgress({
      fileName: file.name,
      progress: 30,
      status: 'uploading'
    });

    const base64Url = await resizeImage(file, 800);

    onProgress({
      fileName: file.name,
      progress: 60,
      status: 'uploading'
    });

    // Firestore'a kaydet
    await addDoc(collection(db, 'images'), {
      fileName: file.name,
      originalName: file.name,
      url: base64Url,
      fileSize: file.size,
      uploadedAt: serverTimestamp(),
      analyzed: false,
      analysisResult: null
    });

    onProgress({
      fileName: file.name,
      progress: 100,
      status: 'completed'
    });

    return base64Url;
  } catch (error: any) {
    console.error('Upload error:', error);
    onProgress({
      fileName: file.name,
      progress: 0,
      status: 'error',
      error: error.message
    });
    return '';
  }
}

export async function uploadMultipleImages(
  files: File[],
  onProgress: (progresses: UploadProgress[]) => void
): Promise<string[]> {
  const progresses: UploadProgress[] = files.map(f => ({
    fileName: f.name,
    progress: 0,
    status: 'pending' as const
  }));

  onProgress([...progresses]);

  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const url = await uploadImage(files[i], (p) => {
      progresses[i] = p;
      onProgress([...progresses]);
    });
    if (url) urls.push(url);
  }

  return urls;
}
