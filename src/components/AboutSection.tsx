import React from 'react';
import { Globe2, Building2, ShieldCheck, Truck, Users2, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Corporate Narrative */}
          <div className="lg:col-span-6 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md mb-2">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                Enterprise Corporate Profile
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                About Chennai Chemical Industries
              </h2>
              <div className="flex items-start gap-2 text-xs font-mono text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>APIIC Industrial Park, Second Phase, Plot No. 491, Gajuwaka / Kottavuru / Aganampudi, Gajuwaka, Andhra Pradesh, India</span>
              </div>
            </div>

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              Chennai Chemical Industries is an Indian chemical synthesis and commercial distribution enterprise providing fine research chemicals, pharmaceutical intermediates, and specialized synthetic reagents to life science companies, chemical producers, and research laboratories.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Operating from our production facility in Andhra Pradesh, India, we unite synthetic organic chemistry expertise with analytical instrumentation and disciplined quality protocols. We prioritize purity, traceability, and reliable delivery.
            </p>

            {/* Credential Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-mono font-extrabold text-slate-900">Gajuwaka, AP</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">Manufacturing & Synthesis Campus</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-mono font-extrabold text-teal-700">Commercial B2B</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">Global Chemical Logistics</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              <span className="bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" /> Synthetic Organic Chemistry
              </span>
              <span className="bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Quality Control & Lot CoA
              </span>
              <span className="bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" /> Dangerous Goods Compliant Logistics
              </span>
            </div>
          </div>

          {/* Right Column: Global Supply Assurance Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#050b16] text-white p-8 sm:p-10 space-y-7 scientific-grid-dark">
              {/* Background ambient molecular image overlay */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <img
                  src="/assets/images/molecular_network_dark.jpg"
                  alt="Molecular network background"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/chennaichemicalindustries_favicon.png"
                    alt="Chennai Chemical Industries"
                    className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(20,184,166,0.4)]"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold text-white">
                      Global Chemical Supply Assurance
                    </h3>
                    <div className="text-[11px] font-mono text-teal-300">
                      Standardized B2B Distribution Protocols
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  We maintain direct supply partnerships with fine chemical purchasers in North America, Europe, East Asia, and the Middle East. Whether supplying 10 grams of a rare chiral building block or multi-tonne bulk orders, our logistics protocols preserve chemical integrity from synthesis to receipt.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#0a1324]/80 border border-slate-800/80">
                    <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-300 shrink-0 mt-0.5 font-mono text-xs font-bold">
                      01
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Regulatory & Export Compliance
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Full HS Code classification, Dangerous Goods declarations (IATA/IMDG), and customs clearing documentation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#0a1324]/80 border border-slate-800/80">
                    <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-300 shrink-0 mt-0.5 font-mono text-xs font-bold">
                      02
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Batch Integrity & Sealed Inert Packaging
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Moisture-sensitive, pyrophoric, and light-sensitive compounds are bottled under ultra-dry inert argon/nitrogen atmosphere.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#0a1324]/80 border border-slate-800/80">
                    <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-300 shrink-0 mt-0.5 font-mono text-xs font-bold">
                      03
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Transparent Technical Liaison
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Direct consultation with our synthetic chemists for custom specifications, impurities, and stability profiles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
