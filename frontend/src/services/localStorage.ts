import type { ImageData, AnalysisResult } from '../types';

const STORAGE_KEY = 'agriscan_images';

export function loadImages(): ImageData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ImageData[];
    return parsed.map(img => ({
      ...img,
      uploadedAt: new Date(img.uploadedAt)
    }));
  } catch {
    return [];
  }
}

export function saveImages(images: ImageData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch {
    // localStorage dolu olabilir (base64 görseller büyük)
    console.warn('localStorage kayıt hatası — depolama alanı dolu olabilir.');
  }
}

export function updateImageAnalysis(id: string, result: AnalysisResult): void {
  const images = loadImages();
  const updated = images.map(img =>
    img.id === id ? { ...img, analyzed: true, analysisResult: result } : img
  );
  saveImages(updated);
}

export function removeImage(id: string): void {
  const images = loadImages().filter(img => img.id !== id);
  saveImages(images);
}

export function clearImages(): void {
  localStorage.removeItem(STORAGE_KEY);
}
