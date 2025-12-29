import { useEffect, useState } from 'react';
import { ImageData } from '../types';
import { subscribeToImages } from '../services/firestore';

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToImages((imgs) => {
      setImages(imgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌱</div>
        <p className="text-gray-500 text-lg">Henuz goruntu yuklenmedi</p>
        <p className="text-gray-400 text-sm mt-2">
          Yukaridaki alani kullanarak goruntu yukleyebilirsiniz
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Yuklenen Goruntuler ({images.length})
        </h2>
        <div className="flex gap-2 text-sm">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
            {images.filter(i => i.analyzed).length} Analiz Edildi
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            {images.filter(i => !i.analyzed).length} Bekliyor
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
          >
            <div className="aspect-square">
              <img
                src={image.url}
                alt={image.fileName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              {image.analyzed ? (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  Analiz Edildi
                </span>
              ) : (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  Bekliyor
                </span>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
              <div className="p-3 w-full">
                <p className="text-white text-sm truncate">{image.fileName}</p>
                <p className="text-gray-300 text-xs">
                  {image.uploadedAt?.toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
