export type ProductCategory =
  | 'Organic Laboratory Reagents'
  | 'Pharmaceutical Intermediates'
  | 'Life Science Chemicals'
  | 'Analytical Reagents'
  | 'Materials Science Chemicals'
  | 'Specialty Chemicals'
  | 'Custom Synthesis'
  | 'Bulk Chemicals';

export interface ChemicalProduct {
  id: string;
  name: string;
  synonym?: string;
  cas?: string;
  casNo: string;
  code?: string;
  productCode?: string;
  category: ProductCategory;
  package?: string;
  packageSize?: string;
  price?: string;
  tag?: string;
  purity?: string;
  molecularFormula?: string;
  molecularWeight?: number;
  inStock?: boolean;
  description?: string;
  grade?: string;
  applications?: string[];
  safety?: {
    hazardClass?: string;
    storageTemp?: string;
    signalWord?: 'Danger' | 'Warning' | 'Caution' | 'None';
  };
  synonyms?: string[];
  structureSvgDescription?: string;
}

export interface QuoteFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  productNameOrCas: string;
  quantity: string;
  message: string;
}
