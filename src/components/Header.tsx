import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#faf6ef]/95 backdrop-blur-md shadow-md py-3'
        : 'bg-gradient-to-r from-amber-50/80 to-[#faf6ef] py-4'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🌿
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-earth">AgriScan</h1>
              <p className="text-xs text-earth-light font-medium">Yaprak Analiz Sistemi</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-earth-light hover:text-earth transition-colors">
              Nasil Calisir?
            </a>
            <a href="#" className="text-sm font-medium text-earth-light hover:text-earth transition-colors">
              Hastaliklar
            </a>
            <a href="#" className="text-sm font-medium text-earth-light hover:text-earth transition-colors">
              Hakkinda
            </a>
          </nav>

          {/* CTA */}
          <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5">
            Baslayalim
          </button>
        </div>
      </div>
    </header>
  );
}
