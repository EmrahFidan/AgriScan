import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UploadProgress } from '../types';

// Local storage - gorseller tarayicide tutulur
// Backend eklenince gercek storage'a gecilecek

export async function uploadImage(
  file: File,
  onProgress: (progress: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve) => {
    // Progress simulasyonu
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      onProgress({
        fileName: file.name,
        progress: Math.min(progress, 90),
        status: 'uploading'
      });
      if (progress >= 90) clearInterval(interval);
    }, 100);

    // Dosyayi local blob URL'e cevir
    const localUrl = URL.createObjectURL(file);

    // Firestore'a metadata kaydet
    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'images'), {
          fileName: file.name,
          originalName: file.name,
          url: localUrl,
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

        resolve(localUrl);
      } catch (error: any) {
        onProgress({
          fileName: file.name,
          progress: 0,
          status: 'error',
          error: error.message
        });
        resolve('');
      }
    }, 500);
  });
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
