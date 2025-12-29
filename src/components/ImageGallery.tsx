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
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4 animate-pulse">
          <span className="text-3xl">🌿</span>
        </div>
        <p className="text-gray-500">Goruntuler yukleniyor...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 bg-white shadow-xl">
          <span className="text-5xl">🌱</span>
        </div>
        <h3 className="font-display text-2xl font-bold mb-3 text-gray-800">
          Henuz Goruntu Yuklenmedi
        </h3>
        <p className="text-gray-500">
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
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            Yuklenen Goruntuler
          </h2>
          <p className="text-gray-500">
            Toplam {images.length} goruntu analiz icin hazir
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-gray-700">
              {images.filter(i => i.analyzed).length} Analiz Edildi
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-gray-700">
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
            className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-white shadow-md hover:shadow-xl animate-slideUp"
            style={{ animationDelay: `${idx * 0.05}s` }}
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
                <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">⏳</span>
                </div>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
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
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-tr-full" />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-white/90 text-gray-700 flex items-center justify-center transition-colors hover:bg-white"
            >
              ✕
            </button>

            {/* Image */}
            <div className="aspect-video bg-gray-100">
              <img
                src={selectedImage.url}
                alt={selectedImage.fileName}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Bar */}
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg mb-1 text-gray-800">
                  {selectedImage.fileName}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedImage.uploadedAt?.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                selectedImage.analyzed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
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
