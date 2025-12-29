import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#faf6ef] shadow-md py-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🌿
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[#3d3426]">AgriScan</h1>
              <p className="text-xs text-[#6b5d4d] font-medium">Yaprak Analiz Sistemi</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-emerald-600' : 'text-[#6b5d4d] hover:text-[#3d3426]'
              }`}
            >
              Nasil Calisir?
            </Link>
            <Link
              to="/hastaliklar"
              className={`text-sm font-medium transition-colors ${
                isActive('/hastaliklar') ? 'text-emerald-600' : 'text-[#6b5d4d] hover:text-[#3d3426]'
              }`}
            >
              Hastaliklar
            </Link>
          </nav>

          {/* CTA */}
          <Link
            to="/lab"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#3d3426] font-bold rounded-xl text-sm transition-all hover:shadow-lg"
          >
            Hemen Deneyin
          </Link>
        </div>
      </div>
    </header>
  );
}
