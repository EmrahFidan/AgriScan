import { useState } from 'react';
import Dropzone from './components/Dropzone';
import ImageGallery from './components/ImageGallery';
import Header from './components/Header';
import Stats from './components/Stats';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-green-50 to-amber-50/30">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6 shadow-sm">
            YOLOv11 Yapay Zeka Destekli
          </span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 mb-6">
            Drone Goruntulerinizi
            <span className="block text-emerald-700 mt-2">Analiz Edin</span>
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-12">
            Tarim arazilerinizden alinan goruntulerde yaprak hastaliklarini
            saniyeler icinde tespit edin. 50+ goruntu ayni anda yukleyebilirsiniz.
          </p>

          <Dropzone onUploadComplete={handleUploadComplete} />
        </div>
      </section>

      {/* Stats Section */}
      <Stats key={refreshKey} />

      {/* Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-stone-50 to-green-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <ImageGallery key={refreshKey} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gradient-to-r from-emerald-900 to-green-800 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🌿
              </div>
              <div>
                <p className="font-display text-xl font-bold">AgriScan</p>
                <p className="text-sm text-emerald-200">Akilli Tarim Cozumleri</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="px-3 py-1 bg-white/10 rounded-full">Domates Yaprak Hastaligi Tespiti</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">9 Hastalik Sinifi</span>
              <span className="px-3 py-1 bg-amber-500/80 text-white rounded-full font-semibold">%85+ Dogruluk</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm text-emerald-200">
            2024 AgriScan - YOLOv11 AI Model ile Desteklenmektedir
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
