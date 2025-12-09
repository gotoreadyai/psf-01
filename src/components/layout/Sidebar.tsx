import React, { useState, useEffect, useMemo } from 'react';
import type { DocumentType, Invoice, InvoiceItem, Buyer } from '../../types/invoice';
import type { SellerData } from '../../types/seller';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { Collapsible } from '../ui/Collapsible';
import { Modal } from '../ui/Modal';
import { useInvoiceStore } from '../../store/invoiceStore';
import { getCurrentDate, dateToInput, inputToDate, formatNumber } from '../../utils/formatting';
import { BuyerForm } from '../buyers/BuyerForm';
import { BuyerSearch } from '../buyers/BuyerSearch';
import { SellerForm } from '../seller/SellerForm';
import { KSeFPanel } from '../ksef/KSeFPanel';
import { InvoicePreview } from '../invoices/InvoicePreview';
import { downloadKSeFXML } from '../../utils/exporter';

interface SidebarProps {
  onInvoiceUpdate: (invoice: Invoice) => void;
}

type ActiveTab = 'invoice' | 'seller' | 'buyers' | 'documents' | 'ksef';

export const Sidebar: React.FC<SidebarProps> = ({ onInvoiceUpdate }) => {
  const { 
    seller,
    buyers, 
    invoices,
    loadBuyers, 
    loadInvoices,
    addBuyer,
    updateBuyer,
    deleteBuyer,
    addInvoice,
    deleteInvoice,
    saveSeller,
    getNextInvoiceNumber 
  } = useInvoiceStore();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('invoice');
  const [docType, setDocType] = useState<DocumentType>('vat');
  
  const initialFormData = useMemo(() => ({
    documentType: 'vat' as DocumentType,
    invoiceNumber: getNextInvoiceNumber('vat'),
    issueDate: getCurrentDate(),
    saleDate: getCurrentDate(),
    paymentDue: getCurrentDate(),
    issuePlace: 'Warszawa',
    paymentMethod: 'Przelew',
    vatRate: 23,
    seller: seller ? {
      name: seller.name,
      address: seller.address,
      city: seller.city,
      nip: seller.nip
    } : { name: '', address: '', city: '', nip: '' },
    buyer: { name: '', nip: '', address: '', city: '' },
    items: [{ name: 'Usługi informatyczne', quantity: 1, unit: 'godz.', unitPrice: 160 }],
    paidAmount: 0,
    bankAccount: seller?.bankAccount || ''
  }), [seller, getNextInvoiceNumber]);

  const [formData, setFormData] = useState<Invoice>(initialFormData);
  const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadBuyers();
    loadInvoices();
  }, [loadBuyers, loadInvoices]);

  useEffect(() => {
    onInvoiceUpdate(formData);
  }, [formData, onInvoiceUpdate]);

  const handleDocTypeChange = (type: DocumentType) => {
    setDocType(type);
    setFormData(prev => ({
      ...prev,
      documentType: type,
      invoiceNumber: getNextInvoiceNumber(type)
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBuyerChange = (buyer: Buyer) => {
    setFormData(prev => ({ ...prev, buyer }));
  };

  const handleBuyerSelect = (buyer: Buyer) => {
    setFormData(prev => ({ ...prev, buyer }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unit: 'szt.', unitPrice: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = () => {
    if (!formData.buyer.name || !formData.buyer.nip) {
      alert('Uzupełnij dane nabywcy');
      return;
    }
    addInvoice(formData);
    alert(`${docType === 'proforma' ? 'Proforma' : 'Faktura'} zapisana!`);
    
    setFormData({
      documentType: docType,
      invoiceNumber: getNextInvoiceNumber(docType),
      issueDate: getCurrentDate(),
      saleDate: getCurrentDate(),
      paymentDue: getCurrentDate(),
      issuePlace: 'Warszawa',
      paymentMethod: 'Przelew',
      vatRate: 23,
      seller: seller ? {
        name: seller.name,
        address: seller.address,
        city: seller.city,
        nip: seller.nip
      } : { name: '', address: '', city: '', nip: '' },
      buyer: { name: '', nip: '', address: '', city: '' },
      items: [{ name: 'Usługi informatyczne', quantity: 1, unit: 'godz.', unitPrice: 160 }],
      paidAmount: 0,
      bankAccount: seller?.bankAccount || ''
    });
  };

  const openBuyerModal = (buyer?: Buyer) => {
    setEditingBuyer(buyer || null);
    setIsBuyerModalOpen(true);
  };

  const handleSaveBuyer = (buyerData: Buyer) => {
    if (editingBuyer?.id) {
      updateBuyer(editingBuyer.id, buyerData);
    } else {
      addBuyer(buyerData);
    }
    setIsBuyerModalOpen(false);
    setEditingBuyer(null);
  };

  const handleDeleteBuyer = (id: string) => {
    if (confirm('Usunąć odbiorcę?')) {
      deleteBuyer(id);
    }
  };

  const handleSaveSeller = (data: SellerData) => {
    saveSeller(data);
    alert('Dane firmy zostały zaktualizowane');
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Usunąć dokument?')) {
      deleteInvoice(id);
    }
  };

  const handleConvertToVAT = (proforma: Invoice) => {
    if (!confirm('Utworzyć fakturę VAT na podstawie tej proformy?')) return;
    const vatInvoice: Invoice = {
      ...proforma,
      documentType: 'vat',
      invoiceNumber: getNextInvoiceNumber('vat'),
      proformaReference: proforma.invoiceNumber
    };
    addInvoice(vatInvoice);
    alert(`Utworzono fakturę VAT ${vatInvoice.invoiceNumber}`);
  };

  const tabs = [
    { id: 'invoice' as const, label: 'Faktura' },
    { id: 'seller' as const, label: 'Firma' },
    { id: 'buyers' as const, label: 'Odbiorcy', badge: buyers.length },
    { id: 'documents' as const, label: 'Dokumenty', badge: invoices.length },
    { id: 'ksef' as const, label: 'KSeF' },
  ];

  return (
    <div className="sticky top-5">
      <div className="flex flex-wrap gap-1 mb-5 border-b-2 border-black pb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
                activeTab === tab.id ? 'bg-white text-black' : 'bg-gray-300'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'invoice' && (
        <div>
          <div className="flex gap-5 p-4 border-2 border-black mb-5 justify-center">
            <label className="flex items-center gap-2 cursor-pointer text-[12px] uppercase tracking-wider">
              <input
                type="radio"
                value="vat"
                checked={docType === 'vat'}
                onChange={() => handleDocTypeChange('vat')}
                className="cursor-pointer"
              />
              Faktura VAT
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[12px] uppercase tracking-wider">
              <input
                type="radio"
                value="proforma"
                checked={docType === 'proforma'}
                onChange={() => handleDocTypeChange('proforma')}
                className="cursor-pointer"
              />
              Proforma
            </label>
          </div>

          <Collapsible title="Dane dokumentu" defaultOpen>
            <Input
              label={`Numer ${docType === 'proforma' ? 'proformy' : 'faktury'}`}
              value={formData.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            />
            <Input
              label="Data wystawienia"
              type="date"
              value={dateToInput(formData.issueDate)}
              onChange={(e) => handleInputChange('issueDate', inputToDate(e.target.value))}
            />
            <Input
              label="Data sprzedaży"
              type="date"
              value={dateToInput(formData.saleDate)}
              onChange={(e) => handleInputChange('saleDate', inputToDate(e.target.value))}
            />
            <Input
              label="Termin płatności"
              type="date"
              value={dateToInput(formData.paymentDue)}
              onChange={(e) => handleInputChange('paymentDue', inputToDate(e.target.value))}
            />
            <Input
              label="Miejsce wystawienia"
              value={formData.issuePlace}
              onChange={(e) => handleInputChange('issuePlace', e.target.value)}
            />
            <Select
              label="Sposób płatności"
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            >
              <option>Przelew</option>
              <option>Gotówka</option>
              <option>Karta</option>
            </Select>
          </Collapsible>

          <Collapsible title="Nabywca" defaultOpen>
            <BuyerSearch onSelect={handleBuyerSelect} />
            <BuyerForm
              initialData={formData.buyer}
              onSubmit={() => {}}
              showSubmitButton={false}
              showSearch={false}
              onChange={handleBuyerChange}
            />
          </Collapsible>

          <Collapsible title="Pozycje" defaultOpen>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center pb-4 border-b border-gray-300">
                  <input
                    className="px-3 py-2 border border-black text-[13px] w-full"
                    placeholder="Nazwa"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  />
                  <input
                    className="px-3 py-2 border border-black text-[13px] w-16"
                    type="number"
                    step="0.01"
                    placeholder="Ilość"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <input
                    className="px-3 py-2 border border-black text-[13px] w-16"
                    placeholder="Jedn."
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                  />
                  <input
                    className="px-3 py-2 border border-black text-[13px] w-24"
                    type="number"
                    step="0.01"
                    placeholder="Cena"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                  <button
                    onClick={() => removeItem(index)}
                    className="text-lg hover:opacity-70 bg-gray-800 w-8 h-8 rounded text-white shadow flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-2.5" onClick={addItem}>
              + DODAJ POZYCJĘ
            </Button>
          </Collapsible>

          <Button className="w-full mt-5" onClick={handleSave}>
            WYSTAW I ZAPISZ
          </Button>
        </div>
      )}

      {activeTab === 'seller' && seller && (
        <div>
          <h2 className="text-[11px] uppercase tracking-wider mb-5 text-gray-600">
            Dane wystawcy faktur
          </h2>
          <SellerForm 
            initialData={seller}
            onSubmit={handleSaveSeller}
            submitLabel="ZAPISZ ZMIANY"
          />
        </div>
      )}

      {activeTab === 'buyers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[11px] uppercase tracking-wider text-gray-600">
              Baza odbiorców
            </h2>
            <Button size="sm" onClick={() => openBuyerModal()}>+ DODAJ</Button>
          </div>

          {buyers.length === 0 ? (
            <p className="text-[13px] text-gray-600">Brak odbiorców w bazie</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {buyers.map(b => (
                <div key={b.id} className="border border-gray-300 p-3">
                  <div className="text-[13px] font-bold">{b.name}</div>
                  <div className="text-[11px] text-gray-600">NIP: {b.nip}</div>
                  <div className="text-[11px] text-gray-600">{b.address}, {b.city}</div>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => openBuyerModal(b)} 
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      Edytuj
                    </button>
                    <button 
                      onClick={() => b.id && handleDeleteBuyer(b.id)} 
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal
            isOpen={isBuyerModalOpen}
            onClose={() => setIsBuyerModalOpen(false)}
            title={editingBuyer ? 'EDYTUJ ODBIORCĘ' : 'DODAJ ODBIORCĘ'}
          >
            <BuyerForm
              initialData={editingBuyer || undefined}
              onSubmit={handleSaveBuyer}
              showSearch={false}
              submitLabel={editingBuyer ? 'ZAPISZ ZMIANY' : 'DODAJ'}
            />
          </Modal>
        </div>
      )}

      {activeTab === 'documents' && (
        <div>
          <h2 className="text-[11px] uppercase tracking-wider mb-4 text-gray-600">
            Historia dokumentów
          </h2>

          {invoices.length === 0 ? (
            <p className="text-[13px] text-gray-600">Brak dokumentów</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {[...invoices]
                .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                .map(inv => {
                  const net = inv.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
                  const gross = net * (1 + inv.vatRate / 100);
                  
                  return (
                    <div key={inv.id} className="border border-gray-300 p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={`inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wide font-semibold rounded mr-2 ${
                            inv.documentType === 'vat' ? 'bg-black text-white' : 'bg-gray-300 text-black'
                          }`}>
                            {inv.documentType === 'proforma' ? 'PRO' : 'VAT'}
                          </span>
                          <span className="text-[13px] font-bold">{inv.invoiceNumber}</span>
                        </div>
                        <span className="text-[13px] font-bold">{formatNumber(gross)} PLN</span>
                      </div>
                      <div className="text-[11px] text-gray-600">{inv.buyer.name}</div>
                      <div className="text-[11px] text-gray-600">{inv.issueDate}</div>
                      
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <button 
                          onClick={() => setPreviewInvoice(inv)} 
                          className="text-[10px] text-blue-600 hover:underline"
                        >
                          Podgląd
                        </button>
                        {inv.documentType === 'proforma' && (
                          <button 
                            onClick={() => handleConvertToVAT(inv)} 
                            className="text-[10px] text-green-600 hover:underline"
                          >
                            → VAT
                          </button>
                        )}
                        {inv.documentType === 'vat' && (
                          <button 
                            onClick={() => downloadKSeFXML(inv)} 
                            className="text-[10px] text-purple-600 hover:underline"
                          >
                            XML
                          </button>
                        )}
                        <button 
                          onClick={() => inv.id && handleDeleteInvoice(inv.id)} 
                          className="text-[10px] text-red-600 hover:underline"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <Modal
            isOpen={!!previewInvoice}
            onClose={() => setPreviewInvoice(null)}
            title="PODGLĄD DOKUMENTU"
            maxWidth="max-w-4xl"
            footer={
              <>
                <Button variant="outline" onClick={() => setPreviewInvoice(null)}>ZAMKNIJ</Button>
                <Button onClick={() => window.print()}>DRUKUJ</Button>
              </>
            }
          >
            {previewInvoice && <InvoicePreview invoice={previewInvoice} />}
          </Modal>
        </div>
      )}

      {activeTab === 'ksef' && (
        <div>
          <h2 className="text-[11px] uppercase tracking-wider mb-4 text-gray-600">
            Krajowy System e-Faktur
          </h2>
          <KSeFPanel />
        </div>
      )}
    </div>
  );
};
