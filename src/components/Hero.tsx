import React from 'react';
import { ArrowRight, Search, ShieldCheck, Factory, FlaskConical, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { MolecularBackground } from './MolecularBackground';

interface HeroProps {
  onExploreProducts: () => void;
  onRequestQuote: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProducts,
  onRequestQuote,
  searchQuery,
  onSearchChange,
}) => {
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreProducts();
  };

  const handleShortcutClick = (term: string) => {
    onSearchChange(term);
    onExploreProducts();
  };

  return (
    <section className="relative bg-[#050b16] text-white overflow-hidden border-b border-slate-800/90 scientific-grid-dark">
      {/* Real-time Drifting Molecular Lattice Canvas */}
      <MolecularBackground
        className="absolute inset-0 z-0"
        density="normal"
        opacity={0.65}
      />

      {/* Atmospheric lighting gradients */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-b from-[#050b16]/40 via-transparent to-[#050b16] opacity-90" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Editorial Headline & Search Interface */}
          <div className="lg:col-span-7 space-y-7">
            {/* Enterprise Credential Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-teal-300 bg-teal-950/70 border border-teal-800/80 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>Gajuwaka, Andhra Pradesh, India · B2B Chemical Supplier</span>
            </div>

            {/* Approved Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Reliable Chemistry for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-300">
                  Ambitious Science
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Supplying certified research chemicals, pharmaceutical intermediates, specialty chemicals, custom synthesis, and bulk commercial supply to leading life-science enterprises and chemical manufacturers.
              </p>
            </div>

            {/* Prominent Scientific Search Interface */}
            <div className="space-y-3 max-w-xl">
              <form
                onSubmit={handleQuickSearchSubmit}
                className="relative flex flex-col sm:flex-row gap-2 bg-[#0a1324]/90 p-2 rounded-2xl border border-teal-500/30 backdrop-blur-md shadow-2xl focus-within:border-teal-400 focus-within:shadow-[0_0_20px_rgba(20,184,166,0.25)] transition-all"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-teal-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by Chemical Name, CAS RN, Formula, or Code..."
                    className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm bg-transparent text-white placeholder-slate-400 focus:outline-hidden font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="text-slate-400 hover:text-white text-xs px-2 py-1 mr-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-950 whitespace-nowrap active:scale-98"
                >
                  <span>Search Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Instant Chemical Shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-slate-500 font-sans font-medium">Quick CAS Search:</span>
                {[
                  { label: 'CAS 4926-28-7', query: '4926-28-7' },
                  { label: 'CAS 583-68-6', query: '583-68-6' },
                  { label: 'CAS 1451-82-7', query: '1451-82-7' },
                  { label: 'DMAP', query: 'DMAP' },
                  { label: 'B2pin2', query: 'B2pin2' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleShortcutClick(item.query)}
                    className="px-2.5 py-0.5 rounded-md bg-[#0a1324]/80 hover:bg-teal-900/60 hover:text-teal-300 border border-slate-700/80 font-mono transition-colors cursor-pointer text-slate-300"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProducts}
                className="px-7 py-3.5 bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98 group"
              >
                <span>Explore 38 Chemical Records</span>
                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onRequestQuote}
                className="px-7 py-3.5 bg-transparent text-white border border-slate-700 hover:border-teal-400 hover:text-teal-300 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer backdrop-blur-xs"
              >
                Request a Formal Quote
              </button>
            </div>
          </div>

          {/* Layered Scientific Editorial Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/10 rounded-3xl blur-xl opacity-75"></div>

              {/* Main Visual Container */}
              <div className="relative rounded-3xl overflow-hidden border border-teal-500/30 bg-[#0a1324]/90 shadow-2xl backdrop-blur-md">
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src="/src/assets/images/hero_scientific_molecule.jpg"
                    alt="Precision laboratory glassware reaction and crystallization"
                    className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1324] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Analytical Verified Pill */}
                  <div className="absolute top-4 left-4 bg-[#050b16]/90 backdrop-blur-md border border-teal-500/40 rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[11px] font-mono font-semibold text-emerald-300">
                      Analytical Release Profiling
                    </span>
                  </div>
                </div>

                {/* Technical Credentials Strip */}
                <div className="p-5 sm:p-6 space-y-4 bg-[#0a1324] border-t border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/assets/chennaichemicalindustries_favicon.png"
                        alt="Chennai Chemical Industries"
                        className="w-8 h-8 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(20,184,166,0.35)]"
                      />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-teal-400 font-bold font-mono">
                          Manufacturing & Supply Specs
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          Chennai Chemical Industries
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      Gajuwaka, AP
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#050b16]/70 border border-slate-800 flex items-start gap-2.5">
                      <FlaskConical className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Scale Range</div>
                        <div className="font-bold text-white font-mono">Milligrams to Drum Supply</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#050b16]/70 border border-slate-800 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Quality Release</div>
                        <div className="font-bold text-white font-mono">CoA & 16-Sec SDS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#050b16] border border-teal-500/40 rounded-2xl p-3 shadow-2xl items-center gap-3 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Full Lot Traceability</div>
                  <div className="text-[10px] text-slate-400 font-mono">Tamper-evident packaging</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Value Proposition Metrics Ribbon */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1324]/50 border border-slate-800/80">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="font-bold text-white">38 Verified Records</div>
              <div className="text-[11px] text-slate-400">Authentic chemical catalogue</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1324]/50 border border-slate-800/80">
            <Factory className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Pilot to Commercial</div>
              <div className="text-[11px] text-slate-400">Custom synthesis & scale-up</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1324]/50 border border-slate-800/80">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Analytical Traceability</div>
              <div className="text-[11px] text-slate-400">CoA, HPLC & GC spectra</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1324]/50 border border-slate-800/80">
            <Award className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Direct Technical Liaison</div>
              <div className="text-[11px] text-slate-400">Commercial quotation response</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
