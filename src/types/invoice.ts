export type DocumentType = 'vat' | 'proforma';

export type KSeFStatus = 'pending' | 'sent' | 'accepted' | 'rejected' | 'error';

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

export interface KSeFData {
  status: KSeFStatus;
  sessionToken?: string;
  referenceNumber?: string;
  ksefNumber?: string;
  sentAt?: string;
  upo?: string;
  errorMessage?: string;
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
  ksef?: KSeFData;
}

export interface InvoiceCalculations {
  totalNet: number;
  totalVat: number;
  totalGross: number;
  remaining: number;
}
