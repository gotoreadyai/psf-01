import { create } from 'zustand';
import type { Invoice, Buyer, DocumentType } from '../types/invoice';
import type { SellerData } from '../types/seller';
import { storage } from '../utils/storage';

interface InvoiceStore {
  // Seller
  seller: SellerData | null;
  loadSeller: () => void;
  saveSeller: (seller: SellerData) => void;
  hasSellerData: () => boolean;
  
  // Buyers
  buyers: Buyer[];
  loadBuyers: () => void;
  addBuyer: (buyer: Buyer) => void;
  updateBuyer: (id: string, buyer: Partial<Buyer>) => void;
  deleteBuyer: (id: string) => void;
  
  // Invoices
  invoices: Invoice[];
  currentFilter: 'all' | DocumentType;
  loadInvoices: () => void;
  addInvoice: (invoice: Invoice) => Invoice;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  setFilter: (filter: 'all' | DocumentType) => void;
  exportInvoices: () => string;
  importInvoices: (json: string) => void;
  getNextInvoiceNumber: (type: DocumentType) => string;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  // Seller
  seller: null,
  
  loadSeller: () => {
    set({ seller: storage.seller.get() });
  },
  
  saveSeller: (seller) => {
    const saved = storage.seller.set(seller);
    set({ seller: saved });
  },
  
  hasSellerData: () => {
    return storage.seller.exists();
  },
  
  // Buyers
  buyers: [],
  
  loadBuyers: () => {
    set({ buyers: storage.buyers.getAll() });
  },
  
  addBuyer: (buyer) => {
    const newBuyer = storage.buyers.add(buyer);
    set({ buyers: storage.buyers.getAll() });
    return newBuyer;
  },
  
  updateBuyer: (id, buyer) => {
    storage.buyers.update(id, buyer);
    set({ buyers: storage.buyers.getAll() });
  },
  
  deleteBuyer: (id) => {
    storage.buyers.delete(id);
    set({ buyers: storage.buyers.getAll() });
  },
  
  // Invoices
  invoices: [],
  currentFilter: 'all',
  
  loadInvoices: () => {
    set({ invoices: storage.invoices.getAll() });
  },
  
  addInvoice: (invoice) => {
    const newInvoice = storage.invoices.add(invoice);
    set({ invoices: storage.invoices.getAll() });
    return newInvoice;
  },
  
  updateInvoice: (id, invoice) => {
    storage.invoices.update(id, invoice);
    set({ invoices: storage.invoices.getAll() });
  },
  
  deleteInvoice: (id) => {
    storage.invoices.delete(id);
    set({ invoices: storage.invoices.getAll() });
  },
  
  setFilter: (filter) => {
    set({ currentFilter: filter });
  },
  
  exportInvoices: () => {
    return storage.invoices.export();
  },
  
  importInvoices: (json) => {
    storage.invoices.import(json);
    set({ invoices: storage.invoices.getAll() });
  },
  
  getNextInvoiceNumber: (type) => {
    return storage.invoices.getNextNumber(type);
  }
}));