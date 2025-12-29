import Dropzone from './components/Dropzone';
import ImageGallery from './components/ImageGallery';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌿</span>
            <div>
              <h1 className="text-2xl font-bold text-green-700">AgriScan</h1>
              <p className="text-sm text-gray-500">Yaprak Hastaligi Tespit Sistemi</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <section className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Drone Goruntulerinizi Yukleyin
            </h2>
            <p className="text-gray-500 mt-1">
              50+ goruntu ayni anda yukleyebilirsiniz
            </p>
          </div>
          <Dropzone />
        </section>

        {/* Gallery Section */}
        <section>
          <ImageGallery />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>AgriScan - Domates Yaprak Hastaligi Tespiti</p>
          <p className="mt-1">YOLOv11 AI Model ile Desteklenmektedir</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
