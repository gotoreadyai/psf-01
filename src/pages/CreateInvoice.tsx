import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { InvoiceForm } from '../components/invoices/InvoiceForm';
import { InvoicePreview } from '../components/invoices/InvoicePreview';
import { SellerSetupModal } from '../components/seller/SellerSetupModal';
import type { Invoice } from '../types/invoice';
import type { SellerData } from '../types/seller';
import { getCurrentDate } from '../utils/formatting';
import { useInvoiceStore } from '../store/invoiceStore';

export const CreateInvoice: React.FC = () => {
  const { seller, loadSeller, saveSeller, hasSellerData } = useInvoiceStore();
  const [showSetup, setShowSetup] = useState(() => !hasSellerData());
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadSeller();
  }, [loadSeller]);

  const handleSellerSetup = (data: SellerData) => {
    saveSeller(data);
    setShowSetup(false);
    
    // Initialize default invoice with seller data
    setCurrentInvoice({
      documentType: 'vat',
      invoiceNumber: '1/11/2025',
      issueDate: getCurrentDate(),
      saleDate: getCurrentDate(),
      paymentDue: getCurrentDate(),
      issuePlace: 'Warszawa',
      paymentMethod: 'Przelew',
      vatRate: 23,
      seller: {
        name: data.name,
        address: data.address,
        city: data.city,
        nip: data.nip
      },
      buyer: { name: '', nip: '', address: '', city: '' },
      items: [{ name: 'Usługi informatyczne', quantity: 1, unit: 'godz.', unitPrice: 160 }],
      paidAmount: 0,
      bankAccount: data.bankAccount
    });
  };

  // If no seller data and not showing setup yet, show loading
  if (!seller && !showSetup) {
    return null;
  }

  return (
    <>
      <SellerSetupModal 
        isOpen={showSetup} 
        onComplete={handleSellerSetup}
      />
      
      <div className="max-w-[1400px] mx-auto px-5 py-5">
        <TopBar title="SYSTEM FAKTUR" linkTo="/manage" linkText="ZARZĄDZAJ →" />
        
        <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-10 items-start">
          <InvoiceForm onUpdate={setCurrentInvoice} />
          {currentInvoice && <InvoicePreview invoice={currentInvoice} />}
        </div>
      </div>
    </>
  );
};