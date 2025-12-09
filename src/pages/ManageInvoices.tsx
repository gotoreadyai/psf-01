import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { InvoicePreview } from '../components/invoices/InvoicePreview';
import { SellerForm } from '../components/seller/SellerForm';
import { useInvoiceStore } from '../store/invoiceStore';
import type { Buyer, Invoice } from '../types/invoice';
import type { SellerData } from '../types/seller';
import { formatNumber } from '../utils/formatting';
import { downloadKSeFXML } from '../utils/exporter';
import { BuyerForm } from '../components/buyers/ BuyerForm';

export const ManageInvoices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyers' | 'invoices'>('seller');
  
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-5">
      <TopBar title="ZARZĄDZANIE" linkTo="/" linkText="← POWRÓT" />
      
      <div className="border-b-2 border-black mb-8">
        <button
          className={`px-8 py-4 text-[11px] uppercase tracking-wider font-medium ${
            activeTab === 'seller' ? 'border-b-3 border-black -mb-[2px]' : ''
          }`}
          onClick={() => setActiveTab('seller')}
        >
          DANE FIRMY
        </button>
        <button
          className={`px-8 py-4 text-[11px] uppercase tracking-wider font-medium ${
            activeTab === 'buyers' ? 'border-b-3 border-black -mb-[2px]' : ''
          }`}
          onClick={() => setActiveTab('buyers')}
        >
          ODBIORCY
        </button>
        <button
          className={`px-8 py-4 text-[11px] uppercase tracking-wider font-medium ${
            activeTab === 'invoices' ? 'border-b-3 border-black -mb-[2px]' : ''
          }`}
          onClick={() => setActiveTab('invoices')}
        >
          DOKUMENTY
        </button>
      </div>
      
      {activeTab === 'seller' && <SellerTab />}
      {activeTab === 'buyers' && <BuyersTab />}
      {activeTab === 'invoices' && <InvoicesTab />}
    </div>
  );
};

