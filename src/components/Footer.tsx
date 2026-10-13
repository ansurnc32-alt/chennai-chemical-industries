import React from 'react';
import { ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050b16] text-slate-400 border-t border-slate-800 text-xs scientific-grid-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand & Location Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Official Logo Mark Badge */}
            <div className="flex items-center gap-3">
              <div className="inline-block bg-white p-2 rounded-xl shadow-xs border border-slate-700/80">
                <img
                  src="/assets/chennaichemicalindustries_logo.png"
                  alt="Chennai Chemical Industries - Reliable Chemistry for Ambitious Science"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              B2B supplier of research chemicals, pharmaceutical intermediates, specialty chemicals, custom synthesis, and bulk commercial supply.
            </p>

            <div className="space-y-2.5 pt-2 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-mono text-[11px]">
                  APIIC Industrial Park, Second Phase, Plot No. 491, Gajuwaka / Kottavuru / Aganampudi, Gajuwaka, Andhra Pradesh, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a
                  href="mailto:chennaichemicalindustries@gmail.com"
                  className="font-mono hover:text-teal-300 transition-colors text-[11px]"
                >
                  chennaichemicalindustries@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a
                  href="tel:7619431029"
                  className="font-mono hover:text-teal-300 transition-colors text-[11px]"
                >
                  7619431029
                </a>
              </div>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Products
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#products" className="hover:text-teal-300 transition-colors">
                  Organic Laboratory Reagents
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-teal-300 transition-colors">
                  Pharmaceutical Intermediates
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-teal-300 transition-colors">
                  Life Science Chemicals
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-teal-300 transition-colors">
                  Analytical Reagents
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-teal-300 transition-colors">
                  Materials Science Chemicals
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-teal-300 transition-colors">
                  Specialty Chemicals
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions & Quality */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Solutions & Quality
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#solutions" className="hover:text-teal-300 transition-colors">
                  Custom Synthesis
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-teal-300 transition-colors">
                  Scale-Up & Bulk Supply
                </a>
              </li>
              <li>
                <a href="#quality" className="hover:text-teal-300 transition-colors">
                  Quality Documentation & CoA
                </a>
              </li>
              <li>
                <a href="#quality" className="hover:text-teal-300 transition-colors">
                  Analytical Traceability
                </a>
              </li>
              <li>
                <a href="#quality" className="hover:text-teal-300 transition-colors">
                  Technical Support
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-teal-300 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Compliance & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Compliance & Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#contact" className="hover:text-teal-300 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#privacy-policy" className="hover:text-teal-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-teal-300 transition-colors">
                  Terms of Supply
                </a>
              </li>
              <li>
                <span className="text-slate-500">Commercial B2B Supply</span>
              </li>
              <li>
                <span className="text-slate-500">Technical Documentation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Company Email Directory & Departmental Aliases */}
        <div className="mb-12 pt-8 border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Company Email Directory & Departmental Aliases
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Direct communication routing for commercial quotations, orders, technical support, and general inquiries.
              </p>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Primary: <a href="mailto:chennaichemicalindustries@gmail.com" className="text-teal-300 hover:underline">chennaichemicalindustries@gmail.com</a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 bg-[#0a1324]/80 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-colors">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Sales and quotations</span>
              <a
                href="mailto:sales@chennaichemicalindustries.com"
                className="font-mono text-teal-300 hover:text-teal-200 hover:underline text-xs block transition-colors"
              >
                sales@chennaichemicalindustries.com
              </a>
            </div>

            <div className="p-3.5 bg-[#0a1324]/80 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-colors">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">General enquiries</span>
              <a
                href="mailto:info@chennaichemicalindustries.com"
                className="font-mono text-teal-300 hover:text-teal-200 hover:underline text-xs block transition-colors"
              >
                info@chennaichemicalindustries.com
              </a>
            </div>

            <div className="p-3.5 bg-[#0a1324]/80 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-colors">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Contact</span>
              <a
                href="mailto:contact@chennaichemicalindustries.com"
                className="font-mono text-teal-300 hover:text-teal-200 hover:underline text-xs block transition-colors"
              >
                contact@chennaichemicalindustries.com
              </a>
            </div>

            <div className="p-3.5 bg-[#0a1324]/80 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-colors">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Orders</span>
              <a
                href="mailto:orders@chennaichemicalindustries.com"
                className="font-mono text-teal-300 hover:text-teal-200 hover:underline text-xs block transition-colors"
              >
                orders@chennaichemicalindustries.com
              </a>
            </div>

            <div className="p-3.5 bg-[#0a1324]/80 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-colors">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Support</span>
              <a
                href="mailto:support@chennaichemicalindustries.com"
                className="font-mono text-teal-300 hover:text-teal-200 hover:underline text-xs block transition-colors"
              >
                support@chennaichemicalindustries.com
              </a>
            </div>

            <div className="p-3.5 bg-[#0a1324]/80 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-colors">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Primary Corporate Email</span>
              <a
                href="mailto:chennaichemicalindustries@gmail.com"
                className="font-mono text-teal-300 hover:text-teal-200 hover:underline text-xs block transition-colors"
              >
                chennaichemicalindustries@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <img
              src="/assets/chennaichemicalindustries_favicon.png"
              alt=""
              className="w-4 h-4 object-contain"
            />
            <span>© {new Date().getFullYear()} Chennai Chemical Industries. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy-policy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">
              Terms & Conditions
            </a>
            <span className="text-slate-600">·</span>
            <a href="#/admin" className="hover:text-teal-400 transition-colors font-medium">
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
