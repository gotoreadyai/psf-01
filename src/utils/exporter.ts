import type { Invoice } from '../types/invoice';
import { isoToDate } from './formatting';

const escapeXml = (s: string | undefined): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const dec = (n: number): string => {
  const x = typeof n === 'number' ? n : Number(String(n).replace(',', '.'));
  return isFinite(x) ? x.toFixed(2) : '0.00';
};

function computeTotals(invoice: Invoice) {
  let totalNet = 0;
  for (const it of invoice.items || []) {
    totalNet += Number(it.quantity) * Number(it.unitPrice);
  }
  const totalVat = totalNet * (Number(invoice.vatRate) / 100);
  const totalGross = totalNet + totalVat;
  return { totalNet, totalVat, totalGross };
}

export function buildKSeFXML(invoice: Invoice): string {
  const { totalNet, totalVat, totalGross } = computeTotals(invoice);

  const NS = 'xmlns:tns="http://crd.gov.pl/wzor/2021/11/29/11089/"';
  const seller = invoice.seller;
  const buyer = invoice.buyer;
  const currency = 'PLN';

  const linesXml = (invoice.items || [])
    .map((it, idx) => {
      const q = Number(it.quantity);
      const unitNet = Number(it.unitPrice);
      const lineNet = q * unitNet;
      const lineVat = lineNet * (Number(invoice.vatRate) / 100);
      const lineGross = lineNet + lineVat;

      return `
        <tns:Pozycja>
          <tns:Lp>${idx + 1}</tns:Lp>
          <tns:NazwaTowaruUslugi>${escapeXml(it.name)}</tns:NazwaTowaruUslugi>
          <tns:JednostkaMiary>${escapeXml(it.unit || 'szt')}</tns:JednostkaMiary>
          <tns:Ilosc>${dec(q)}</tns:Ilosc>
          <tns:CenaJednostkowaNetto>${dec(unitNet)}</tns:CenaJednostkowaNetto>
          <tns:StawkaVAT>${escapeXml(String(invoice.vatRate))}</tns:StawkaVAT>
          <tns:KwotaVAT>${dec(lineVat)}</tns:KwotaVAT>
          <tns:WartoscNetto>${dec(lineNet)}</tns:WartoscNetto>
          <tns:WartoscBrutto>${dec(lineGross)}</tns:WartoscBrutto>
        </tns:Pozycja>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<tns:Faktura ${NS}>
  <tns:Naglowek>
    <tns:KodWaluty>${currency}</tns:KodWaluty>
    <tns:NumerFaktury>${escapeXml(invoice.invoiceNumber)}</tns:NumerFaktury>
    <tns:DataWystawienia>${isoToDate(invoice.issueDate)}</tns:DataWystawienia>
    <tns:DataSprzedazy>${isoToDate(invoice.saleDate)}</tns:DataSprzedazy>
    ${invoice.issuePlace ? `<tns:MiejsceWystawienia>${escapeXml(invoice.issuePlace)}</tns:MiejsceWystawienia>` : ''}
    <tns:FormaPlatnosci>${escapeXml(invoice.paymentMethod || 'przelew')}</tns:FormaPlatnosci>
    ${invoice.paymentDue ? `<tns:TerminPlatnosci>${isoToDate(invoice.paymentDue)}</tns:TerminPlatnosci>` : ''}
  </tns:Naglowek>

  <tns:Podmiot1>
    <tns:DaneIdentyfikacyjne>
      <tns:NIP>${escapeXml(seller.nip || '')}</tns:NIP>
      <tns:PelnaNazwa>${escapeXml(seller.name || '')}</tns:PelnaNazwa>
    </tns:DaneIdentyfikacyjne>
    <tns:Adres>
      <tns:Ulica>${escapeXml(seller.address || '')}</tns:Ulica>
      <tns:KodPocztowy>${escapeXml((seller.city || '').match(/\b\d{2}-\d{3}\b/)?.[0] || '')}</tns:KodPocztowy>
      <tns:Miejscowosc>${escapeXml((seller.city || '').replace(/\b\d{2}-\d{3}\b/, '').trim())}</tns:Miejscowosc>
      <tns:Kraj>PL</tns:Kraj>
    </tns:Adres>
    ${invoice.bankAccount ? `<tns:RachunekBankowy>${escapeXml(invoice.bankAccount)}</tns:RachunekBankowy>` : ''}
  </tns:Podmiot1>

  <tns:Podmiot2>
    <tns:DaneIdentyfikacyjne>
      <tns:NIP>${escapeXml(buyer.nip || '')}</tns:NIP>
      <tns:PelnaNazwa>${escapeXml(buyer.name || '')}</tns:PelnaNazwa>
    </tns:DaneIdentyfikacyjne>
    <tns:Adres>
      <tns:Ulica>${escapeXml(buyer.address || '')}</tns:Ulica>
      <tns:KodPocztowy>${escapeXml((buyer.city || '').match(/\b\d{2}-\d{3}\b/)?.[0] || '')}</tns:KodPocztowy>
      <tns:Miejscowosc>${escapeXml((buyer.city || '').replace(/\b\d{2}-\d{3}\b/, '').trim())}</tns:Miejscowosc>
      <tns:Kraj>PL</tns:Kraj>
    </tns:Adres>
  </tns:Podmiot2>

  <tns:Fa>
    <tns:Pozycje>
      ${linesXml}
    </tns:Pozycje>

    <tns:StawkiPodsumowanie>
      <tns:Stawka>
        <tns:StawkaVAT>${escapeXml(String(invoice.vatRate))}</tns:StawkaVAT>
        <tns:WartoscNetto>${dec(totalNet)}</tns:WartoscNetto>
        <tns:KwotaVAT>${dec(totalVat)}</tns:KwotaVAT>
        <tns:WartoscBrutto>${dec(totalGross)}</tns:WartoscBrutto>
      </tns:Stawka>
    </tns:StawkiPodsumowanie>

    <tns:Podsumowanie>
      <tns:SumaNetto>${dec(totalNet)}</tns:SumaNetto>
      <tns:SumaVAT>${dec(totalVat)}</tns:SumaVAT>
      <tns:SumaBrutto>${dec(totalGross)}</tns:SumaBrutto>
      <tns:KwotaDoZaplaty>${dec(totalGross - Number(invoice.paidAmount || 0))}</tns:KwotaDoZaplaty>
    </tns:Podsumowanie>
  </tns:Fa>

  <tns:Stopka>
    <tns:InformacjeDodatkowe>Faktura bez podpisu odbiorcy</tns:InformacjeDodatkowe>
  </tns:Stopka>
</tns:Faktura>`;

  return xml.replace(/\n[ \t]+(\n|$)/g, '\n');
}

export function downloadKSeFXML(invoice: Invoice): void {
  if (invoice.documentType === 'proforma') {
    alert('UWAGA: Proforma nie jest dokumentem księgowym i NIE może być wysłana do KSeF. Konwertuj ją na fakturę VAT w panelu zarządzania.');
    return;
  }

  const xml = buildKSeFXML(invoice);
  const safeNo = String(invoice.invoiceNumber || 'brak').replace(/[^\w\-]+/g, '_');
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Faktura_FA2_${safeNo}.xml`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
