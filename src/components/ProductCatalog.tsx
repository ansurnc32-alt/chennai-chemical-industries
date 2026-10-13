import React, { useState, useMemo, useEffect } from 'react';
import { ChemicalProduct, ProductCategory } from '../types';
import { CATEGORIES } from '../data/products';
import { ChemicalStructureView } from './ChemicalStructureView';
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileText,
  Send,
  X,
  Info,
  Copy,
  Check,
  ArrowUpDown,
  Sparkles,
  FlaskConical,
  Beaker,
  Dna,
  Layers,
  Atom,
} from 'lucide-react';

interface ProductCatalogProps {
  products: ChemicalProduct[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ProductCategory | 'All';
  onCategoryChange: (cat: ProductCategory | 'All') => void;
  onSelectProduct: (product: ChemicalProduct) => void;
  onRequestQuoteForProduct: (product: ChemicalProduct) => void;
}

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'cas-asc' | 'category';

// Category icons map
const categoryIcons: Record<string, React.ElementType> = {
  'Organic Laboratory Reagents': FlaskConical,
  'Pharmaceutical Intermediates': Atom,
  'Life Science Chemicals': Dna,
  'Analytical Reagents': Beaker,
  'Materials Science Chemicals': Layers,
  'Specialty Chemicals': Sparkles,
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onSelectProduct,
  onRequestQuoteForProduct,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [itemsPerPage, setItemsPerPage] = useState<number>(9);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedCasId, setCopiedCasId] = useState<string | null>(null);

  // Helper for copying CAS RN
  const handleCopyCas = (e: React.MouseEvent, cas: string, id: string) => {
    e.stopPropagation();
    if (!cas || cas === 'Client-Specified') return;
    navigator.clipboard.writeText(cas);
    setCopiedCasId(id);
    setTimeout(() => setCopiedCasId(null), 2000);
  };

