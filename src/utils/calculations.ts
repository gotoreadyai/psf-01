import type { Invoice, InvoiceCalculations } from '../types/invoice';

export function calculateTotals(invoice: Invoice): InvoiceCalculations {
  let totalNet = 0;

  invoice.items.forEach(item => {
    totalNet += Number(item.quantity) * Number(item.unitPrice);
  });

  const vatRate = Number(invoice.vatRate) || 0;
  const totalVat = totalNet * (vatRate / 100);
  const totalGross = totalNet + totalVat;
  const paid = Number(invoice.paidAmount || 0);
  const remaining = totalGross - paid;

  return {
    totalNet,
    totalVat,
    totalGross,
    remaining
  };
}
