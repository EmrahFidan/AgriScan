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
    {
      label: 'Toplam Goruntu',
      value: totalImages,
      icon: '📷',
      bgIcon: 'bg-emerald-600',
      bgColor: 'bg-emerald-50/80',
      textColor: 'text-emerald-800'
    },
    {
      label: 'Analiz Edildi',
      value: analyzedImages,
      icon: '✅',
      bgIcon: 'bg-green-600',
      bgColor: 'bg-green-50/80',
      textColor: 'text-green-800'
    },
    {
      label: 'Beklemede',
      value: pendingImages,
      icon: '⏳',
      bgIcon: 'bg-amber-500',
      bgColor: 'bg-amber-50/80',
      textColor: 'text-amber-800'
    },
    {
      label: 'Hastalik Sinifi',
      value: 9,
      icon: '🔬',
      bgIcon: 'bg-[#6b5d4d]',
      bgColor: 'bg-[#f5f0e8]',
      textColor: 'text-earth'
    }
  ];

  return (
    <section className="py-12 bg-[#f5f0e8]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bgColor} p-6 rounded-2xl border border-[#e8dfd0] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-12 h-12 ${stat.bgIcon} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <p className={`text-3xl md:text-4xl font-bold mb-1 font-display ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className="text-sm font-medium text-earth-light">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
