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
      scrolled ? 'bg-white/95 backdrop-blur shadow-sm py-3' : 'bg-white py-4'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-xl shadow-lg">
              🌿
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">AgriScan</h1>
              <p className="text-xs text-gray-500">Yaprak Analiz Sistemi</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Nasil Calisir?
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Hastaliklar
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Hakkinda
            </a>
          </nav>

          {/* CTA */}
          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg">
            Baslayalim
          </button>
        </div>
      </div>
    </header>
  );
}
