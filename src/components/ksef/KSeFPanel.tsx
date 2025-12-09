import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '../../store/invoiceStore';
import { ksefService } from '../../services/ksefService';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import type { Invoice } from '../../types/invoice';
import { formatNumber } from '../../utils/formatting';
import { downloadKSeFXML } from '../../utils/exporter';

export const KSeFPanel: React.FC = () => {
  const { 
    invoices, 
    loadInvoices, 
    ksefConfig, 
    loadKSeFConfig, 
    saveKSeFConfig,
    updateInvoiceKSeF 
  } = useInvoiceStore();
  
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configForm, setConfigForm] = useState({
    environment: 'test' as 'test' | 'production',
    token: ''
  });
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
    loadKSeFConfig();
  }, [loadInvoices, loadKSeFConfig]);

  useEffect(() => {
    if (ksefConfig) {
      setConfigForm(ksefConfig);
      ksefService.configure(ksefConfig);
    }
  }, [ksefConfig]);

  const vatInvoices = invoices.filter(inv => inv.documentType === 'vat');

  const handleSaveConfig = () => {
    saveKSeFConfig(configForm);
    ksefService.configure(configForm);
    setIsConfigOpen(false);
  };

  const handleSendToKSeF = async (invoice: Invoice) => {
    if (!invoice.id) return;
    
    setSendingId(invoice.id);
    
    try {
      updateInvoiceKSeF(invoice.id, { status: 'pending' });
      
      const result = await ksefService.sendInvoice(invoice);
      
      if (result.success) {
        updateInvoiceKSeF(invoice.id, {
          status: 'sent',
          referenceNumber: result.referenceNumber,
          sentAt: new Date().toISOString()
        });
      } else {
        updateInvoiceKSeF(invoice.id, {
          status: 'error',
          errorMessage: result.errorMessage
        });
      }
    } catch (error) {
      updateInvoiceKSeF(invoice.id, {
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Nieznany błąd'
      });
    } finally {
      setSendingId(null);
    }
  };

  const handleCheckStatus = async (invoice: Invoice) => {
    if (!invoice.id || !invoice.ksef?.referenceNumber) return;
    
    setCheckingId(invoice.id);
    
    try {
      const result = await ksefService.checkStatus(invoice.ksef.referenceNumber);
      
      updateInvoiceKSeF(invoice.id, {
        status: result.status === 'accepted' ? 'accepted' : 
                result.status === 'rejected' ? 'rejected' : 'sent',
        ksefNumber: result.ksefNumber,
        upo: result.upo,
        errorMessage: result.errorMessage
      });
    } catch (error) {
      console.error('Error checking KSeF status:', error);
    } finally {
      setCheckingId(null);
    }
  };

  const getStatusBadge = (invoice: Invoice) => {
    if (!invoice.ksef) {
      return <span className="text-[10px] text-gray-500">Nie wysłana</span>;
    }

    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      error: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      pending: 'Oczekuje',
      sent: 'Wysłana',
      accepted: 'Zaakceptowana',
      rejected: 'Odrzucona',
      error: 'Błąd'
    };

    return (
      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wide rounded ${statusColors[invoice.ksef.status]}`}>
        {statusLabels[invoice.ksef.status]}
      </span>
    );
  };

  return (
    <div>
      {/* Config section */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[11px] uppercase tracking-wider font-medium mb-1">
              Konfiguracja KSeF
            </h3>
            <p className="text-[11px] text-gray-600">
              {ksefConfig ? (
                <>
                  Środowisko: <strong>{ksefConfig.environment === 'test' ? 'Testowe' : 'Produkcyjne'}</strong>
                  {' | '}
                  Token: <strong>****{ksefConfig.token.slice(-4)}</strong>
                </>
              ) : (
                'Nie skonfigurowano'
              )}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsConfigOpen(true)}>
            {ksefConfig ? 'ZMIEŃ' : 'KONFIGURUJ'}
          </Button>
        </div>
      </div>

      {/* Invoices list */}
      {vatInvoices.length === 0 ? (
        <p className="text-[13px] text-gray-600">Brak faktur VAT do wysłania</p>
      ) : (
        <div className="space-y-3">
          {vatInvoices.map(inv => {
            const net = inv.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
            const gross = net * (1 + inv.vatRate / 100);
            
            return (
              <div key={inv.id} className="border border-gray-300 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[13px] font-bold">{inv.invoiceNumber}</div>
                    <div className="text-[11px] text-gray-600">{inv.buyer.name}</div>
                    <div className="text-[11px] text-gray-600">{inv.issueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold">{formatNumber(gross)} PLN</div>
                    {getStatusBadge(inv)}
                  </div>
                </div>

                {inv.ksef?.ksefNumber && (
                  <div className="text-[11px] text-green-700 mb-2">
                    Nr KSeF: {inv.ksef.ksefNumber}
                  </div>
                )}

                {inv.ksef?.errorMessage && (
                  <div className="text-[11px] text-red-600 mb-2">
                    Błąd: {inv.ksef.errorMessage}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  {!inv.ksef || inv.ksef.status === 'error' ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleSendToKSeF(inv)}
                      disabled={!ksefConfig || sendingId === inv.id}
                    >
                      {sendingId === inv.id ? 'WYSYŁAM...' : 'WYŚLIJ DO KSEF'}
                    </Button>
                  ) : inv.ksef.status === 'sent' || inv.ksef.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCheckStatus(inv)}
                      disabled={checkingId === inv.id}
                    >
                      {checkingId === inv.id ? 'SPRAWDZAM...' : 'SPRAWDŹ STATUS'}
                    </Button>
                  ) : null}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadKSeFXML(inv)}
                  >
                    POBIERZ XML
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Config modal */}
      <Modal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title="Konfiguracja KSeF"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>ANULUJ</Button>
            <Button onClick={handleSaveConfig}>ZAPISZ</Button>
          </>
        }
      >
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-[12px] text-yellow-800">
            <strong>Uwaga:</strong> Do wysyłania faktur do KSeF potrzebny jest token autoryzacyjny.
            Token można wygenerować w systemie e-Urząd Skarbowy lub za pomocą certyfikatu kwalifikowanego.
          </p>
        </div>

        <Select
          label="Środowisko"
          value={configForm.environment}
          onChange={(e) => setConfigForm(prev => ({ 
            ...prev, 
            environment: e.target.value as 'test' | 'production' 
          }))}
        >
          <option value="test">Testowe (ksef-test.mf.gov.pl)</option>
          <option value="production">Produkcyjne (ksef.mf.gov.pl)</option>
        </Select>

        <Input
          label="Token autoryzacyjny"
          type="password"
          value={configForm.token}
          onChange={(e) => setConfigForm(prev => ({ ...prev, token: e.target.value }))}
          placeholder="Wklej token z e-Urzędu Skarbowego"
        />

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
          <p className="text-[12px] text-blue-800">
            <strong>💡 Tip:</strong> Zalecamy najpierw przetestować wysyłkę w środowisku testowym,
            aby upewnić się, że wszystko działa poprawnie.
          </p>
        </div>
      </Modal>
    </div>
  );
};
