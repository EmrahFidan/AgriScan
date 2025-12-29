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
        <div className="w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center mb-4 animate-pulse shadow-xl">
          <span className="text-4xl">🌿</span>
        </div>
        <p className="text-earth-light font-medium">Goruntuler yukleniyor...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-6 bg-[#faf6ef] shadow-xl border border-[#e8dfd0]">
          <span className="text-6xl">🌱</span>
        </div>
        <h3 className="font-display text-2xl font-bold mb-3 text-earth">
          Henuz Goruntu Yuklenmedi
        </h3>
        <p className="text-earth-light max-w-md mx-auto">
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
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-earth">
            Yuklenen Goruntuler
          </h2>
          <p className="text-earth-light">
            Toplam <span className="font-semibold text-emerald-700">{images.length}</span> goruntu analiz icin hazir
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-emerald-800">
              {images.filter(i => i.analyzed).length} Analiz Edildi
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-amber-800">
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
            className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-[#faf6ef] shadow-lg hover:shadow-2xl animate-slideUp border border-[#e8dfd0]"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden bg-[#f5f0e8]">
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
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">⏳</span>
                </div>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d3426]/90 via-[#3d3426]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
              <div className="p-4">
                <p className="text-white font-semibold text-sm truncate mb-1">
                  {image.fileName}
                </p>
                <p className="text-amber-200/80 text-xs">
                  {image.uploadedAt?.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Corner Decoration */}
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-tr-full" />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d3426]/90 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#faf6ef] rounded-3xl overflow-hidden animate-slideUp shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-xl bg-[#faf6ef]/95 text-earth flex items-center justify-center transition-all hover:bg-white hover:shadow-lg hover:scale-105"
            >
              ✕
            </button>

            {/* Image */}
            <div className="aspect-video bg-[#f5f0e8]">
              <img
                src={selectedImage.url}
                alt={selectedImage.fileName}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Bar */}
            <div className="p-6 bg-[#faf6ef] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-xl mb-1 text-earth">
                  {selectedImage.fileName}
                </h3>
                <p className="text-sm text-earth-light">
                  {selectedImage.uploadedAt?.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className={`px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm ${
                selectedImage.analyzed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-[#3d3426]'
              }`}>
                <span className="text-lg">{selectedImage.analyzed ? '✓' : '⏳'}</span>
                <span className="font-semibold">
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
