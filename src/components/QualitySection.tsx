import React from 'react';
import {
  ShieldCheck,
  FileSpreadsheet,
  Microscope,
  CheckCircle2,
  Cpu,
  BarChart3,
  Layers,
  Award,
  Binary,
  CheckCircle,
} from 'lucide-react';

export const QualitySection: React.FC = () => {
  const qualityPillars = [
    {
      title: 'Full Product Traceability',
      desc: 'Every lot carries a tamper-evident barcode linked to raw material source records, reactor batch logs, synthesis operating parameters, and purification histories.',
      icon: Layers,
    },
    {
      title: 'Exhaustive Analytical Documentation',
      desc: 'Shipments include comprehensive Certificates of Analysis (CoA) with verified HPLC/UHPLC retention curves, GC-MS fragmentation patterns, 1H/13C NMR spectra, and Karl Fischer moisture content.',
      icon: FileSpreadsheet,
    },
    {
      title: 'Rigorous Quality Control Systems',
      desc: 'Our testing facility operates with rigorous analytical standards and calibrated chromatographic and spectroscopic instrumentation.',
      icon: Microscope,
    },
    {
      title: 'Uncompromised Batch Consistency',
      desc: 'Standardized operational procedures ensure negligible lot-to-lot variance. High purity thresholds minimize background noise in sensitive bioassays and industrial processes.',
      icon: BarChart3,
    },
    {
      title: 'Dedicated Technical & Regulatory Support',
      desc: 'Direct interaction with our QA/QC scientists for audit support, change control notifications, residual solvent inquiries (ICH Q3C), and elemental impurity analyses (ICH Q3D).',
      icon: Award,
    },
    {
      title: 'Validated Cold-Chain & Secure Packaging',
      desc: 'Inert nitrogen/argon sealed containers, amber glass bottles, and temperature-logged freight safeguard chemical integrity through transit.',
      icon: Cpu,
    },
  ];

  return (
    <section id="quality" className="py-24 bg-slate-50 border-b border-slate-200 scroll-mt-20 scientific-grid-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Quality Philosophy & HPLC Visual Showcase */}
          <div className="lg:col-span-5 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Empirical Analytical Rigor
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Quality Beyond Compromise
              </h2>
              <p className="text-base text-slate-600 mt-3 leading-relaxed font-normal">
                In chemical synthesis and pharmaceutical intermediate supply, purity is not an aspiration—it is an empirical prerequisite. At Chennai Chemical Industries, our quality release protocol is rigorous, documented, and traceable.
              </p>
            </div>

            {/* High-Performance Chromatography Visual */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative group aspect-4/3 bg-white">
              <img
                src="/assets/images/quality_chromatography.jpg"
                alt="High performance liquid chromatography autosampler and column testing suite"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b16]/90 via-transparent to-transparent flex items-end p-5">
                <div className="text-white space-y-0.5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-teal-300 font-bold">
                    Analytical Release Testing Suite
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    HPLC / GC-MS Quantitative Purity Determination
                  </div>
                </div>
              </div>
            </div>

            {/* Testing Methods Summary Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Binary className="w-4 h-4 text-teal-700" />
                  <span>Analytical Release Methodology</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Batch Validated
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                HPLC/UHPLC Purity Profiling · GC-MS Volatile Screening · 1H/13C NMR Structural Confirmation · Karl Fischer Coulometric Moisture · FTIR Spectral Fingerprinting.
              </p>
            </div>
          </div>

          {/* 6 Quality Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {qualityPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-teal-900 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Included with Every Shipment</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
