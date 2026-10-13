import React, { useState } from 'react';
import { ChemicalProduct } from '../types';
import { submitEnquiry } from '../lib/api';
import { ChemicalStructureView } from './ChemicalStructureView';
import {
  X,
  ShieldAlert,
  Thermometer,
  Layers,
  Send,
  CheckCircle,
  Copy,
  Check,
  Tag,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ProductModalProps {
  product: ChemicalProduct | null;
  onClose: () => void;
  onSubmitQuote: (quoteData: {
    name: string;
    company: string;
    email: string;
    phone: string;
    productNameOrCas: string;
    quantity: string;
    message: string;
  }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSubmitQuote,
}) => {
  const [copiedCas, setCopiedCas] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('100 g');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!product) return null;

  const copyCasToClipboard = () => {
    navigator.clipboard.writeText(product.casNo || product.cas || '');
    setCopiedCas(true);
    setTimeout(() => setCopiedCas(false), 2000);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) newErrors.name = 'Full name is required (at least 2 characters)';
    if (!company.trim() || company.trim().length < 2) newErrors.company = 'Company / Institution is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = 'Valid corporate or institutional email is required';
    const digits = phone.replace(/\D/g, '');
    if (!phone.trim() || digits.length < 7) newErrors.phone = 'Valid telephone contact is required (at least 7 digits)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const productNameOrCas = `${product.name} (CAS ${product.casNo || product.cas}${(product.productCode || product.code) ? `, Code ${product.productCode || product.code}` : ''})`;

    try {
      const response = await submitEnquiry({
        name,
        company,
        email,
        phone,
        productNameOrCas,
        quantity,
        message,
        source: 'product_modal',
      });

      if (response.success && response.referenceId) {
        setReferenceId(response.referenceId);
        setSubmitted(true);
        onSubmitQuote({
          name,
          company,
          email,
          phone,
          productNameOrCas,
          quantity,
          message,
        });
      } else {
        if (response.errors) {
          setErrors(response.errors);
        }
        setSubmitError(response.message || 'Quotation inquiry could not be saved. Please try again.');
      }
    } catch (err: any) {
      setSubmitError('Network connection failed. Please try again or call our desk at 7619431029.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-[#050b16] text-white p-6 sm:p-7 flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1.5 pr-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <img
                src="/assets/chennaichemicalindustries_favicon.png"
                alt="Chennai Chemical Industries"
                className="w-4 h-4 object-contain inline-block"
              />
              <span className="text-teal-300 font-bold uppercase tracking-wider">
                {product.category}
              </span>
              {(product.productCode || product.code) ? (
                <>
                  <span className="text-slate-500">·</span>
                  <span className="font-mono text-slate-300">{product.productCode || product.code}</span>
                </>
              ) : null}
              {product.tag ? (
                <>
                  <span className="text-slate-500">·</span>
                  <span className="text-teal-300 font-semibold">{product.tag}</span>
                </>
              ) : null}
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-medium">Verified Analytical Batch</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={copyCasToClipboard}
                className="inline-flex items-center gap-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
                title="Copy CAS RN"
              >
                <span>CAS RN: {product.casNo || product.cas}</span>
                {copiedCas ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {product.molecularFormula ? (
                <span className="text-xs text-slate-400 font-mono">
                  Formula: <span className="text-white font-semibold">{product.molecularFormula}</span>
                </span>
              ) : null}
              {product.molecularWeight && product.molecularWeight > 0 ? (
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  MW: <span className="text-white font-semibold">{product.molecularWeight} g/mol</span>
                </span>
              ) : null}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Close chemical details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700 divide-y divide-slate-100">
          {/* Chemical 2D Structure & Properties Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 items-stretch">
            <div className="md:col-span-1">
              <ChemicalStructureView
                productId={product.id}
                casNo={product.casNo || product.cas}
                productName={product.name}
                variant="modal"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-3 content-start">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Chemical Purity
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
                  {product.purity || 'Research Grade Spec'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Material Grade
                </span>
                <span className="font-medium text-slate-900 text-sm mt-1 block truncate">
                  {product.grade || 'Laboratory Reagent'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Standard Packages
                </span>
                <span className="font-medium text-slate-900 text-xs mt-1 block truncate">
                  {product.packageSize || product.package || 'Inquire on RFQ'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Benchmark Price
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
                  {product.price || 'Inquire for Quote'}
                </span>
              </div>
            </div>
          </div>

          {/* Description & Technical Synonyms */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Chemical & Pharmacological Description
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              {product.description ||
                `${product.name} (CAS ${product.casNo || product.cas}) is a high-purity chemical reagent in our ${product.category} catalog available for research, custom synthesis, and industrial manufacturing.`}
            </p>

            {((product.synonyms && product.synonyms.length > 0) || product.synonym) && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Synonyms:</span>
                {Array.from(
                  new Set([
                    ...(product.synonym ? [product.synonym] : []),
                    ...(product.synonyms || []),
                  ])
                ).map((syn) => (
                  <span
                    key={syn}
                    className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm font-mono"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Safety & Storage Specification */}
          <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Regulatory Safety & Hazard Classification</span>
              </div>
              <p className="text-xs text-amber-900 font-mono mt-1">
                GHS Signal: <span className="font-bold">{product.safety?.signalWord || 'Warning'}</span> · {product.safety?.hazardClass || 'Standard laboratory handling precautions'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Full Safety Data Sheet (SDS / GHS 16-section compliant) dispatched with every shipment.
              </p>
            </div>

            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sky-800 font-semibold text-xs mb-1">
                <Thermometer className="w-4 h-4 text-sky-600" />
                <span>Recommended Storage & Shelf Life</span>
              </div>
              <p className="text-xs text-sky-900 font-mono mt-1">
                {product.safety?.storageTemp || 'Store in sealed container in dry, well-ventilated area (15–25°C)'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Stored in climate-controlled warehouse facility under appropriate atmospheric conditions.
              </p>
            </div>
          </div>

          {/* Key Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="pt-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Syntheses & Target Applications</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.applications.map((app) => (
                  <span
                    key={app}
                    className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Request Quotation Form Section (Requirement #6) */}
          <div className="pt-6">
            <div className="bg-[#0a1324] text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Request Official Price Quotation & CoA
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pre-filled for: <span className="text-teal-400 font-semibold">{product.name}</span> (CAS {product.casNo || product.cas})
                  </p>
                </div>
                <span className="text-xs font-mono text-teal-400 bg-teal-950 px-2.5 py-1 rounded-md border border-teal-800">
                  Official RFQ
                </span>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Quotation Request Recorded</h4>
                  <div className="inline-block bg-slate-800 text-teal-300 font-mono text-xs px-3 py-1.5 rounded-md border border-slate-700 font-semibold">
                    Reference: {referenceId}
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-white">{name}</span>. Our technical sales team has recorded your inquiry for <span className="text-teal-300 font-mono">{product.productCode || product.code || product.name}</span>. An official formal quote with delivery schedule and analytical specs will be prepared for <span className="underline">{email}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSubmitError(null);
                    }}
                    className="mt-2 text-xs text-teal-400 hover:text-teal-300 underline cursor-pointer"
                  >
                    Submit another request for this item
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-300 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-red-200">Submission Error</span>
                        <span>{submitError}</span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Rajesh Sen"
                        className={`w-full px-3 py-2 text-xs bg-slate-800 border ${
                          errors.name ? 'border-rose-500' : 'border-slate-700'
                        } rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500`}
                      />
                      {errors.name && <span className="text-[11px] text-rose-400">{errors.name}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Company / Research Institution *
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Acme Therapeutics Pvt Ltd"
                        className={`w-full px-3 py-2 text-xs bg-slate-800 border ${
                          errors.company ? 'border-rose-500' : 'border-slate-700'
                        } rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500`}
                      />
                      {errors.company && <span className="text-[11px] text-rose-400">{errors.company}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Corporate / Institutional Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="research@company.com"
                        className={`w-full px-3 py-2 text-xs bg-slate-800 border ${
                          errors.email ? 'border-rose-500' : 'border-slate-700'
                        } rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500`}
                      />
                      {errors.email && <span className="text-[11px] text-rose-400">{errors.email}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full px-3 py-2 text-xs bg-slate-800 border ${
                          errors.phone ? 'border-rose-500' : 'border-slate-700'
                        } rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500`}
                      />
                      {errors.phone && <span className="text-[11px] text-rose-400">{errors.phone}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Required Quantity & Pack Size
                      </label>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 500 g, 5 kg, 25 kg Drum"
                        className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Required Documentation
                      </label>
                      <div className="flex items-center gap-3 pt-2 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-teal-400" /> CoA
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-teal-400" /> SDS
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-teal-400" /> HPLC/GC Spectra
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Specifications or Delivery Timeline (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please note custom purity requirement, delivery destination, or recurring demand schedule..."
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Quotation Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Chennai Chemical Industries · Gajuwaka, Andhra Pradesh, India</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