  // Advanced multi-token, hyphen-agnostic, synonym-aware search filter
  const filteredProducts = useMemo(() => {
    const qClean = searchQuery.trim().toLowerCase();
    const qNoHyphen = qClean.replace(/[-\s]/g, '');
    const tokens = qClean.split(/\s+/).filter(Boolean);

    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Stock filter
      if (inStockOnly && !p.inStock) {
        return false;
      }

      if (!qClean) return true;

      // Extract all searchable metadata
      const cas = (p.casNo || p.cas || '').toLowerCase();
      const casNoHyphen = cas.replace(/[-\s]/g, '');
      const name = p.name.toLowerCase();
      const code = (p.productCode || p.code || '').toLowerCase();
      const formula = (p.molecularFormula || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const grade = (p.grade || '').toLowerCase();
      const cat = p.category.toLowerCase();
      const syns = [
        ...(p.synonym ? [p.synonym.toLowerCase()] : []),
        ...(p.synonyms ? p.synonyms.map((s) => s.toLowerCase()) : []),
      ];
      const apps = (p.applications || []).map((a) => a.toLowerCase());
      const tag = (p.tag || '').toLowerCase();

      const searchableBlob = [
        name,
        cas,
        code,
        formula,
        desc,
        grade,
        cat,
        tag,
        ...syns,
        ...apps,
      ].join(' ');

      // Direct phrase match or CAS match without hyphens
      if (searchableBlob.includes(qClean)) return true;
      if (casNoHyphen && qNoHyphen.length >= 3 && casNoHyphen.includes(qNoHyphen)) return true;

      // Tokenized search: Every word typed must match somewhere in the product
      const allTokensMatch = tokens.every(
        (token) =>
          searchableBlob.includes(token) ||
          (casNoHyphen && casNoHyphen.includes(token.replace(/[-\s]/g, '')))
      );

      return allTokensMatch;
    });
  }, [products, searchQuery, selectedCategory, inStockOnly]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts];
    switch (sortBy) {
      case 'name-asc':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      case 'cas-asc':
        return copy.sort((a, b) => (a.casNo || a.cas || '').localeCompare(b.casNo || b.cas || ''));
      case 'category':
        return copy.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return copy;
    }
  }, [filteredProducts, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, inStockOnly, sortBy, itemsPerPage]);

  // Pagination calculation
  const totalItems = sortedProducts.length;
  const isAllPages = itemsPerPage === -1;
  const totalPages = isAllPages ? 1 : Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    if (isAllPages) return sortedProducts;
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage, isAllPages]);

  // Category counts matching current search query
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    for (const cat of CATEGORIES) {
      counts[cat] = 0;
    }

    const qClean = searchQuery.trim().toLowerCase();
    const qNoHyphen = qClean.replace(/[-\s]/g, '');
    const tokens = qClean.split(/\s+/).filter(Boolean);

    for (const p of products) {
      if (inStockOnly && !p.inStock) continue;

      let matches = true;
      if (qClean) {
        const cas = (p.casNo || p.cas || '').toLowerCase();
        const casNoHyphen = cas.replace(/[-\s]/g, '');
        const name = p.name.toLowerCase();
        const code = (p.productCode || p.code || '').toLowerCase();
        const formula = (p.molecularFormula || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const grade = (p.grade || '').toLowerCase();
        const cat = p.category.toLowerCase();
        const syns = [
          ...(p.synonym ? [p.synonym.toLowerCase()] : []),
          ...(p.synonyms ? p.synonyms.map((s) => s.toLowerCase()) : []),
        ];
        const apps = (p.applications || []).map((a) => a.toLowerCase());

        const blob = [name, cas, code, formula, desc, grade, cat, ...syns, ...apps].join(' ');

        matches =
          blob.includes(qClean) ||
          (Boolean(casNoHyphen) && qNoHyphen.length >= 3 && casNoHyphen.includes(qNoHyphen)) ||
          tokens.every(
            (token) =>
              blob.includes(token) ||
              (Boolean(casNoHyphen) && casNoHyphen.includes(token.replace(/[-\s]/g, '')))
          );
      }

      if (matches) {
        counts.All += 1;
        if (counts[p.category] !== undefined) {
          counts[p.category] += 1;
        }
      }
    }
    return counts;
  }, [products, searchQuery, inStockOnly]);

  return (
    <section id="products" className="py-20 bg-slate-50 border-b border-slate-200/90 scroll-mt-20 scientific-grid-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
              Enterprise Chemical Catalogue & Procurement Index
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              High-Purity Reagents & Intermediates
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Certified laboratory reagents, bulk intermediates, and building blocks with verified analytical release documentation (CoA, HPLC, GC-MS, and SDS).
            </p>
          </div>

          {/* View Toggle and Count Badge */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              Matching: <span className="font-bold text-slate-900">{filteredProducts.length}</span> compounds
            </span>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#0a1324] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Grid Cards View"
                aria-label="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#0a1324] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Technical Table View"
                aria-label="Technical Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scientific Filter Console */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 mb-8 space-y-5">
          {/* Main Search Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search compound name, CAS Registry Number, molecular formula, or keyword..."
                className="w-full pl-11 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-teal-600" />
              <label htmlFor="catalog-sort-select" className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                Sort:
              </label>
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
              >
                <option value="default">Default Relevance</option>
                <option value="name-asc">Chemical Name (A–Z)</option>
                <option value="name-desc">Chemical Name (Z–A)</option>
                <option value="cas-asc">CAS Registry Number</option>
                <option value="category">Chemical Category</option>
              </select>
            </div>

            {/* In-Stock Filter */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 select-none hover:bg-slate-100 transition-colors shrink-0">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-sm border-slate-300 focus:ring-teal-500 cursor-pointer"
              />
              <span>In-Stock Only</span>
            </label>
          </div>

          {/* Category Pathways Grid */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Filter className="w-3.5 h-3.5 text-teal-600" />
                <span>Chemical Categories:</span>
              </div>
              {(searchQuery.trim() !== '' || selectedCategory !== 'All' || inStockOnly || sortBy !== 'default') && (
                <button
                  onClick={() => {
                    onSearchChange('');
                    onCategoryChange('All');
                    setInStockOnly(false);
                    setSortBy('default');
                  }}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              <button
                onClick={() => onCategoryChange('All')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer border ${
                  selectedCategory === 'All'
                    ? 'bg-[#0a1324] text-white border-[#0a1324] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">All</span>
                <span className="font-bold truncate mt-0.5">All Categories</span>
                <span className={`text-[10px] font-mono mt-1 ${selectedCategory === 'All' ? 'text-teal-300' : 'text-slate-500'}`}>
                  {categoryCounts.All || products.length} items
                </span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isSelected = selectedCategory === cat;
                const IconComponent = categoryIcons[cat] || FlaskConical;

                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                        : count === 0
                        ? 'bg-slate-50/50 text-slate-400 border-slate-200/60 hover:bg-slate-50'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-200' : 'text-teal-600'}`} />
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-teal-200' : 'text-slate-500'}`}>
                        {count}
                      </span>
                    </div>
                    <span className="line-clamp-2 leading-tight text-[11px] font-semibold">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 p-8 shadow-xs">
            <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No matching chemical compounds found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1.5 mb-6">
              We couldn&apos;t find products matching &ldquo;{searchQuery}&rdquo;. Try searching by CAS number, chemical family, or contact our sales team for custom synthesis feasibility.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  onSearchChange('');
                  onCategoryChange('All');
                  setInStockOnly(false);
                }}
                className="px-5 py-2.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid View */}
        {filteredProducts.length > 0 && viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => {
              const casDisplay = product.casNo || product.cas || 'Client-Specified';
              const codeDisplay = product.productCode || product.code || '';
              const isCopied = copiedCasId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Metadata Row */}
                    <div className="flex items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
                      <span className="font-semibold text-teal-800 text-[11px] truncate">{product.category}</span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        In Stock
                      </span>
                    </div>

                    {/* Chemical Compound Name */}
                    <div>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                      >
                        {product.name}
                      </h3>
                      {product.synonym ? (
                        <div className="text-xs text-slate-500 font-mono line-clamp-1 mt-1">
                          <span className="text-slate-400 font-sans text-[10px] uppercase">Syn:</span> {product.synonym}
                        </div>
                      ) : null}
                    </div>

                    {/* CAS RN Badge & Product Code */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <div className="inline-flex items-center bg-[#0a1324] text-teal-300 px-3 py-1 rounded-lg border border-slate-800 font-semibold shadow-2xs">
                        <span className="text-slate-400 mr-1 text-[10px] uppercase font-sans">CAS RN:</span>
                        <span>{casDisplay}</span>
                        {casDisplay !== 'Client-Specified' && (
                          <button
                            type="button"
                            onClick={(e) => handleCopyCas(e, casDisplay, product.id)}
                            className="ml-2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                            title="Copy CAS RN"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      {codeDisplay ? (
                        <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
                          Code: {codeDisplay}
                        </span>
                      ) : null}
                    </div>

                    {/* Chemical Structure Illustration Area */}
                    <div className="pt-1">
                      <ChemicalStructureView
                        productId={product.id}
                        casNo={casDisplay}
                        productName={product.name}
                        variant="card"
                      />
                    </div>

                    {/* Technical Specifications Grid */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                      {product.molecularFormula ? (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Formula</span>
                          <span className="font-bold text-slate-800 font-mono">{product.molecularFormula}</span>
                        </div>
                      ) : null}
                      {product.purity ? (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Purity</span>
                          <span className="font-bold text-emerald-700 font-mono">{product.purity}</span>
                        </div>
                      ) : null}
                      {(product.packageSize || product.package) ? (
                        <div className="col-span-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Standard Packaging</span>
                          <span className="text-slate-700 font-semibold">{product.packageSize || product.package}</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Chemical Description */}
                    {product.description ? (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    ) : null}
                  </div>

                  {/* Commercial Price & Action Controls */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Price / Quote</span>
                      <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                        {product.price || 'Inquire for Bulk Price'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        title="View Technical Specification Sheet"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Specs</span>
                      </button>

                      <button
                        onClick={() => onRequestQuoteForProduct(product)}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-[#0a1324] hover:bg-teal-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                      >
                        <span>Request Quote</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Products Table View */}
        {filteredProducts.length > 0 && viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0a1324] text-slate-300 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Chemical Compound Name</th>
                    <th className="py-3.5 px-3 font-mono">CAS Registry No.</th>
                    <th className="py-3.5 px-3 font-mono">Code</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3 font-mono">Formula</th>
                    <th className="py-3.5 px-3 font-mono">Purity</th>
                    <th className="py-3.5 px-3">Packaging</th>
                    <th className="py-3.5 px-3 font-mono">Commercial Price</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProducts.map((product) => {
                    const casDisplay = product.casNo || product.cas || 'Client-Specified';
                    const codeDisplay = product.productCode || product.code || '—';
                    const isCopied = copiedCasId === product.id;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-teal-50/50 transition-colors group cursor-pointer"
                        onClick={() => onSelectProduct(product)}
                      >
                        <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-teal-900 max-w-sm">
                          <div className="flex items-center gap-3">
                            <ChemicalStructureView
                              productId={product.id}
                              casNo={casDisplay}
                              productName={product.name}
                              variant="table"
                            />
                            <div className="min-w-0">
                              <div className="line-clamp-1">{product.name}</div>
                              {product.synonym ? (
                                <div className="text-[11px] text-teal-700 font-normal font-mono line-clamp-1">
                                  Syn: {product.synonym}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{casDisplay}</span>
                            {casDisplay !== 'Client-Specified' && (
                              <button
                                type="button"
                                onClick={(e) => handleCopyCas(e, casDisplay, product.id)}
                                className="text-slate-400 hover:text-slate-800 p-1 rounded cursor-pointer transition-colors"
                                title="Copy CAS RN"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {codeDisplay}
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                          {product.category}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-900 whitespace-nowrap font-medium">
                          {product.molecularFormula || '—'}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-emerald-700 whitespace-nowrap font-bold">
                          {product.purity || '—'}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          {product.packageSize || product.package || '—'}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                          {product.price || 'Inquire'}
                        </td>
                        <td
                          className="py-3.5 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => onRequestQuoteForProduct(product)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-[#0a1324] hover:bg-teal-700 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Quote</span>
                            <Send className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredProducts.length > itemsPerPage && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3 text-xs text-slate-600 font-mono tabular-nums">
              <span>
                Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
                <span className="font-bold text-slate-900">{totalPages}</span> ({filteredProducts.length} filtered items)
              </span>

              <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
                <span>· Show:</span>
                {[9, 18, 38].map((size) => (
                  <button
                    key={size}
                    onClick={() => setItemsPerPage(size)}
                    className={`px-2 py-0.5 rounded-md cursor-pointer text-xs ${
                      itemsPerPage === size
                        ? 'bg-[#0a1324] font-bold text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {size === 38 ? 'All' : size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8.5 h-8.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#0a1324] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
