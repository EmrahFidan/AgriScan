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
      gradient: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      label: 'Analiz Edildi',
      value: analyzedImages,
      icon: '✅',
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'Beklemede',
      value: pendingImages,
      icon: '⏳',
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      label: 'Hastalik Sinifi',
      value: 9,
      icon: '🔬',
      gradient: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50/50 to-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bgColor} p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <p className={`text-3xl md:text-4xl font-bold mb-1 font-display ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className="text-sm font-medium text-stone-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
