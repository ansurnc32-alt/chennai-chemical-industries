import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  Loader2,
  Building,
  User,
  FlaskConical,
  Scale,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { QuoteFormData } from '../types';

interface QuotationFormProps {
  initialProductNameOrCas?: string;
  onSuccessSubmit?: (data: QuoteFormData) => void;
}

export const QuotationForm: React.FC<QuotationFormProps> = ({
  initialProductNameOrCas = '',
  onSuccessSubmit,
}) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    productNameOrCas: '',
    quantity: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string>('');

  useEffect(() => {
    if (initialProductNameOrCas) {
      setFormData((prev) => ({
        ...prev,
        productNameOrCas: initialProductNameOrCas,
      }));
    }
  }, [initialProductNameOrCas]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof QuoteFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company or institution is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Corporate email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid corporate email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for dispatch validation';
    }

    if (!formData.productNameOrCas.trim()) {
      newErrors.productNameOrCas = 'Product name or CAS Registry Number is required';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Required quantity (e.g., 25 g, 5 kg, 2 MT) is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof QuoteFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          productNameOrCas: formData.productNameOrCas.trim(),
          quantity: formData.quantity.trim(),
          message: formData.message.trim(),
          source: 'General Quotation Form',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit quote request. Please try again.');
      }

      setReferenceId(result.enquiryId || `CCI-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
      if (onSuccessSubmit) {
        onSuccessSubmit(formData);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'A network error occurred. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      productNameOrCas: '',
      quantity: '',
      message: '',
    });
    setErrors({});
    setSubmitError(null);
  };

  return (
    <section id="contact" className="py-24 bg-[#050b16] text-white border-b border-slate-800 scroll-mt-20 scientific-grid-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Column: Direct Commercial & Facility Directory */}
          <div className="lg:col-span-5 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-3 py-1 rounded-md border border-teal-800 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Commercial & Technical Inquiries
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Request a Formal Quotation
              </h2>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed font-normal">
                Need catalog pricing, bulk chemical supply, or a custom synthesis feasibility assessment? Contact our commercial sales team.
              </p>
            </div>

            {/* Facility & Core Contacts Card */}
            <div className="bg-[#0a1324]/90 rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Manufacturing Facility & Address
                  </h4>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Chennai Chemical Industries
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-mono">
                    APIIC Industrial Park, Second Phase, Plot No. 491, Gajuwaka / Kottavuru / Aganampudi, Gajuwaka, Andhra Pradesh, India
                  </p>
                </div>
              </div>

              {/* Primary Corporate Email */}
              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Primary Corporate Email
                  </h4>
                  <a
                    href="mailto:chennaichemicalindustries@gmail.com"
                    className="text-xs font-mono text-teal-300 hover:underline mt-0.5 block"
                  >
                    chennaichemicalindustries@gmail.com
                  </a>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Telephone Support
                  </h4>
                  <a
                    href="tel:7619431029"
                    className="text-xs font-mono text-teal-300 hover:underline mt-0.5 block"
                  >
                    7619431029
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Operating Hours
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Monday – Saturday: 08:30 – 19:30 IST (UTC +5:30)
                  </p>
                  <p className="text-xs text-slate-400">
                    Global export logistics dispatched daily.
                  </p>
                </div>
              </div>

              {/* Departmental Email Directory */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-3">
                  Departmental Inquiries & Email Aliases
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#050b16]/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400 font-medium">Sales and quotations:</span>
                    <a
                      href="mailto:sales@chennaichemicalindustries.com"
                      className="font-mono text-teal-300 hover:text-teal-200 hover:underline transition-colors break-all"
                    >
                      sales@chennaichemicalindustries.com
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#050b16]/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400 font-medium">General enquiries:</span>
                    <a
                      href="mailto:info@chennaichemicalindustries.com"
                      className="font-mono text-teal-300 hover:text-teal-200 hover:underline transition-colors break-all"
                    >
                      info@chennaichemicalindustries.com
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#050b16]/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400 font-medium">Contact:</span>
                    <a
                      href="mailto:contact@chennaichemicalindustries.com"
                      className="font-mono text-teal-300 hover:text-teal-200 hover:underline transition-colors break-all"
                    >
                      contact@chennaichemicalindustries.com
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#050b16]/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400 font-medium">Orders:</span>
                    <a
                      href="mailto:orders@chennaichemicalindustries.com"
                      className="font-mono text-teal-300 hover:text-teal-200 hover:underline transition-colors break-all"
                    >
                      orders@chennaichemicalindustries.com
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#050b16]/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400 font-medium">Support:</span>
                    <a
                      href="mailto:support@chennaichemicalindustries.com"
                      className="font-mono text-teal-300 hover:text-teal-200 hover:underline transition-colors break-all"
                    >
                      support@chennaichemicalindustries.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Standard Note */}
            <div className="p-4 bg-teal-950/60 border border-teal-800/80 rounded-2xl text-xs text-slate-300 flex items-center gap-3">
              <FileCheck className="w-5 h-5 text-teal-400 shrink-0" />
              <span>
                Standard analytical package (CoA, HPLC/GC spectra, and 16-section SDS) provided with every formal quotation response.
              </span>
            </div>
          </div>

          {/* Right Column: Commercial Quotation Form */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 rounded-3xl p-7 sm:p-10 shadow-2xl border border-slate-200">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Quotation Request Received
                  </h3>
                  <div className="inline-block bg-slate-100 text-slate-800 text-xs font-mono px-3.5 py-2 rounded-lg border border-slate-200 font-bold">
                    Reference ID: {referenceId}
                  </div>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-slate-900">{formData.name}</span> from{' '}
                    <span className="font-semibold text-slate-900">{formData.company}</span>. Our technical sales team has received your enquiry for{' '}
                    <span className="font-mono text-teal-800 font-semibold">{formData.productNameOrCas}</span>. An official formal quote with delivery schedule and analytical specs will be sent to{' '}
                    <span className="underline font-medium text-slate-900">{formData.email}</span>.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-[#0a1324] text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer"
                    >
                      Submit Another Quotation Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4.5">
                  <div className="border-b border-slate-100 pb-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      Technical Quotation & Specification Request
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct RFQ submission logged into our sales system. Fields marked with an asterisk (*) are required.
                    </p>
                  </div>

                  {/* Submit Error Alert */}
                  {submitError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Row 1: Name and Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Dr. S. Ramanathan"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white transition-colors ${
                          errors.name
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-slate-200 focus:border-teal-600'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Company or Institution *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Apex Pharma Research Labs"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white transition-colors ${
                          errors.company
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-slate-200 focus:border-teal-600'
                        }`}
                      />
                      {errors.company && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="procurement@apexpharma.com"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white transition-colors ${
                          errors.email
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-slate-200 focus:border-teal-600'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Telephone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98400 12345"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white transition-colors ${
                          errors.phone
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-slate-200 focus:border-teal-600'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Product Name/CAS and Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Product Name or CAS RN *
                      </label>
                      <input
                        type="text"
                        name="productNameOrCas"
                        value={formData.productNameOrCas}
                        onChange={handleChange}
                        placeholder="e.g., CAS 4926-28-7 or 2-Amino-5-bromopyridine"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white transition-colors font-mono ${
                          errors.productNameOrCas
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-slate-200 focus:border-teal-600'
                        }`}
                      />
                      {errors.productNameOrCas && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.productNameOrCas}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Requested Quantity *
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="e.g., 500 g, 25 kg, or 2 Metric Tons"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white transition-colors ${
                          errors.quantity
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-slate-200 focus:border-teal-600'
                        }`}
                      />
                      {errors.quantity && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.quantity}</p>
                      )}
                    </div>
                  </div>

                  {/* Specifications and Timeline */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Technical Specifications & Delivery Timeline (Optional)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Specify purity target (e.g. >99.0%), custom packaging, destination port/city for freight calculation, or regulatory documentation requirements..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">
                      Official quotation and specifications provided.
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-3 bg-[#0a1324] hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Quotation...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Quotation Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
