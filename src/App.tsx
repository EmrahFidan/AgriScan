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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
             style={{ background: 'var(--mint)' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
             style={{ background: 'var(--amber)' }} />
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-12 animate-slide-up">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
                  style={{ background: 'var(--mint)', color: 'var(--forest-deep)' }}>
              YOLOv11 Yapay Zeka Destekli
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--forest-deep)' }}>
              Drone Goruntulerinizi
              <span className="block mt-2" style={{ color: 'var(--amber)' }}>
                Analiz Edin
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto"
               style={{ color: 'var(--earth-light)' }}>
              Tarim arazilerinizden alinan goruntulerle yaprak hastaliklarini 
              saniyeler icinde tespit edin. 50+ goruntu ayni anda yukleyebilirsiniz.
            </p>
          </div>

          {/* Upload Section */}
          <div className="animate-slide-up stagger-2" style={{ opacity: 0 }}>
            <Dropzone onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats key={refreshKey} />

      {/* Gallery Section */}
      <section className="py-16 flex-grow" style={{ background: 'var(--cream-dark)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <ImageGallery key={refreshKey} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ background: 'var(--forest-deep)', color: 'var(--cream)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                   style={{ background: 'var(--amber)' }}>
                🌿
              </div>
              <div>
                <p className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                  AgriScan
                </p>
                <p className="text-sm opacity-70">Akilli Tarim Cozumleri</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-sm opacity-70">
              <span>Domates Yaprak Hastaligi Tespiti</span>
              <span className="hidden md:inline">•</span>
              <span>9 Hastalik Sinifi</span>
              <span className="hidden md:inline">•</span>
              <span>%85+ Dogruluk</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm opacity-50">
            <p>2024 AgriScan. YOLOv11 AI Model ile Desteklenmektedir.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
