import React, { useState } from 'react';
import { getChemicalStructure } from '../data/chemicalStructures';

interface ChemicalStructureViewProps {
  productId: string;
  casNo?: string;
  productName: string;
  className?: string;
  variant?: 'card' | 'modal' | 'table';
}

/**
 * ChemicalStructureView
 * 
 * Renders verified 2D skeletal chemical structures from PubChem PUG REST.
 * Complies with strict guidelines:
 * 1. Verified structures show crisp 2D skeletal diagrams with descriptive alt text.
 * 2. Unverified / proprietary / non-discrete compounds display a neutral abstract
 *    chemistry illustration clearly marked as decorative with empty alt text.
 * 3. Graceful fallback to "Structure image unavailable" if image loading fails.
 * 4. Lazy-loaded with reserved container space to prevent layout shifts.
 */
export const ChemicalStructureView: React.FC<ChemicalStructureViewProps> = ({
  productId,
  casNo,
  productName,
  className = '',
  variant = 'card',
}) => {
  const structure = getChemicalStructure(productId, casNo);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If table variant (compact thumbnail)
  if (variant === 'table') {
    if (structure.hasStructure && structure.src && !imageError) {
      return (
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-2xs group-hover:border-teal-400 transition-colors">
          <img
            src={structure.src}
            alt={structure.alt || `Chemical structure of ${productName}`}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="max-h-full max-w-full object-contain filter contrast-110"
          />
        </div>
      );
    }
    return (
      <div
        className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 shrink-0 text-slate-400"
        title="Structure unavailable"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-5 h-5 text-slate-300"
          aria-hidden="true"
        >
          <polygon points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" strokeDasharray="2 2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // If modal variant (larger display)
  if (variant === 'modal') {
    const isVerified = structure.hasStructure && structure.src && !imageError;

    return (
      <div
        className={`w-full bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xs ${className}`}
        style={{ minHeight: '200px' }}
      >
        {isVerified ? (
          <>
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md shadow-2xs">
                Verified 2D Structure
              </span>
            </div>

            <div className="w-full h-44 flex items-center justify-center p-2">
              <img
                src={structure.src}
                alt={structure.alt || `Chemical 2D skeletal structure of ${productName}`}
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
                className={`max-h-full max-w-full object-contain filter contrast-125 transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="mt-2 text-center">
              <span className="text-[11px] text-slate-500 font-mono">
                Sourced from PubChem PUG REST database
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            {/* Decorative chemistry illustration */}
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20 text-slate-300 mb-3"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
              role="presentation"
            >
              <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="50,28 70,40 70,60 50,72 30,60 30,40" strokeWidth="1.5" className="text-teal-400" />
              <circle cx="50" cy="50" r="4" fill="currentColor" className="text-teal-600" />
              <circle cx="50" cy="15" r="3" fill="currentColor" />
              <circle cx="80" cy="32" r="3" fill="currentColor" />
              <circle cx="80" cy="68" r="3" fill="currentColor" />
              <circle cx="50" cy="85" r="3" fill="currentColor" />
              <circle cx="20" cy="68" r="3" fill="currentColor" />
              <circle cx="20" cy="32" r="3" fill="currentColor" />
            </svg>
            <span className="text-xs font-bold text-slate-700">Structure image unavailable</span>
            <span className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
              {structure.reason || 'Complex mixture, polymer matrix, or client-specified synthesis'}
            </span>
            <span className="mt-2 text-[9px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Decorative graphic
            </span>
          </div>
        )}
      </div>
    );
  }

  // Standard Card view variant
  const isVerified = structure.hasStructure && structure.src && !imageError;

  return (
    <div
      className={`w-full bg-white rounded-xl border border-slate-200/90 group-hover:border-teal-400/80 p-2 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-200 shadow-2xs ${className}`}
      style={{ height: '165px' }} // Reserved fixed height prevents CLS
    >
      {isVerified ? (
        <>
          {/* Subtle 2D Skeletal Source Tag */}
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <span className="text-[9px] font-mono font-medium tracking-wider uppercase text-teal-800 bg-teal-50/90 border border-teal-200/80 px-1.5 py-0.5 rounded shadow-2xs">
              2D Skeletal
            </span>
          </div>

          {/* Chemical Structure Image */}
          <div className="w-full h-full flex items-center justify-center p-2 relative">
            <img
              src={structure.src}
              alt={structure.alt || `Chemical 2D skeletal structure of ${productName} (CAS ${casNo || ''})`}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
              className={`max-h-full max-w-full w-auto h-auto object-contain filter contrast-125 transition-transform duration-200 ease-out group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Subtle placeholder while image loads */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin opacity-40"></div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Neutral Abstract Chemistry Illustration (Decorative) */
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center select-none">
          <svg
            viewBox="0 0 100 100"
            className="w-12 h-12 text-slate-300 mb-1.5 group-hover:text-teal-300 transition-colors"
            fill="none"
            stroke="currentColor"
            role="presentation"
            aria-hidden="true"
          >
            {/* Abstract molecular geometry */}
            <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" strokeWidth="1.8" strokeDasharray="3 2" />
            <polygon points="50,30 68,40 68,60 50,70 32,60 32,40" strokeWidth="1.2" className="text-teal-400/80" />
            <circle cx="50" cy="50" r="3" fill="currentColor" className="text-teal-600" />
            <circle cx="50" cy="20" r="2.5" fill="currentColor" />
            <circle cx="76" cy="35" r="2.5" fill="currentColor" />
            <circle cx="76" cy="65" r="2.5" fill="currentColor" />
            <circle cx="50" cy="80" r="2.5" fill="currentColor" />
            <circle cx="24" cy="65" r="2.5" fill="currentColor" />
            <circle cx="24" cy="35" r="2.5" fill="currentColor" />
          </svg>

          {/* Clean unavailable message */}
          <span className="text-[11px] font-semibold text-slate-600 block leading-tight">
            Structure image unavailable
          </span>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5 line-clamp-1 max-w-[220px]">
            {structure.reason || 'Proprietary or multi-component'}
          </span>
          <span className="mt-1 text-[8px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
            Decorative
          </span>
        </div>
      )}
    </div>
  );
};
