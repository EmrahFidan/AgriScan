import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf6ef]">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
            Powered by YOLOv11 AI
          </span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d3426] mb-6">
            Detect Tomato Leaf Diseases
            <span className="block text-emerald-700 mt-2">In Seconds</span>
          </h1>

          <p className="text-lg text-[#6b5d4d] max-w-2xl mx-auto mb-10">
            Analyze leaf diseases in drone images from your agricultural fields using AI.
            9 different disease classes, detailed symptoms, and treatment recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/lab"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              <span>Try Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/diseases"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-[#3d3426] font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl border-2 border-[#e8dfd0] inline-flex items-center justify-center gap-2"
            >
              <span>Browse Diseases</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4">
              Easy to Use
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#3d3426] mb-4">
              How It Works
            </h2>
            <p className="text-[#6b5d4d] max-w-2xl mx-auto">
              Detect leaf diseases in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="bg-[#faf6ef] rounded-2xl p-8 text-center border-2 border-[#e8dfd0] hover:border-emerald-300 transition-colors">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                📤
              </div>
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-display text-xl font-bold text-[#3d3426] mb-3">
                Upload Images
              </h3>
              <p className="text-[#6b5d4d] text-sm">
                Drag and drop or select leaf images captured by drone or camera.
                You can upload more than 50 images at once.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#faf6ef] rounded-2xl p-8 text-center border-2 border-[#e8dfd0] hover:border-emerald-300 transition-colors">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                🤖
              </div>
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-display text-xl font-bold text-[#3d3426] mb-3">
                AI Analysis
              </h3>
              <p className="text-[#6b5d4d] text-sm">
                Our YOLOv11 AI model scans your images in seconds and
                detects 9 different disease classes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#faf6ef] rounded-2xl p-8 text-center border-2 border-[#e8dfd0] hover:border-emerald-300 transition-colors">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                📋
              </div>
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-display text-xl font-bold text-[#3d3426] mb-3">
                View Results
              </h3>
              <p className="text-[#6b5d4d] text-sm">
                Get detailed symptoms and treatment recommendations for each disease.
                View all details when multiple diseases are detected.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              to="/lab"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-[#3d3426] font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <span>Click to Get Started</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#faf6ef]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#e8dfd0] text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-bold text-[#3d3426] mb-2">85%+ Accuracy</h4>
              <p className="text-sm text-[#6b5d4d]">High accuracy AI model</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#e8dfd0] text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-bold text-[#3d3426] mb-2">Fast Analysis</h4>
              <p className="text-sm text-[#6b5d4d]">Results in seconds</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#e8dfd0] text-center">
              <div className="text-4xl mb-3">🔬</div>
              <h4 className="font-bold text-[#3d3426] mb-2">9 Disease Classes</h4>
              <p className="text-sm text-[#6b5d4d]">Comprehensive disease detection</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#e8dfd0] text-center">
              <div className="text-4xl mb-3">💊</div>
              <h4 className="font-bold text-[#3d3426] mb-2">Treatment Tips</h4>
              <p className="text-sm text-[#6b5d4d]">Detailed solution recommendations</p>
            </div>
          </div>
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
