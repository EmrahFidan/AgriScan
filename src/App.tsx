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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            YOLOv11 Yapay Zeka Destekli
          </span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Drone Goruntulerinizi
            <span className="block text-green-600 mt-2">Analiz Edin</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Tarim arazilerinizden alinan goruntulerde yaprak hastaliklarini
            saniyeler icinde tespit edin. 50+ goruntu ayni anda yukleyebilirsiniz.
          </p>

          <Dropzone onUploadComplete={handleUploadComplete} />
        </div>
      </section>

      {/* Stats Section */}
      <Stats key={refreshKey} />

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <ImageGallery key={refreshKey} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-green-800 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-xl">
                🌿
              </div>
              <div>
                <p className="font-display font-semibold">AgriScan</p>
                <p className="text-sm text-green-200">Akilli Tarim Cozumleri</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-green-200">
              <span>Domates Yaprak Hastaligi Tespiti</span>
              <span>9 Hastalik Sinifi</span>
              <span>%85+ Dogruluk</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-green-700 text-center text-sm text-green-300">
            2024 AgriScan - YOLOv11 AI Model ile Desteklenmektedir
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
