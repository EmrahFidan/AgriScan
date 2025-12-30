import { useState } from 'react';
import Dropzone from '../components/Dropzone';
import ImageGallery from '../components/ImageGallery';
import type { ImageData } from '../types';

export default function LabPage() {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleNewImages = (newImages: ImageData[]) => {
    setImages(prev => [...newImages, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-[#faf6ef]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
            Analysis Laboratory
          </span>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d3426] mb-6">
            Upload Your Images and
            <span className="block text-emerald-700 mt-2">Start Analysis</span>
          </h1>

          <p className="text-lg text-[#6b5d4d] max-w-2xl mx-auto mb-10">
            Drag your drone or camera images to the area below.
            You can upload 50+ images at once.
          </p>

          <Dropzone onNewImages={handleNewImages} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#faf6ef] rounded-2xl p-6 text-center shadow-lg border border-[#e8dfd0]">
              <div className="text-3xl font-bold text-emerald-600">{images.length}</div>
              <div className="text-sm text-[#6b5d4d] mt-1">Total Images</div>
            </div>
            <div className="bg-[#faf6ef] rounded-2xl p-6 text-center shadow-lg border border-[#e8dfd0]">
              <div className="text-3xl font-bold text-emerald-600">
                {images.filter(i => i.analyzed).length}
              </div>
              <div className="text-sm text-[#6b5d4d] mt-1">Analyzed</div>
            </div>
            <div className="bg-[#faf6ef] rounded-2xl p-6 text-center shadow-lg border border-[#e8dfd0]">
              <div className="text-3xl font-bold text-amber-500">
                {images.filter(i => !i.analyzed).length}
              </div>
              <div className="text-sm text-[#6b5d4d] mt-1">Pending</div>
            </div>
            <div className="bg-[#faf6ef] rounded-2xl p-6 text-center shadow-lg border border-[#e8dfd0]">
              <div className="text-3xl font-bold text-red-500">
                {images.filter(i => i.analysisResult?.predictions?.some(p =>
                  p.class.toLowerCase() !== 'healthy'
                )).length}
              </div>
              <div className="text-sm text-[#6b5d4d] mt-1">Disease Detected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-[#faf6ef]">
        <div className="max-w-6xl mx-auto px-6">
          <ImageGallery images={images} setImages={setImages} />
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
                <p className="text-sm text-[#d4c4b0]">Smart Agriculture Solutions</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1.5 bg-[#4a3f35] text-[#d4c4b0] rounded-full">Tomato Leaf Disease Detection</span>
              <span className="px-3 py-1.5 bg-[#4a3f35] text-[#d4c4b0] rounded-full">9 Disease Classes</span>
              <span className="px-3 py-1.5 bg-amber-500 text-[#3d3426] font-semibold rounded-full">85%+ Accuracy</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#4a3f35] text-center text-sm text-[#a89880]">
            2024 AgriScan - Powered by YOLOv11 AI Model
          </div>
        </div>
      </footer>
    </div>
  );
}
