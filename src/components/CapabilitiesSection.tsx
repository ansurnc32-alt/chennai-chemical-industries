import React from 'react';
import {
  FlaskConical,
  Scale,
  FileCheck2,
  Boxes,
  Pill,
  Headphones,
  ArrowRight,
  CheckCircle,
  Factory,
  CheckCircle2,
  ShieldAlert,
  Gauge,
  Workflow,
} from 'lucide-react';

interface CapabilitiesSectionProps {
  onRequestQuote: () => void;
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ onRequestQuote }) => {
  const capabilities = [
    {
      icon: FlaskConical,
      title: 'Custom Synthesis',
      description:
        'From milligram route scouting to multi-kilogram pilot synthesis. We specialize in complex heterocyclic chemistry, chiral molecules, fluorinations, organoborons, and multi-step API building blocks.',
      bullets: ['FTE or Fee-for-Service model', 'Gram to 50 kg scale', 'Route scouting & optimization'],
    },
    {
      icon: Scale,
      title: 'Scale-Up & Bulk Supply',
      description:
        'Transition from laboratory synthesis to commercial batch supply with tech transfer, pilot trials, and disciplined quality packaging.',
      bullets: ['Commercial drum packaging', 'Standard industrial containers', 'Rigorous lot profiling'],
    },
    {
      icon: FileCheck2,
      title: 'Quality Documentation',
      description:
        'Comprehensive analytical documentation with every lot: Certificate of Analysis (CoA), HPLC/GC chromatograms, 1H/13C-NMR spectra, LC-MS, residual solvent data, and 16-section SDS.',
      bullets: ['Batch-specific CoA and spectra', 'Regulatory audit dossiers', 'GHS-compliant SDS'],
    },
    {
      icon: Boxes,
      title: 'Research Chemical Supply',
      description:
        'Catalog research reagents ready for prompt dispatch to academic centers, biotech incubators, and R&D divisions.',
      bullets: ['High-purity organic reagents', 'Analytical standards & buffers', 'Standard commercial packaging'],
    },
    {
      icon: Pill,
      title: 'Pharmaceutical Intermediate Supply',
      description:
        'Supplying intermediates for generic API developers and drug synthesis pipelines with strict quality control.',
      bullets: ['Commercial quality control', 'Documentation support upon request', 'Batch purity profiling'],
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      description:
        'Direct consultation with synthetic chemists and technical specialists for chemical specifications, solubility data, and custom packaging configurations.',
      bullets: ['Dedicated scientific inquiry support', 'Consultative synthesis design', 'Prompt technical assistance'],
    },
  ];

  return (
    <section id="solutions" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            End-to-End Synthetic & Manufacturing Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            From Gram-Scale Discovery to Industrial Bulk Manufacturing
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed font-normal">
            Chennai Chemical Industries integrates synthetic organic labs, pilot reaction bays, and global commercial logistics to support every phase of your chemical supply chain.
          </p>
        </div>

        {/* 6 Capabilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="bg-slate-50/70 rounded-2xl p-7 border border-slate-200/90 hover:border-teal-400 hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0a1324] text-teal-300 flex items-center justify-center mb-5 shadow-xs border border-slate-800 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-teal-900 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 space-y-2">
                  {cap.bullets.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Photorealistic Pilot Plant & Logistics Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#050b16] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 overflow-hidden relative scientific-grid-dark">
          {/* Subtle lighting overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Technical Narrative & Metrics */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-teal-300 bg-teal-950/80 px-3.5 py-1.5 rounded-full border border-teal-800">
              <Workflow className="w-3.5 h-3.5 text-teal-400" />
              <span>Pilot Plant & Commercial Scaling</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Specialized Infrastructure Built for Exacting Chemical Specifications
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Our Andhra Pradesh production campus unites glass-lined reactors, jacketed synthesis bays, vacuum distillation columns, and dedicated analytical instrumentation to scale custom intermediates with absolute lot repeatability.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-[#0a1324] border border-slate-800">
                <div className="text-xl font-mono font-bold text-teal-300">mg to 50 kg</div>
                <div className="text-xs text-slate-400 mt-0.5">Pilot Route Scouting</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0a1324] border border-slate-800">
                <div className="text-xl font-mono font-bold text-emerald-300">Multi-Ton</div>
                <div className="text-xs text-slate-400 mt-0.5">Commercial Batch Supply</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onRequestQuote}
                className="px-6 py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-xs sm:text-sm font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-950 active:scale-98"
              >
                <span>Discuss Custom Synthesis or Bulk Supply</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Imagery Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 z-10">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-teal-500/30 shadow-xl aspect-4/3 relative group">
                <img
                  src="/assets/images/custom_synthesis_reactor.jpg"
                  alt="Pilot plant stainless steel custom synthesis reactor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b16]/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] font-mono text-teal-300 font-semibold">
                    Reaction Bays & Distillation
                  </span>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-300">
                Pilot Custom Synthesis & Process Development
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl aspect-4/3 relative group">
                <img
                  src="/assets/images/bulk_supply_warehouse_1791870954661.jpg"
                  alt="Climate-controlled chemical logistics and warehouse facility"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b16]/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] font-mono text-slate-300 font-semibold">
                    Sealed Inert Staging
                  </span>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-300">
                Climate-Controlled Bulk Storage & Logistics
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
