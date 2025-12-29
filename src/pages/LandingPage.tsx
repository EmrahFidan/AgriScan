import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf6ef]">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
            YOLOv11 Yapay Zeka Destekli
          </span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d3426] mb-6">
            Domates Yaprak Hastaliklarini
            <span className="block text-emerald-700 mt-2">Saniyeler Icinde Tespit Edin</span>
          </h1>

          <p className="text-lg text-[#6b5d4d] max-w-2xl mx-auto mb-10">
            Tarim arazilerinizden alinan drone goruntularinde yaprak hastaliklarini
            yapay zeka ile analiz edin. 9 farkli hastalik sinifi, detayli belirtiler ve tedavi onerileri.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/lab"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              <span>Hemen Deneyin</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/hastaliklar"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-[#3d3426] font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl border-2 border-[#e8dfd0] inline-flex items-center justify-center gap-2"
            >
              <span>Hastaliklari Incele</span>
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
              Kolay Kullanim
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#3d3426] mb-4">
              Nasil Calisir?
            </h2>
            <p className="text-[#6b5d4d] max-w-2xl mx-auto">
              Sadece 3 adimda yaprak hastaliklarini tespit edin
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
                Goruntu Yukleyin
              </h3>
              <p className="text-[#6b5d4d] text-sm">
                Drone veya kamera ile cektiginiz yaprak goruntularini surukleyip birakin veya secin.
                Ayni anda 50'den fazla goruntu yukleyebilirsiniz.
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
                AI Analiz Etsin
              </h3>
              <p className="text-[#6b5d4d] text-sm">
                YOLOv11 yapay zeka modelimiz goruntulerinizi saniyeler icinde tarar ve
                9 farkli hastalik sinifini tespit eder.
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
                Sonuclari Gorun
              </h3>
              <p className="text-[#6b5d4d] text-sm">
                Her hastalik icin detayli belirtiler ve tedavi onerileri alin.
                Birden fazla hastalik tespiti durumunda tum detaylari gorebilirsiniz.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              to="/lab"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-[#3d3426] font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <span>Baslamak Icin Tiklayin</span>
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
              <h4 className="font-bold text-[#3d3426] mb-2">%85+ Dogruluk</h4>
              <p className="text-sm text-[#6b5d4d]">Yuksek dogruluk oranli AI modeli</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#e8dfd0] text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-bold text-[#3d3426] mb-2">Hizli Analiz</h4>
              <p className="text-sm text-[#6b5d4d]">Saniyeler icinde sonuc</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#e8dfd0] text-center">
              <div className="text-4xl mb-3">🔬</div>
              <h4 className="font-bold text-[#3d3426] mb-2">9 Hastalik Sinifi</h4>
              <p className="text-sm text-[#6b5d4d]">Kapsamli hastalik tespiti</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#e8dfd0] text-center">
              <div className="text-4xl mb-3">💊</div>
              <h4 className="font-bold text-[#3d3426] mb-2">Tedavi Onerileri</h4>
              <p className="text-sm text-[#6b5d4d]">Detayli cozum onerileri</p>
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
