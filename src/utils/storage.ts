import type { Buyer, Invoice, DocumentType } from '../types/invoice';
import type { SellerData } from '../types/seller';

const BUYERS_KEY = 'invoice_buyers';
const INVOICES_KEY = 'invoice_history';
const SELLER_KEY = 'invoice_seller';
const KSEF_CONFIG_KEY = 'ksef_config';

export const storage = {
  seller: {
    get(): SellerData | null {
      const data = localStorage.getItem(SELLER_KEY);
      return data ? JSON.parse(data) : null;
    },
    set(seller: SellerData): SellerData {
      const data = {
        ...seller,
        id: seller.id || 'seller-1',
        updatedAt: new Date().toISOString(),
        createdAt: seller.createdAt || new Date().toISOString()
      };
      localStorage.setItem(SELLER_KEY, JSON.stringify(data));
      return data;
    },
    exists(): boolean {
      return localStorage.getItem(SELLER_KEY) !== null;
    },
    clear(): void {
      localStorage.removeItem(SELLER_KEY);
    }
  },

  buyers: {
    getAll(): Buyer[] {
      return JSON.parse(localStorage.getItem(BUYERS_KEY) || '[]');
    },
    
    findByNIP(nip: string): Buyer | undefined {
      const cleaned = nip.replace(/[^0-9]/g, '');
      return this.getAll().find(b => b.nip.replace(/[^0-9]/g, '') === cleaned);
    },
    
    search(query: string): Buyer[] {
      const q = query.toLowerCase().trim();
      if (!q) return this.getAll();
      return this.getAll().filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.nip.includes(q) ||
        b.city.toLowerCase().includes(q)
      );
    },
    
    add(buyer: Buyer): Buyer {
      const all = this.getAll();
      const newBuyer = {
        ...buyer,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      all.push(newBuyer);
      localStorage.setItem(BUYERS_KEY, JSON.stringify(all));
      return newBuyer;
    },
    
    addIfNotExists(buyer: Buyer): Buyer | null {
      if (!buyer.nip || buyer.nip.trim() === '') return null;
      const existing = this.findByNIP(buyer.nip);
      if (existing) return null;
      return this.add(buyer);
    },
    
    update(id: string, buyer: Partial<Buyer>): void {
      const all = this.getAll();
      const index = all.findIndex(b => String(b.id) === String(id));
      if (index >= 0) {
        all[index] = {
          ...all[index],
          ...buyer,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(BUYERS_KEY, JSON.stringify(all));
      }
    },
    
    delete(id: string): void {
      const all = this.getAll();
      localStorage.setItem(BUYERS_KEY, JSON.stringify(all.filter(b => String(b.id) !== String(id))));
    }
  },

  invoices: {
    getAll(): Invoice[] {
      return JSON.parse(localStorage.getItem(INVOICES_KEY) || '[]');
    },
    
    add(invoice: Invoice): Invoice {
      const all = this.getAll();
      const newInvoice = {
        ...invoice,
        id: String(Date.now()),
        createdAt: new Date().toISOString()
      };
      all.push(newInvoice);
      localStorage.setItem(INVOICES_KEY, JSON.stringify(all));
      
      // Auto-add buyer if not exists
      if (invoice.buyer && invoice.buyer.nip) {
        storage.buyers.addIfNotExists(invoice.buyer);
      }
      
      return newInvoice;
    },
    
    update(id: string, invoice: Partial<Invoice>): void {
      const all = this.getAll();
      const index = all.findIndex(inv => String(inv.id) === String(id));
      if (index >= 0) {
        all[index] = { ...all[index], ...invoice };
        localStorage.setItem(INVOICES_KEY, JSON.stringify(all));
      }
    },
    
    delete(id: string): void {
      const all = this.getAll();
      localStorage.setItem(INVOICES_KEY, JSON.stringify(all.filter(inv => String(inv.id) !== String(id))));
    },
    
    export(): string {
      return JSON.stringify(this.getAll(), null, 2);
    },
    
    import(json: string): void {
      localStorage.setItem(INVOICES_KEY, json);
    },
    
    getNextNumber(type: DocumentType = 'vat'): string {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const all = this.getAll();

      const thisMonth = all.filter(inv => {
        if (inv.documentType !== type) return false;
        const parts = inv.invoiceNumber.split('/');
        if (type === 'proforma') {
          return parts[2] == String(month) && parts[3] == String(year);
        } else {
          return parts[1] == String(month) && parts[2] == String(year);
        }
      });

      const maxNum = thisMonth.reduce((max, inv) => {
        const parts = inv.invoiceNumber.split('/');
        const num = parseInt(parts[type === 'proforma' ? 1 : 0]);
        return num > max ? num : max;
      }, 0);

      if (type === 'proforma') {
        return `PRO/${maxNum + 1}/${month}/${year}`;
      } else {
        return `${maxNum + 1}/${month}/${year}`;
      }
    }
  },

  ksef: {
    getConfig(): { environment: 'test' | 'production'; token: string } | null {
      const data = localStorage.getItem(KSEF_CONFIG_KEY);
      return data ? JSON.parse(data) : null;
    },
    setConfig(config: { environment: 'test' | 'production'; token: string }): void {
      localStorage.setItem(KSEF_CONFIG_KEY, JSON.stringify(config));
    },
    clearConfig(): void {
      localStorage.removeItem(KSEF_CONFIG_KEY);
    }
  }
};
