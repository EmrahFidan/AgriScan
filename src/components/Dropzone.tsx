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
        className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 shadow-lg ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50 scale-[1.02] shadow-emerald-100'
            : 'border-stone-300 bg-gradient-to-br from-white to-amber-50/30 hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-xl'
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
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl shadow-emerald-200 ${
            isUploading ? 'animate-pulse' : isDragging ? 'animate-bounce' : ''
          }`}>
            <span className="text-4xl">
              {isUploading ? '⏳' : isDragging ? '📥' : '🌿'}
            </span>
          </div>

          {/* Text */}
          <div>
            <h3 className="font-display text-2xl font-bold text-stone-800 mb-2">
              {isUploading
                ? 'Goruntuler Yukleniyor...'
                : isDragging
                  ? 'Birakin!'
                  : 'Goruntuleri Buraya Surukleyin'
              }
            </h3>
            <p className="text-stone-500">
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
                <span key={format} className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-full text-xs font-semibold">
                  {format}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-xs font-bold shadow-sm">
                Coklu Secim
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      {progresses.length > 0 && (
        <div className="mt-6 p-5 bg-white rounded-2xl shadow-lg border border-stone-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-stone-700">Yukleme Durumu</span>
            </div>
            <span className="text-sm font-bold px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-sm">
              {completedCount} / {totalCount}
            </span>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto">
            {progresses.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm ${
                  p.status === 'completed' ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white' :
                  p.status === 'error' ? 'bg-gradient-to-br from-red-400 to-red-500 text-white' :
                  'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                }`}>
                  {p.status === 'completed' ? '✓' :
                   p.status === 'error' ? '✕' :
                   p.status === 'uploading' ? '↑' : '○'}
                </div>

                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate text-sm text-stone-700">{p.fileName}</p>
                  <div className="w-full h-2 bg-stone-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        p.status === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                        p.status === 'error' ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'
                      }`}
                      style={{ width: p.progress + '%' }}
                    />
                  </div>
                </div>

                <span className={`text-sm font-bold flex-shrink-0 ${
                  p.status === 'completed' ? 'text-emerald-600' :
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
