import { useEffect, useState } from 'react';
import { subscribeToImages } from '../services/firestore';
import type { ImageData } from '../types';

export default function Stats() {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToImages(setImages);
    return () => unsubscribe();
  }, []);

  const totalImages = images.length;
  const analyzedImages = images.filter(i => i.analyzed).length;
  const pendingImages = images.filter(i => !i.analyzed).length;

  const stats = [
    { label: 'Toplam Goruntu', value: totalImages, icon: '📷', colorClass: 'text-green-600' },
    { label: 'Analiz Edildi', value: analyzedImages, icon: '✅', colorClass: 'text-emerald-600' },
    { label: 'Beklemede', value: pendingImages, icon: '⏳', colorClass: 'text-amber-600' },
    { label: 'Hastalik Sinifi', value: 9, icon: '🔬', colorClass: 'text-blue-600' }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mb-3 block">{stat.icon}</span>
              <p className={`text-3xl md:text-4xl font-bold mb-1 font-display ${stat.colorClass}`}>
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
