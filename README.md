# System Fakturowania VAT - React TypeScript

Nowoczesny system faktur w Swiss Design zbudowany na React + TypeScript + Vite + Tailwind CSS + Zustand.

## 🚀 Funkcje

✅ **Faktury VAT i Proformy** - Tworzenie obu typów dokumentów  
✅ **Zarządzanie odbiorcami** - Baza kontrahentów w localStorage  
✅ **Export KSeF XML** - Generowanie plików FA(2) dla systemu KSeF  
✅ **Import/Export JSON** - Backup i przenoszenie danych  
✅ **Swiss Design** - Czysty, minimalistyczny interfejs  
✅ **Responsive** - Działa na desktop i mobile  
✅ **Print-friendly** - Optymalizowane style druku  

## 📦 Technologie

- **React 18** + **TypeScript**
- **Vite** - szybki build tool
- **Tailwind CSS** - utility-first styling
- **Zustand** - lekki state management
- **React Router** - routing
- **localStorage** - lokalna baza danych

## 🛠️ Instalacja

```bash
npm install
npm run dev
```

Otwórz http://localhost:5173

## 📂 Struktura projektu

```
src/
├── components/
│   ├── invoices/
│   │   ├── InvoiceForm.tsx      # Formularz tworzenia
│   │   └── InvoicePreview.tsx   # Podgląd faktury
│   ├── layout/
│   │   └── TopBar.tsx           # Górny pasek nawigacji
│   └── ui/
│       ├── Button.tsx           # Przycisk
│       ├── Input.tsx            # Input i Select
│       └── Modal.tsx            # Modal
├── pages/
│   ├── CreateInvoice.tsx        # Strona tworzenia
│   └── ManageInvoices.tsx       # Strona zarządzania
├── store/
│   └── invoiceStore.ts          # Zustand store
├── types/
│   └── invoice.ts               # TypeScript types
├── utils/
│   ├── calculations.ts          # Obliczenia VAT
│   ├── exporter.ts              # Export KSeF XML
│   ├── formatting.ts            # Formatowanie liczb/dat
│   └── storage.ts               # localStorage wrapper
├── App.tsx                      # Routing
└── main.tsx                     # Entry point
```

## 💾 Dane

Wszystkie dane są przechowywane w localStorage:
- `invoice_buyers` - kontrahenci
- `invoice_history` - faktury i proformy

## 🖨️ Drukowanie

Kliknij "DRUKUJ" w podglądzie dokumentu. Style print są zoptymalizowane pod A4.

## 📤 Export KSeF

Dla faktur VAT dostępny jest export do formatu XML FA(2) kompatybilnego z systemem KSeF (Krajowy System e-Faktur).

**UWAGA:** Proformy NIE mogą być wysłane do KSeF - są dokumentami informacyjnymi.

## 🎨 Design

Projekt używa **Swiss Design** principles:
- Helvetica Neue font
- Czarno-biała paleta
- Grid layout
- Minimalizm
- Czytelna typografia

## 📝 Licencja

MIT

---

**Wersja 2.0** - React TypeScript
# psf-01
