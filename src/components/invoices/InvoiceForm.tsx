import React, { useState, useEffect, useMemo } from 'react';
import type { DocumentType, Invoice, InvoiceItem } from '../../types/invoice';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useInvoiceStore } from '../../store/invoiceStore';
import { getCurrentDate, dateToInput, inputToDate } from '../../utils/formatting';

interface InvoiceFormProps {
  onUpdate: (invoice: Invoice) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onUpdate }) => {
  const { 
    seller,
    buyers, 
    loadBuyers, 
    addInvoice, 
    getNextInvoiceNumber 
  } = useInvoiceStore();
  
  const [docType, setDocType] = useState<DocumentType>('vat');
  
  // Create initial form data based on seller
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

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

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

  const handleBuyerChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      buyer: { ...prev.buyer, [field]: value }
    }));
  };

  const handleSelectBuyer = (buyerId: string) => {
    if (!buyerId) return;
    const buyer = buyers.find(b => b.id === buyerId);
    if (buyer) {
      setFormData(prev => ({ ...prev, buyer }));
    }
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
    
    // Reset form with current seller data
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

  return (
    <div className="sticky top-5">
      <h2 className="text-[11px] uppercase tracking-wider mb-5 text-gray-600">Typ dokumentu</h2>
      
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

      <h2 className="text-[11px] uppercase tracking-wider mb-5 text-gray-600">
        Dane {docType === 'proforma' ? 'proformy' : 'faktury'}
      </h2>

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

      <h2 className="text-[11px] uppercase tracking-wider mb-5 mt-8 text-gray-600">Nabywca</h2>

      {buyers.length > 0 && (
        <Select label="Wybierz z listy" onChange={(e) => handleSelectBuyer(e.target.value)}>
          <option value="">-- Wybierz lub wpisz --</option>
          {buyers.map(b => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.nip})
            </option>
          ))}
        </Select>
      )}

      <Input
        label="Nazwa firmy"
        value={formData.buyer.name}
        onChange={(e) => handleBuyerChange('name', e.target.value)}
      />

      <Input
        label="NIP"
        value={formData.buyer.nip}
        onChange={(e) => handleBuyerChange('nip', e.target.value)}
      />

      <Input
        label="Ulica i nr"
        value={formData.buyer.address}
        onChange={(e) => handleBuyerChange('address', e.target.value)}
      />

      <Input
        label="Kod i miasto"
        value={formData.buyer.city}
        onChange={(e) => handleBuyerChange('city', e.target.value)}
      />

      <h2 className="text-[11px] uppercase tracking-wider mb-5 mt-8 text-gray-600">Pozycje</h2>

      <div className="space-y-4">
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-[2fr_1fr_0.7fr_1.2fr_40px] gap-2.5 items-end pb-4 border-b border-gray-300">
            <input
              className="px-3 py-2 border border-black text-[13px]"
              placeholder="Nazwa"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
            />
            <input
              className="px-3 py-2 border border-black text-[13px]"
              type="number"
              step="0.01"
              placeholder="Ilość"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
            />
            <input
              className="px-3 py-2 border border-black text-[13px]"
              placeholder="Jedn."
              value={item.unit}
              onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
            />
            <input
              className="px-3 py-2 border border-black text-[13px]"
              type="number"
              step="0.01"
              placeholder="Cena"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
            />
            <button
              onClick={() => removeItem(index)}
              className="text-lg hover:opacity-70"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-2.5" onClick={addItem}>
        + DODAJ POZYCJĘ
      </Button>

      <Button className="w-full mt-2.5" onClick={handleSave}>
        WYSTAW I ZAPISZ
      </Button>
    </div>
  );
};