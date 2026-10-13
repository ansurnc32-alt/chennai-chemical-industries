import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, MapPin, Shield } from 'lucide-react';

interface HeaderProps {
  onRequestQuote: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onRequestQuote, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Products', href: '#products' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Quality', href: '#quality' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-19">
          {/* Scientific Logo & Wordmark Branding */}
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-teal-600 rounded-sm"
          >
            {/* Desktop & Tablet: Full Official Logo (Preserves natural 2.85:1 aspect ratio) */}
            <img
              src="/assets/chennaichemicalindustries_logo.png"
              alt="Chennai Chemical Industries - Reliable Chemistry for Ambitious Science"
              className="h-11 sm:h-12 w-auto object-contain hidden sm:block max-w-[260px] md:max-w-[300px]"
            />

            {/* Compact Header & Mobile: Official C Molecular Icon + Typography */}
            <div className="flex items-center gap-2.5 sm:hidden">
              <img
                src="/assets/chennaichemicalindustries_favicon.png"
                alt="Chennai Chemical Industries"
                className="w-9 h-9 object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-teal-900 transition-colors leading-tight">
                  Chennai Chemical
                </span>
                <span className="text-[10px] tracking-widest text-slate-500 uppercase font-mono font-medium">
                  Industries
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all ${
                    isActive
                      ? 'text-teal-800 bg-teal-50/80 font-bold border-b-2 border-teal-600'
                      : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onRequestQuote}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#0a1324] hover:bg-teal-700 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98 group overflow-hidden"
            >
              <span className="relative z-10">Request a Quote</span>
              <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in fade-in duration-150">
          <div className="pb-2.5 border-b border-slate-100 flex items-center">
            <img
              src="/assets/chennaichemicalindustries_logo.png"
              alt="Chennai Chemical Industries"
              className="h-9 w-auto object-contain"
            />
          </div>

          <div className="text-[11px] text-slate-500 font-mono pb-2 border-b border-slate-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>APIIC Industrial Park, Gajuwaka, AP</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-slate-700">
              <a href="tel:7619431029" className="text-teal-700 font-bold hover:underline">
                7619431029
              </a>
              <span>·</span>
              <a href="mailto:chennaichemicalindustries@gmail.com" className="text-teal-700 hover:underline">
                chennaichemicalindustries@gmail.com
              </a>
              <span>·</span>
              <a href="mailto:sales@chennaichemicalindustries.com" className="text-teal-700 hover:underline">
                sales@chennaichemicalindustries.com
              </a>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="#/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-slate-50 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>Admin Portal</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestQuote();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#0a1324] rounded-xl hover:bg-teal-700 transition-colors cursor-pointer"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
