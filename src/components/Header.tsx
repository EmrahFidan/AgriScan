import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      style={{
        background: scrolled ? 'rgba(250, 248, 245, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(29, 77, 46, 0.1)' : 'none'
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--forest-deep) 0%, var(--forest-medium) 100%)'
              }}
            >
              🌿
            </div>
            <div>
              <h1
                className="text-xl font-bold tracking-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--forest-deep)'
                }}
              >
                AgriScan
              </h1>
              <p className="text-xs" style={{ color: 'var(--sage)' }}>
                Yaprak Analiz Sistemi
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--earth)' }}
            >
              Nasil Calisir?
            </a>
            <a
              href="#"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--earth)' }}
            >
              Hastaliklar
            </a>
            <a
              href="#"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--earth)' }}
            >
              Hakkinda
            </a>
          </nav>

          {/* CTA Button */}
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg"
            style={{
              background: 'var(--amber)',
              color: 'var(--earth)'
            }}
          >
            Baslayalim
          </button>
        </div>
      </div>
    </header>
  );
}
