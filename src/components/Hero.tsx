import React from 'react';
import { ArrowRight, Search, ShieldCheck, Factory, FlaskConical, Award, CheckCircle2 } from 'lucide-react';

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
    <section className="relative bg-[#faf9f6] text-slate-900 overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Editorial Headline & Search Interface */}
          <div className="lg:col-span-7 space-y-7">
            {/* Enterprise Credential Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-teal-800 bg-teal-50 border border-teal-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>Gajuwaka, Andhra Pradesh, India · B2B Chemical Supplier</span>
            </div>

            {/* Approved Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0a1324] leading-[1.08]">
                Reliable Chemistry for{' '}
                <span className="text-teal-700">
                  Ambitious Science
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                Supplying certified research chemicals, pharmaceutical intermediates, specialty chemicals, custom synthesis, and bulk commercial supply to leading life-science enterprises and chemical manufacturers.
              </p>
            </div>

            {/* Prominent Scientific Search Interface */}
            <div className="space-y-3 max-w-xl">
              <form
                onSubmit={handleQuickSearchSubmit}
                className="relative flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-md focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-100 transition-all"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-teal-700 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by Chemical Name, CAS RN, Formula, or Code..."
                    className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 mr-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap active:scale-98"
                >
                  <span>Search Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Instant Chemical Shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-sans font-medium">Quick CAS Search:</span>
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
                    className="px-2.5 py-0.5 rounded-md bg-white hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 font-mono transition-colors cursor-pointer text-slate-700 shadow-2xs"
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
                className="px-7 py-3.5 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98 group"
              >
                <span>Explore 38 Chemical Records</span>
                <ArrowRight className="w-4 h-4 text-teal-100 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onRequestQuote}
                className="px-7 py-3.5 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Request a Formal Quote
              </button>
            </div>
          </div>

          {/* Layered Scientific Editorial Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src="/assets/images/hero_scientific_molecule.jpg"
                    alt="Precision laboratory glassware reaction and crystallization"
                    className="w-full h-full object-cover object-center"
                  />
                  
                  {/* Floating Analytical Verified Pill */}
                  <div className="absolute top-4 left-4 bg-white/95 border border-slate-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    <span className="text-[11px] font-mono font-semibold text-teal-900">
                      Analytical Release Profiling
                    </span>
                  </div>
                </div>

                {/* Technical Credentials Strip */}
                <div className="p-5 sm:p-6 space-y-4 bg-white border-t border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/assets/chennaichemicalindustries_favicon.png"
                        alt="Chennai Chemical Industries"
                        className="w-8 h-8 object-contain shrink-0"
                      />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-teal-700 font-bold font-mono">
                          Manufacturing & Supply Specs
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">
                          Chennai Chemical Industries
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      Gajuwaka, AP
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <FlaskConical className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Scale Range</div>
                        <div className="font-bold text-slate-900 font-mono">Milligrams to Drum Supply</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Quality Release</div>
                        <div className="font-bold text-slate-900 font-mono">CoA & 16-Sec SDS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white border border-slate-200 rounded-2xl p-3 shadow-lg items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900">Full Lot Traceability</div>
                  <div className="text-[10px] text-slate-500 font-mono">Tamper-evident packaging</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Value Proposition Metrics Ribbon */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-700 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">38 Verified Records</div>
              <div className="text-[11px] text-slate-500">Authentic chemical catalogue</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <Factory className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Pilot to Commercial</div>
              <div className="text-[11px] text-slate-500">Custom synthesis & scale-up</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Analytical Traceability</div>
              <div className="text-[11px] text-slate-500">CoA, HPLC & GC spectra</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <Award className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Direct Technical Liaison</div>
              <div className="text-[11px] text-slate-500">Commercial quotation response</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
