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
      {/* Main Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="relative overflow-hidden rounded-3xl transition-all duration-500"
        style={{
          background: isDragging
            ? 'linear-gradient(135deg, var(--mint) 0%, var(--sage) 100%)'
            : 'white',
          boxShadow: isDragging
            ? '0 25px 50px -12px rgba(26, 77, 46, 0.3)'
            : '0 10px 40px rgba(0,0,0,0.08)',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        {/* Decorative leaf patterns */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'var(--forest-medium)' }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'var(--amber)' }}
        />

        {/* Border */}
        <div
          className="absolute inset-4 rounded-2xl border-2 border-dashed transition-colors duration-300 pointer-events-none"
          style={{
            borderColor: isDragging ? 'var(--forest-deep)' : 'var(--sage)'
          }}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isUploading}
        />

        <div className="relative p-12 md:p-16 text-center">
          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 transition-all duration-300 ${
              isUploading ? 'animate-pulse' : isDragging ? 'animate-bounce' : ''
            }`}
            style={{
              background: isDragging
                ? 'var(--forest-deep)'
                : 'linear-gradient(135deg, var(--forest-light) 0%, var(--forest-medium) 100%)',
              boxShadow: '0 10px 30px rgba(26, 77, 46, 0.3)'
            }}
          >
            <span className="text-4xl">
              {isUploading ? '⏳' : isDragging ? '📥' : '🌿'}
            </span>
          </div>

          {/* Text */}
          <h3
            className="text-2xl font-bold mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              color: isDragging ? 'var(--forest-deep)' : 'var(--earth)'
            }}
          >
            {isUploading
              ? 'Goruntuler Yukleniyor...'
              : isDragging
                ? 'Birakin!'
                : 'Goruntuleri Buraya Surukleyin'
            }
          </h3>
          <p style={{ color: 'var(--earth-light)' }}>
            {isUploading
              ? 'Lutfen bekleyin, dosyalariniz isleniyor'
              : 'veya secmek icin tiklayin'
            }
          </p>

          {/* Supported formats */}
          {!isUploading && (
            <div className="flex items-center justify-center gap-3 mt-6">
              {['PNG', 'JPG', 'JPEG'].map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'var(--cream-dark)',
                    color: 'var(--earth-light)'
                  }}
                >
                  {format}
                </span>
              ))}
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--mint)',
                  color: 'var(--forest-deep)'
                }}
              >
                Coklu Secim
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      {progresses.length > 0 && (
        <div
          className="mt-6 p-6 rounded-2xl animate-slide-up"
          style={{
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: 'var(--success)' }}
              />
              <span
                className="font-medium"
                style={{ color: 'var(--earth)' }}
              >
                Yukleme Durumu
              </span>
            </div>
            <span
              className="text-sm font-semibold px-3 py-1 rounded-full"
              style={{
                background: 'var(--mint)',
                color: 'var(--forest-deep)'
              }}
            >
              {completedCount} / {totalCount}
            </span>
          </div>

          {/* Progress Items */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {progresses.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-xl transition-all"
                style={{ background: 'var(--cream)' }}
              >
                {/* Status Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background:
                      p.status === 'completed' ? 'var(--mint)' :
                      p.status === 'error' ? '#fecaca' :
                      'var(--amber-light)'
                  }}
                >
                  {p.status === 'completed' ? '✓' :
                   p.status === 'error' ? '✕' :
                   p.status === 'uploading' ? '↑' : '○'}
                </div>

                {/* File Info */}
                <div className="flex-grow min-w-0">
                  <p
                    className="font-medium truncate text-sm"
                    style={{ color: 'var(--earth)' }}
                  >
                    {p.fileName}
                  </p>
                  {/* Progress Bar */}
                  <div
                    className="w-full h-1.5 rounded-full mt-2 overflow-hidden"
                    style={{ background: 'var(--cream-dark)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: p.progress + '%',
                        background:
                          p.status === 'completed' ? 'var(--success)' :
                          p.status === 'error' ? 'var(--danger)' :
                          'var(--amber)'
                      }}
                    />
                  </div>
                </div>

                {/* Percentage */}
                <span
                  className="text-sm font-semibold flex-shrink-0"
                  style={{
                    color:
                      p.status === 'completed' ? 'var(--success)' :
                      p.status === 'error' ? 'var(--danger)' :
                      'var(--amber)'
                  }}
                >
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
