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
        ? 'bg-[#faf6ef] shadow-md py-3'
        : 'bg-[#faf6ef] py-4'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🌿
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[#3d3426]">AgriScan</h1>
              <p className="text-xs text-[#6b5d4d] font-medium">Yaprak Analiz Sistemi</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-[#6b5d4d] hover:text-[#3d3426] transition-colors">
              Nasil Calisir?
            </a>
            <a href="#" className="text-sm font-medium text-[#6b5d4d] hover:text-[#3d3426] transition-colors">
              Hastaliklar
            </a>
            <a href="#" className="text-sm font-medium text-[#6b5d4d] hover:text-[#3d3426] transition-colors">
              Hakkinda
            </a>
          </nav>

          {/* CTA */}
          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#3d3426] font-bold rounded-xl text-sm transition-all hover:shadow-lg">
            Baslayalim
          </button>
        </div>
      </div>
    </header>
  );
}
