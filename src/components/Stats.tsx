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
      color: 'var(--forest-medium)'
    },
    {
      label: 'Analiz Edildi',
      value: analyzedImages,
      icon: '✅',
      color: 'var(--success)'
    },
    {
      label: 'Beklemede',
      value: pendingImages,
      icon: '⏳',
      color: 'var(--warning)'
    },
    {
      label: 'Hastalik Sinifi',
      value: 9,
      icon: '🔬',
      color: 'var(--amber)'
    }
  ];

  return (
    <section className="py-12 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group relative p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl animate-slide-up"
              style={{
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                animationDelay: (idx * 0.1) + 's',
                opacity: 0
              }}
            >
              {/* Decorative corner */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] opacity-10 transition-opacity group-hover:opacity-20"
                style={{ background: stat.color }}
              />

              <div className="relative">
                <span className="text-3xl mb-3 block">{stat.icon}</span>
                <p
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: stat.color
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--earth-light)' }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
