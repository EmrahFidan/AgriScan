import { useState } from 'react';
import Dropzone from '../components/Dropzone';
import ImageGallery from '../components/ImageGallery';
import Stats from '../components/Stats';

export default function LabPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-[#faf6ef]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
            Analiz Laboratuvari
          </span>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d3426] mb-6">
            Goruntulerinizi Yukleyin ve
            <span className="block text-emerald-700 mt-2">Analiz Edin</span>
          </h1>

          <p className="text-lg text-[#6b5d4d] max-w-2xl mx-auto mb-10">
            Drone veya kamera goruntulerinizi asagidaki alana surukleyin.
            Ayni anda 50+ goruntu yukleyebilirsiniz.
          </p>

          <Dropzone onUploadComplete={handleUploadComplete} />
        </div>
      </section>

      {/* Stats Section */}
      <Stats key={refreshKey} />

      {/* Gallery Section */}
      <section className="py-16 bg-[#faf6ef]">
        <div className="max-w-6xl mx-auto px-6">
          <ImageGallery key={refreshKey} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#3d3426]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🌿
              </div>
              <div>
                <p className="font-display text-xl font-bold text-[#faf6ef]">AgriScan</p>
                <p className="text-sm text-[#d4c4b0]">Akilli Tarim Cozumleri</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1.5 bg-[#4a3f35] text-[#d4c4b0] rounded-full">Domates Yaprak Hastaligi Tespiti</span>
              <span className="px-3 py-1.5 bg-[#4a3f35] text-[#d4c4b0] rounded-full">9 Hastalik Sinifi</span>
              <span className="px-3 py-1.5 bg-amber-500 text-[#3d3426] font-semibold rounded-full">%85+ Dogruluk</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#4a3f35] text-center text-sm text-[#a89880]">
            2024 AgriScan - YOLOv11 AI Model ile Desteklenmektedir
          </div>
        </div>
      </footer>
    </div>
  );
}
