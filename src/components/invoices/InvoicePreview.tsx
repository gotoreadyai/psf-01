import React from 'react';
import type { Invoice } from '../../types/invoice';
import { formatNumber, numberToWords } from '../../utils/formatting';
import { calculateTotals } from '../../utils/calculations';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const { totalNet, totalVat, totalGross, remaining } = calculateTotals(invoice);
  const amountWords = numberToWords(Math.floor(totalGross));

  return (
    <div className={`relative min-h-screen bg-white ${invoice.documentType === 'proforma' ? 'proforma-document' : ''}`}>
      {/* Watermark for proforma */}
      {invoice.documentType === 'proforma' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-black/[0.03] -rotate-45 tracking-[20px] pointer-events-none select-none">
          PROFORMA
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b-3 border-black pb-4 mb-5">
          <h1 className="text-[28px] font-bold tracking-tighter py-6">
            {invoice.documentType === 'proforma' 
              ? `FAKTURA PRO FORMA nr ${invoice.invoiceNumber}`
              : `Faktura VAT nr ${invoice.invoiceNumber}`
            }
          </h1>
          
          {/* KSeF status badge */}
          {invoice.ksef && invoice.documentType === 'vat' && (
            <div className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider mb-4 ${
              invoice.ksef.status === 'accepted' ? 'bg-green-100 text-green-800' :
              invoice.ksef.status === 'sent' || invoice.ksef.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              invoice.ksef.status === 'rejected' || invoice.ksef.status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              KSeF: {invoice.ksef.status === 'accepted' ? 'Zaakceptowana' :
                     invoice.ksef.status === 'sent' ? 'Wysłana' :
                     invoice.ksef.status === 'pending' ? 'Oczekuje' :
                     invoice.ksef.status === 'rejected' ? 'Odrzucona' :
                     invoice.ksef.status === 'error' ? 'Błąd' : 'Nie wysłana'}
              {invoice.ksef.ksefNumber && ` | ${invoice.ksef.ksefNumber}`}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wide text-gray-600 font-medium">
                Data sprzedaży:
              </span>
              <span className="text-black">{invoice.saleDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wide text-gray-600 font-medium">
                Sposób zapłaty:
              </span>
              <span className="text-black">{invoice.paymentMethod}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wide text-gray-600 font-medium">
                Termin płatności:
              </span>
              <span className="text-black font-bold text-red-900">{invoice.paymentDue}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wide text-gray-600 font-medium">
                Data i miejsce wystawienia:
              </span>
              <span className="text-black">{invoice.issueDate}, {invoice.issuePlace}</span>
            </div>
          </div>
        </div>

        {/* Two columns - Seller & Buyer */}
        <div className="grid grid-cols-2 gap-5 pb-5 mb-5 border-b border-gray-300">
          <div>
            <h3 className="text-[10px] uppercase tracking-wider mb-2.5 text-gray-600 font-medium">
              Sprzedawca
            </h3>
            <div className="text-[13px] leading-relaxed">
              <div className="font-bold mb-1 text-[15px]">{invoice.seller.name}</div>
              <div>{invoice.seller.address}</div>
              <div>{invoice.seller.city}</div>
              <div className="mt-1 text-[11px] text-gray-600">NIP: {invoice.seller.nip}</div>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-wider mb-2.5 text-gray-600 font-medium">
              Nabywca
            </h3>
            <div className="text-[13px] leading-relaxed">
              <div className="font-bold mb-1 text-[15px]">{invoice.buyer.name}</div>
              <div>{invoice.buyer.address}</div>
              <div>{invoice.buyer.city}</div>
              <div className="mt-1 text-[11px] text-gray-600">NIP: {invoice.buyer.nip}</div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="my-6">
          <h3 className="text-[11px] uppercase tracking-wider mb-6 text-gray-600 font-medium">
            Pozycje {invoice.documentType === 'proforma' ? 'proformy' : 'faktury'}
          </h3>
          
          <table className="w-full border-collapse">
            <thead className="border-b-2 border-black">
              <tr>
                <th className="text-left py-3.5 text-[11px] uppercase tracking-wide font-medium w-[5%]">Lp.</th>
                <th className="text-left py-3.5 text-[11px] uppercase tracking-wide font-medium w-[45%]">Nazwa towaru lub usługi</th>
                <th className="text-left py-3.5 text-[11px] uppercase tracking-wide font-medium w-[7.5%]">Ilość</th>
                <th className="text-center py-3.5 text-[11px] uppercase tracking-wide font-medium w-[7.5%]">Jedn.</th>
                <th className="text-right py-3.5 text-[11px] uppercase tracking-wide font-medium w-[17.5%]">Cena jedn. netto</th>
                <th className="text-right py-3.5 text-[11px] uppercase tracking-wide font-medium w-[17.5%]">Wartość netto</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 text-[14px]">{index + 1}.</td>
                  <td className="py-4 text-[14px]">{item.name}</td>
                  <td className="py-4 text-[14px]">{item.quantity}</td>
                  <td className="py-4 text-[14px] text-center">{item.unit}</td>
                  <td className="py-4 text-[14px] text-right">{formatNumber(item.unitPrice)} PLN</td>
                  <td className="py-4 text-[14px] text-right">{formatNumber(item.quantity * item.unitPrice)} PLN</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="my-6">
          <h3 className="text-[11px] uppercase tracking-wider mb-6 text-gray-600 font-medium">
            Podsumowanie
          </h3>
          
          <table className="w-full border-collapse mb-8">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3.5 px-2 text-[11px] uppercase tracking-wide font-medium w-[50%]">Stawka VAT</th>
                <th className="text-left py-3.5 px-2 text-[11px] uppercase tracking-wide font-medium">Wartość netto</th>
                <th className="text-center py-3.5 px-2 text-[11px] uppercase tracking-wide font-medium">VAT</th>
                <th className="text-right py-3.5 px-2 text-[11px] uppercase tracking-wide font-medium">Wartość brutto</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3.5 px-2 text-[14px]">{invoice.vatRate}%</td>
                <td className="py-3.5 px-2 text-[14px]">{formatNumber(totalNet)} PLN</td>
                <td className="py-3.5 px-2 text-[14px] text-center">{formatNumber(totalVat)} PLN</td>
                <td className="py-3.5 px-2 text-[14px] text-right">{formatNumber(totalGross)} PLN</td>
              </tr>
              <tr className="border-t-2 border-b-2 border-black font-bold">
                <td className="py-3.5 px-2 text-[14px]">Razem:</td>
                <td className="py-3.5 px-2 text-[14px]">{formatNumber(totalNet)} PLN</td>
                <td className="py-3.5 px-2 text-[14px] text-center">{formatNumber(totalVat)} PLN</td>
                <td className="py-3.5 px-2 text-[14px] text-right text-red-900">{formatNumber(totalGross)} PLN</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Info box */}
        <div className="mt-10 p-8 bg-gray-100">
          <div className="mb-3.5">
            <p className="text-[11px] uppercase tracking-wide text-gray-600 font-medium mb-2">
              Pozostało do zapłaty:
            </p>
            <p className="text-[18px] font-bold text-red-900">{formatNumber(remaining)} PLN</p>
          </div>
          
          <div className="text-[14px] font-bold my-3.5 uppercase tracking-wide">
            Słownie: {amountWords}
          </div>

          <div className="mt-7 pt-7 border-t border-gray-300">
            <div className="text-[11px] uppercase tracking-wide text-gray-600 mb-2">
              Konto bankowe:
            </div>
            <div className="font-mono text-[14px] tracking-wider">
              {invoice.bankAccount}
            </div>
          </div>
          
          {invoice.documentType === 'proforma' && (
            <div className="mt-5 pt-5 border-t border-gray-300 text-[11px] text-gray-600">
              <strong>UWAGA:</strong> Dokument nie stanowi podstawy do odliczenia VAT. 
              Faktura pro forma jest dokumentem informacyjnym (ofertą).
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-7 pt-7 border-t border-gray-300 flex justify-between text-[11px] text-gray-600">
          <div>
            {invoice.documentType === 'proforma' 
              ? 'Proforma bez wartości księgowej'
              : 'Faktura bez podpisu odbiorcy'
            }
          </div>
          <div>Druk: System Faktur | strona 1 z 1</div>
        </div>
      </div>
    </div>
  );
};
