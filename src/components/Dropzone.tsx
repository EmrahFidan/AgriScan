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
    <div className="w-full max-w-xl mx-auto">
      {/* Main Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-green-500 bg-green-50 scale-[1.02]'
            : 'border-gray-300 bg-white hover:border-green-400 hover:bg-gray-50'
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
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg ${
            isUploading ? 'animate-pulse' : isDragging ? 'animate-bounce' : ''
          }`}>
            <span className="text-3xl">
              {isUploading ? '⏳' : isDragging ? '📥' : '🌿'}
            </span>
          </div>

          {/* Text */}
          <div>
            <h3 className="font-display text-xl font-bold text-gray-800 mb-2">
              {isUploading
                ? 'Goruntuler Yukleniyor...'
                : isDragging
                  ? 'Birakin!'
                  : 'Goruntuleri Buraya Surukleyin'
              }
            </h3>
            <p className="text-gray-500">
              {isUploading
                ? 'Lutfen bekleyin, dosyalariniz isleniyor'
                : 'veya secmek icin tiklayin'
              }
            </p>
          </div>

          {/* Supported formats */}
          {!isUploading && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {['PNG', 'JPG', 'JPEG'].map((format) => (
                <span key={format} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {format}
                </span>
              ))}
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Coklu Secim
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      {progresses.length > 0 && (
        <div className="mt-6 p-5 bg-white rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-gray-700">Yukleme Durumu</span>
            </div>
            <span className="text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
              {completedCount} / {totalCount}
            </span>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto">
            {progresses.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                  p.status === 'completed' ? 'bg-green-100 text-green-600' :
                  p.status === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {p.status === 'completed' ? '✓' :
                   p.status === 'error' ? '✕' :
                   p.status === 'uploading' ? '↑' : '○'}
                </div>

                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate text-sm text-gray-700">{p.fileName}</p>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        p.status === 'completed' ? 'bg-green-500' :
                        p.status === 'error' ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                      style={{ width: p.progress + '%' }}
                    />
                  </div>
                </div>

                <span className={`text-sm font-semibold flex-shrink-0 ${
                  p.status === 'completed' ? 'text-green-600' :
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
