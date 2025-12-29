import { useState, useCallback } from 'react';
import type { UploadProgress } from '../types';
import { uploadMultipleImages } from '../services/storage';

interface DropzoneProps {
  onUploadComplete?: () => void;
}

export default function Dropzone({ onUploadComplete }: DropzoneProps) {
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
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      await uploadMultipleImages(files, setProgresses);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgresses([]), 3000);
    }
  };

  const completedCount = progresses.filter(p => p.status === 'completed').length;
  const totalCount = progresses.length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }
        `}
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
          <div className="text-6xl">
            {isUploading ? '⏳' : '📸'}
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-700">
              {isUploading
                ? 'Yukleniyor...'
                : 'Goruntuleri buraya surukleyin'
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              veya secmek icin tiklayin
            </p>
          </div>
          {!isUploading && (
            <p className="text-xs text-gray-400">
              PNG, JPG, JPEG - Coklu secim desteklenir
            </p>
          )}
        </div>
      </div>

      {/* Progress Bars */}
      {progresses.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Yukleme Durumu</span>
            <span>{completedCount} / {totalCount} tamamlandi</span>
          </div>

          {progresses.map((p, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium truncate max-w-xs">
                  {p.fileName}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  p.status === 'completed' ? 'bg-green-100 text-green-700' :
                  p.status === 'error' ? 'bg-red-100 text-red-700' :
                  p.status === 'uploading' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {p.status === 'completed' ? 'Tamamlandi' :
                   p.status === 'error' ? 'Hata' :
                   p.status === 'uploading' ? 'Yukleniyor' : 'Bekliyor'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    p.status === 'completed' ? 'bg-green-500' :
                    p.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: p.progress + '%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
