import { useEffect, useState } from 'react';
import type { ImageData } from '../types';
import { subscribeToImages } from '../services/firestore';

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToImages((imgs) => {
      setImages(imgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-pulse"
          style={{ background: 'var(--mint)' }}
        >
          <span className="text-3xl">🌿</span>
        </div>
        <p style={{ color: 'var(--earth-light)' }}>Goruntuler yukleniyor...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6"
          style={{
            background: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
          }}
        >
          <span className="text-5xl">🌱</span>
        </div>
        <h3
          className="text-2xl font-bold mb-3"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--earth)'
          }}
        >
          Henuz Goruntu Yuklenmedi
        </h3>
        <p style={{ color: 'var(--earth-light)' }}>
          Yukaridaki alani kullanarak drone goruntulerinizi yukleyebilirsiniz
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--earth)'
            }}
          >
            Yuklenen Goruntuler
          </h2>
          <p style={{ color: 'var(--earth-light)' }}>
            Toplam {images.length} goruntu analiz icin hazir
          </p>
        </div>

        <div className="flex gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'white' }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--success)' }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--earth)' }}>
              {images.filter(i => i.analyzed).length} Analiz Edildi
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'white' }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--warning)' }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--earth)' }}>
              {images.filter(i => !i.analyzed).length} Bekliyor
            </span>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {images.map((image, idx) => (
          <div
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-slide-up"
            style={{
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              animationDelay: (idx * 0.05) + 's',
              opacity: 0
            }}
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={image.url}
                alt={image.fileName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              {image.analyzed ? (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: 'var(--success)' }}
                >
                  <span className="text-white text-sm">✓</span>
                </div>
              ) : (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: 'var(--warning)' }}
                >
                  <span className="text-white text-sm">⏳</span>
                </div>
              )}
            </div>

            {/* Hover Overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end"
              style={{
                background: 'linear-gradient(to top, rgba(61, 52, 38, 0.9) 0%, transparent 60%)'
              }}
            >
              <div className="p-4">
                <p className="text-white font-medium text-sm truncate mb-1">
                  {image.fileName}
                </p>
                <p className="text-white/70 text-xs">
                  {image.uploadedAt?.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Corner Decoration */}
            <div
              className="absolute bottom-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-20 transition-opacity"
              style={{
                background: 'var(--amber)',
                borderRadius: '0 100% 0 0'
              }}
            />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl overflow-hidden animate-slide-up"
            style={{ background: 'white' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: 'rgba(255,255,255,0.9)',
                color: 'var(--earth)'
              }}
            >
              ✕
            </button>

            {/* Image */}
            <div className="aspect-video">
              <img
                src={selectedImage.url}
                alt={selectedImage.fileName}
                className="w-full h-full object-contain"
                style={{ background: 'var(--cream)' }}
              />
            </div>

            {/* Info Bar */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3
                  className="font-bold text-lg mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--earth)'
                  }}
                >
                  {selectedImage.fileName}
                </h3>
                <p className="text-sm" style={{ color: 'var(--earth-light)' }}>
                  {selectedImage.uploadedAt?.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div
                className="px-4 py-2 rounded-xl flex items-center gap-2"
                style={{
                  background: selectedImage.analyzed ? 'var(--mint)' : 'var(--amber-light)',
                  color: selectedImage.analyzed ? 'var(--forest-deep)' : 'var(--earth)'
                }}
              >
                <span>{selectedImage.analyzed ? '✓' : '⏳'}</span>
                <span className="font-medium">
                  {selectedImage.analyzed ? 'Analiz Edildi' : 'Analiz Bekliyor'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
