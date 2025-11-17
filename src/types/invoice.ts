export type DocumentType = 'vat' | 'proforma';

export interface Seller {
  name: string;
  address: string;
  city: string;
  nip: string;
}

export interface Buyer {
  id?: string;
  name: string;
  nip: string;
  address: string;
  city: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface Invoice {
  id?: string;
  documentType: DocumentType;
  invoiceNumber: string;
  issueDate: string;
  saleDate: string;
  paymentDue: string;
  issuePlace: string;
  paymentMethod: string;
  vatRate: number;
  seller: Seller;
  buyer: Buyer;
  items: InvoiceItem[];
  paidAmount: number;
  bankAccount: string;
  createdAt?: string;
  proformaReference?: string;
}

export interface InvoiceCalculations {
  totalNet: number;
  totalVat: number;
  totalGross: number;
  remaining: number;
}