const SellerTab: React.FC = () => {
  const { seller, loadSeller, saveSeller } = useInvoiceStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadSeller();
  }, [loadSeller]);

  const handleSave = (data: SellerData) => {
    saveSeller(data);
    setIsEditing(false);
    alert('Dane firmy zostały zaktualizowane');
  };

  if (!seller) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Brak danych wystawcy</p>
        <Button onClick={() => setIsEditing(true)}>DODAJ DANE FIRMY</Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2">
            EDYCJA DANYCH FIRMY
          </h2>
          <p className="text-[13px] text-gray-600">
            Dane wystawcy będą automatycznie umieszczane na wszystkich nowych fakturach.
          </p>
        </div>
        
        <SellerForm 
          initialData={seller}
          onSubmit={handleSave}
          submitLabel="ZAPISZ ZMIANY"
        />
        
        <Button 
          variant="outline" 
          className="w-full mt-3"
          onClick={() => setIsEditing(false)}
        >
          ANULUJ
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">
          DANE WYSTAWCY FAKTUR
        </h2>
        <Button onClick={() => setIsEditing(true)}>EDYTUJ</Button>
      </div>

      <div className="border-2 border-black p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
              Nazwa firmy
            </h3>
            <p className="text-[15px] font-bold">{seller.name}</p>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
              NIP
            </h3>
            <p className="text-[15px]">{seller.nip}</p>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
              Adres
            </h3>
            <p className="text-[15px]">{seller.address}</p>
            <p className="text-[15px]">{seller.city}</p>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
              Numer konta
            </h3>
            <p className="text-[13px] font-mono">{seller.bankAccount}</p>
          </div>

          {seller.email && (
            <div>
              <h3 className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
                Email
              </h3>
              <p className="text-[15px]">{seller.email}</p>
            </div>
          )}

          {seller.phone && (
            <div>
              <h3 className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
                Telefon
              </h3>
              <p className="text-[15px]">{seller.phone}</p>
            </div>
          )}

          {seller.website && (
            <div>
              <h3 className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
                Strona WWW
              </h3>
              <p className="text-[15px]">
                <a 
                  href={seller.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {seller.website}
                </a>
              </p>
            </div>
          )}
        </div>

        {seller.updatedAt && (
          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-[11px] text-gray-500">
              Ostatnia aktualizacja: {new Date(seller.updatedAt).toLocaleString('pl-PL')}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
        <p className="text-[12px] text-blue-800">
          <strong>Informacja:</strong> Dane wystawcy są automatycznie pobierane przy tworzeniu nowych faktur. 
          Zmiany nie wpłyną na faktury już wystawione.
        </p>
      </div>
    </div>
  );
};

const BuyersTab: React.FC = () => {
  const { buyers, loadBuyers, addBuyer, updateBuyer, deleteBuyer } = useInvoiceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  const openModal = (buyer?: Buyer) => {
    setEditingBuyer(buyer || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBuyer(null);
  };

  const handleSave = (buyerData: Buyer) => {
    if (editingBuyer?.id) {
      updateBuyer(editingBuyer.id, buyerData);
    } else {
      addBuyer(buyerData);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Usunąć odbiorcy?')) {
      deleteBuyer(id);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div className="flex-1" />
        <Button onClick={() => openModal()}>+ DODAJ</Button>
      </div>

      {buyers.length === 0 ? (
        <p>Brak odbiorców</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-black">
            <tr>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium">NAZWA</th>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium">NIP</th>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium">ADRES</th>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium w-[120px]">AKCJE</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map(b => (
              <tr key={b.id} className="border-b border-gray-300">
                <td className="py-4 text-[13px]"><strong>{b.name}</strong></td>
                <td className="py-4 text-[13px]">{b.nip}</td>
                <td className="py-4 text-[13px]">
                  {b.address}<br />
                  <small className="text-gray-600">{b.city}</small>
                </td>
                <td className="py-4 text-[13px]">
                  <button onClick={() => openModal(b)} className="text-lg p-1 hover:opacity-70" title="Edytuj">✏️</button>
                  <button onClick={() => b.id && handleDelete(b.id)} className="text-lg p-1 hover:opacity-70" title="Usuń">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBuyer ? 'EDYTUJ ODBIORCY' : 'DODAJ ODBIORCY'}
        footer={
          <Button variant="outline" onClick={closeModal}>ANULUJ</Button>
        }
      >
        <BuyerForm
          initialData={editingBuyer || undefined}
          onSubmit={handleSave}
          submitLabel={editingBuyer ? 'ZAPISZ ZMIANY' : 'DODAJ ODBIORCY'}
        />
      </Modal>
    </>
  );
};

const InvoicesTab: React.FC = () => {
  const { invoices, loadInvoices, deleteInvoice, addInvoice, currentFilter, setFilter, exportInvoices, importInvoices, getNextInvoiceNumber } = useInvoiceStore();
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredInvoices = invoices
    .filter(inv => currentFilter === 'all' || inv.documentType === currentFilter)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const handleExport = () => {
    const json = exportInvoices();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dokumenty_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        importInvoices(ev.target?.result as string);
        alert('Import OK');
      } catch {
        alert('Błąd importu');
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = (id: string) => {
    if (confirm('Usunąć dokument?')) {
      deleteInvoice(id);
    }
  };

  const handleConvertToVAT = (proforma: Invoice) => {
    if (!confirm('Czy chcesz utworzyć fakturę VAT na podstawie tej proformy?')) return;
    const vatInvoice: Invoice = {
      ...proforma,
      documentType: 'vat',
      invoiceNumber: getNextInvoiceNumber('vat'),
      proformaReference: proforma.invoiceNumber
    };
    addInvoice(vatInvoice);
    alert(`Utworzono fakturę VAT ${vatInvoice.invoiceNumber}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex gap-2.5 mb-5">
        <button
          className={`px-4 py-2 text-[10px] uppercase tracking-wider font-medium ${
            currentFilter === 'all' ? 'bg-black text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          WSZYSTKIE
        </button>
        <button
          className={`px-4 py-2 text-[10px] uppercase tracking-wider font-medium ${
            currentFilter === 'vat' ? 'bg-black text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('vat')}
        >
          FAKTURY VAT
        </button>
        <button
          className={`px-4 py-2 text-[10px] uppercase tracking-wider font-medium ${
            currentFilter === 'proforma' ? 'bg-black text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('proforma')}
        >
          PROFORMY
        </button>
      </div>

      <div className="flex justify-between items-center mb-5">
        <div className="flex-1" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>EKSPORT</Button>
          <Button variant="outline" onClick={() => document.getElementById('import-input')?.click()}>
            IMPORT
          </Button>
          <input
            id="import-input"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <p>Brak dokumentów</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-black">
            <tr>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium">TYP</th>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium">NUMER</th>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium">DATA</th>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium">NABYWCA</th>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium">KWOTA BRUTTO</th>
              <th className="text-left py-2.5 text-[10px] uppercase tracking-wider font-medium w-[200px]">AKCJE</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(inv => {
              let net = 0;
              inv.items.forEach(it => net += it.quantity * it.unitPrice);
              const gross = net * (1 + inv.vatRate / 100);
              const docType = inv.documentType || 'vat';

              return (
                <tr key={inv.id} className="border-b border-gray-300">
                  <td className="py-4 text-[13px]">
                    <span className={`inline-block px-2 py-1 text-[9px] uppercase tracking-wide font-semibold rounded ${
                      docType === 'vat' ? 'bg-black text-white' : 'bg-gray-300 text-black'
                    }`}>
                      {docType === 'proforma' ? 'PRO' : 'VAT'}
                    </span>
                  </td>
                  <td className="py-4 text-[13px]"><strong>{inv.invoiceNumber}</strong></td>
                  <td className="py-4 text-[13px]">{inv.issueDate}</td>
                  <td className="py-4 text-[13px]">
                    {inv.buyer.name}<br />
                    <small className="text-gray-600">NIP: {inv.buyer.nip}</small>
                  </td>
                  <td className="py-4 text-[13px]"><strong>{formatNumber(gross)} PLN</strong></td>
                  <td className="py-4 text-[13px] space-x-1">
                    <button onClick={() => setPreviewInvoice(inv)} className="text-lg hover:opacity-70" title="Podgląd">👁️</button>
                    {docType === 'proforma' && (
                      <button onClick={() => handleConvertToVAT(inv)} className="text-lg hover:opacity-70" title="Konwertuj na VAT">📋→💰</button>
                    )}
                    <button onClick={() => inv.id && handleDelete(inv.id)} className="text-lg hover:opacity-70" title="Usuń">🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={!!previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        title="PODGLĄD DOKUMENTU"
        maxWidth="max-w-4xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setPreviewInvoice(null)}>ZAMKNIJ</Button>
            {previewInvoice && previewInvoice.documentType === 'vat' && (
              <Button variant="outline" onClick={() => previewInvoice && downloadKSeFXML(previewInvoice)}>
                POBIERZ KSEF XML
              </Button>
            )}
            <Button onClick={handlePrint}>DRUKUJ</Button>
          </>
        }
      >
        {previewInvoice && <InvoicePreview invoice={previewInvoice} />}
      </Modal>
    </>
  );
};