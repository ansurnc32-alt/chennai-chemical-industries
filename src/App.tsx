import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { QualitySection } from './components/QualitySection';
import { AboutSection } from './components/AboutSection';
import { QuotationForm } from './components/QuotationForm';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CHEMICAL_PRODUCTS } from './data/products';
import { ChemicalProduct, ProductCategory, QuoteFormData } from './types';
import { AdminUser, verifyAdminSession } from './lib/api';
import { CheckCircle2, X, Loader2, MapPin, Phone, Mail, Shield } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [activeModalProduct, setActiveModalProduct] = useState<ChemicalProduct | null>(null);
  const [quoteTargetProduct, setQuoteTargetProduct] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('products');

  // Admin routing & auth state
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Synchronize hash route for #/admin
  useEffect(() => {
    const checkHashRoute = async () => {
      const hash = window.location.hash;
      const isAdmin = hash.startsWith('#/admin') || hash.startsWith('#admin');
      setIsAdminRoute(isAdmin);

      if (isAdmin) {
        setIsCheckingAuth(true);
        const session = await verifyAdminSession();
        if (session.success && session.admin) {
          setCurrentAdmin(session.admin);
        } else {
          setCurrentAdmin(null);
        }
        setIsCheckingAuth(false);
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkHashRoute();
    window.addEventListener('hashchange', checkHashRoute);
    return () => window.removeEventListener('hashchange', checkHashRoute);
  }, []);

  // Monitor active scroll section for header navigation highlighting
  useEffect(() => {
    if (isAdminRoute) return;

    const handleScroll = () => {
      const sections = ['products', 'solutions', 'quality', 'about', 'contact'];
      const scrollY = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminRoute]);

  const handleExploreProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestQuoteGeneral = () => {
    setQuoteTargetProduct('');
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestQuoteForProduct = (product: ChemicalProduct) => {
    setQuoteTargetProduct(`${product.name} (CAS ${product.casNo || product.cas})`);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModalQuoteSubmitted = (data: QuoteFormData) => {
    setToastMessage(`Quotation request for ${data.name} has been successfully received.`);
    setActiveModalProduct(null);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleFormQuoteSubmitted = (data: QuoteFormData) => {
    setToastMessage(`Quotation request for ${data.name} (${data.company}) received. Reference generated.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleBackToPublicSite = () => {
    window.location.hash = '';
    setIsAdminRoute(false);
  };

  // -------------------------------------------------------------
  // Render Admin View
  // -------------------------------------------------------------
  if (isAdminRoute) {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400 mb-3" />
          <div className="text-xs text-slate-400 font-mono">Verifying administration authorization...</div>
        </div>
      );
    }

    if (currentAdmin) {
      return (
        <AdminDashboard
          admin={currentAdmin}
          onLogout={() => setCurrentAdmin(null)}
          onBackToPublicSite={handleBackToPublicSite}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={(admin) => setCurrentAdmin(admin)}
        onBackToPublicSite={handleBackToPublicSite}
      />
    );
  }

  // -------------------------------------------------------------
  // Render Public Website View
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed flex-1">
            <span className="font-bold text-white block">Quotation Inquired</span>
            <span className="text-slate-300">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header with strict Top Bar Contract */}
      <Header
        onRequestQuote={handleRequestQuoteGeneral}
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onExploreProducts={handleExploreProducts}
          onRequestQuote={handleRequestQuoteGeneral}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 3, 4, 5. Product Search & Catalog */}
        <ProductCatalog
          products={CHEMICAL_PRODUCTS}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSelectProduct={(product) => setActiveModalProduct(product)}
          onRequestQuoteForProduct={handleRequestQuoteForProduct}
        />

        {/* 7. Business Capabilities */}
        <CapabilitiesSection onRequestQuote={handleRequestQuoteGeneral} />

        {/* 8. Quality Section */}
        <QualitySection />

        {/* About Section */}
        <AboutSection />

        {/* 9. Contact & Quotation Form */}
        <QuotationForm
          initialProductNameOrCas={quoteTargetProduct}
          onSuccessSubmit={handleFormQuoteSubmitted}
        />
      </main>

      {/* 6. Product Detail Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        onSubmitQuote={handleModalQuoteSubmitted}
      />

      {/* 10. Footer */}
      <Footer />

      {/* 11. Bottom Contact Information Strip */}
      <div className="bg-[#050b16] text-white text-[11px] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
            <span>APIIC Industrial Park, Gajuwaka, Andhra Pradesh, India</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-white">
            <a
              href="tel:7619431029"
              className="flex items-center gap-1.5 hover:text-teal-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-teal-400 shrink-0" />
              <span>7619431029</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a
              href="mailto:chennaichemicalindustries@gmail.com"
              className="flex items-center gap-1.5 hover:text-teal-300 transition-colors"
              title="Primary Corporate Email"
            >
              <Mail className="w-3 h-3 text-teal-400 shrink-0" />
              <span>chennaichemicalindustries@gmail.com</span>
            </a>
            <span className="text-slate-700 hidden lg:inline">|</span>
            <a
              href="mailto:sales@chennaichemicalindustries.com"
              className="flex items-center gap-1.5 hover:text-teal-300 transition-colors"
              title="Commercial Sales & RFQs"
            >
              <span className="text-slate-400 font-sans text-[10px] uppercase font-bold tracking-wider">Sales:</span>
              <span>sales@chennaichemicalindustries.com</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a
              href="#/admin"
              className="flex items-center gap-1 text-slate-300 hover:text-teal-300 transition-colors font-medium font-sans"
            >
              <Shield className="w-3 h-3 text-teal-400 shrink-0" />
              <span>Admin Portal</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
