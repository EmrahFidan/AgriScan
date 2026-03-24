import { useState, useCallback } from 'react';
import type { UploadProgress, ImageData } from '../types';

interface DropzoneProps {
  onNewImages?: (images: ImageData[]) => void;
}

// File'i base64'e cevir
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Unique ID olustur
const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export default function Dropzone({ onNewImages }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progresses, setProgresses] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('image/')
    );

    if (files.length > 0) {
      await handleUpload(files);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      await handleUpload(files);
    }
    // Input'u resetle (ayni dosyayi tekrar secebilmek icin)
    e.target.value = '';
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);

    // Progress listesini baslat
    const initialProgresses: UploadProgress[] = files.map(f => ({
      fileName: f.name,
      progress: 0,
      status: 'pending'
    }));
    setProgresses(initialProgresses);

    const newImages: ImageData[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Status'u uploading yap
      setProgresses(prev => prev.map((p, idx) =>
        idx === i ? { ...p, status: 'uploading', progress: 30 } : p
      ));

      try {
        // Base64'e cevir
        const base64 = await fileToBase64(file);

        // Progress guncelle
        setProgresses(prev => prev.map((p, idx) =>
          idx === i ? { ...p, progress: 70 } : p
        ));

        // ImageData olustur
        const imageData: ImageData = {
          id: generateId(),
          fileName: file.name,
          url: base64,
          uploadedAt: new Date(),
          analyzed: false
        };

        newImages.push(imageData);

        // Tamamlandi
        setProgresses(prev => prev.map((p, idx) =>
          idx === i ? { ...p, status: 'completed', progress: 100 } : p
        ));
      } catch (error) {
        console.error('File conversion error:', error);
        setProgresses(prev => prev.map((p, idx) =>
          idx === i ? { ...p, status: 'error', progress: 0 } : p
        ));
      }
    }

    // Yeni gorselleri parent'a gonder
    if (newImages.length > 0) {
      onNewImages?.(newImages);
    }

    setIsUploading(false);
    setTimeout(() => setProgresses([]), 3000);
  };

  const completedCount = progresses.filter(p => p.status === 'completed').length;
  const totalCount = progresses.length;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Main Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 shadow-lg ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50 scale-[1.02]'
            : 'border-[#d4c4b0] bg-[#faf6ef] hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-xl'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="space-y-4">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-600 shadow-xl ${
            isUploading ? 'animate-pulse' : isDragging ? 'animate-bounce' : ''
          }`}>
            <span className="text-4xl">
              {isUploading ? '⏳' : isDragging ? '📥' : '🌿'}
            </span>
          </div>

          {/* Text */}
          <div>
            <h3 className="font-display text-2xl font-bold text-earth mb-2">
              {isUploading
                ? 'Uploading Images...'
                : isDragging
                  ? 'Drop Here!'
                  : 'Drag Images Here'
              }
            </h3>
            <p className="text-earth-light">
              {isUploading
                ? 'Please wait, processing your files'
                : 'or click to select'
              }
            </p>
          </div>

          {/* Supported formats */}
          {!isUploading && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {['PNG', 'JPG', 'JPEG'].map((format) => (
                <span key={format} className="px-3 py-1.5 bg-[#e8dfd0] text-earth-light rounded-full text-xs font-semibold">
                  {format}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-amber-500 text-[#3d3426] rounded-full text-xs font-bold shadow-sm">
                Multi Select
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      {progresses.length > 0 && (
        <div className="mt-6 p-5 bg-[#faf6ef] rounded-2xl shadow-lg border border-[#e8dfd0]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-earth">Upload Status</span>
            </div>
            <span className="text-sm font-bold px-4 py-1.5 bg-emerald-600 text-white rounded-full shadow-sm">
              {completedCount} / {totalCount}
            </span>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto">
            {progresses.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#f5f0e8] rounded-xl border border-[#e8dfd0]">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm ${
                  p.status === 'completed' ? 'bg-emerald-600 text-white' :
                  p.status === 'error' ? 'bg-red-500 text-white' :
                  'bg-amber-500 text-white'
                }`}>
                  {p.status === 'completed' ? '✓' :
                   p.status === 'error' ? '✕' :
                   p.status === 'uploading' ? '↑' : '○'}
                </div>

                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate text-sm text-earth">{p.fileName}</p>
                  <div className="w-full h-2 bg-[#e8dfd0] rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        p.status === 'completed' ? 'bg-emerald-500' :
                        p.status === 'error' ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                      style={{ width: p.progress + '%' }}
                    />
                  </div>
                </div>

                <span className={`text-sm font-bold flex-shrink-0 ${
                  p.status === 'completed' ? 'text-emerald-700' :
                  p.status === 'error' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {Math.round(p.progress)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
