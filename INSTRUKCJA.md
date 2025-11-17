# Instrukcja Instalacji i Użytkowania

## 📦 Instalacja

### 1. Rozpakuj ZIP
Rozpakuj plik `invoice-system.zip` do wybranego folderu.

### 2. Zainstaluj zależności
```bash
cd invoice-system
npm install
```

### 3. Uruchom aplikację
```bash
npm run dev
```

Aplikacja uruchomi się pod adresem: **http://localhost:5173**

### 4. (Opcjonalnie) Zbuduj produkcyjną wersję
```bash
npm run build
```

Zbudowana aplikacja znajdzie się w folderze `dist/`

## 🎯 Pierwsze kroki

### Załadowanie przykładowych danych

1. Otwórz aplikację w przeglądarce
2. Naciśnij **F12** aby otworzyć konsolę developerską
3. Wklej zawartość pliku `example-data.js` do konsoli
4. Wywołaj funkcję:
```javascript
loadExampleData()
```
5. Odśwież stronę (**F5**)

Teraz zobaczysz przykładowe faktury i odbiorców!

## 📋 Funkcje

### Tworzenie faktury (strona główna `/`)

1. **Wybierz typ dokumentu:**
   - Faktura VAT (dokument księgowy)
   - Proforma (oferta, nie wysyłana do KSeF)

2. **Wypełnij dane:**
   - Numer faktury (auto-generowany)
   - Daty (wystawienia, sprzedaży, płatności)
   - Miejsce wystawienia
   - Sposób płatności

3. **Wybierz/wpisz nabywcę:**
   - Wybierz z listy zapisanych odbiorców
   - Lub wpisz nowe dane

4. **Dodaj pozycje:**
   - Nazwa usługi/towaru
   - Ilość, jednostka, cena
   - Usuń/dodaj pozycje przyciskami

5. **Kliknij "WYSTAW I ZAPISZ"**

### Zarządzanie (`/manage`)

#### Zakładka ODBIORCY
- **Dodaj odbiorcy:** Przycisk "+ DODAJ"
- **Edytuj:** Kliknij ✏️ przy odbiorcy
- **Usuń:** Kliknij 🗑️ przy odbiorcy

#### Zakładka DOKUMENTY
- **Filtruj:** Wszystkie / Faktury VAT / Proformy
- **Podgląd:** Kliknij 👁️ aby zobaczyć dokument
- **Konwertuj:** Kliknij 📋→💰 aby przekształcić proformę w fakturę VAT
- **Usuń:** Kliknij 🗑️ aby usunąć dokument
- **Export/Import:** Przyciski do backup danych (JSON)

### Export KSeF XML

1. Otwórz dokument (tylko faktury VAT!)
2. Kliknij **"POBIERZ KSEF XML"**
3. Plik XML zostanie pobrany w formacie FA(2)
4. Gotowy do wysłania do systemu KSeF

**UWAGA:** Proformy NIE mogą być eksportowane do KSeF!

### Drukowanie

1. Otwórz podgląd dokumentu
2. Kliknij **"DRUKUJ"**
3. Style są zoptymalizowane pod A4

## 🔧 Konfiguracja

### Zmiana danych sprzedawcy

Edytuj w pliku `src/components/invoices/InvoiceForm.tsx`:

```typescript
const DEFAULT_SELLER = {
  name: 'TWOJA FIRMA SP. Z O.O.',
  address: 'Twoja ulica 1',
  city: '00-000 Miasto',
  nip: '1234567890'
};

const BANK_ACCOUNT = 'Twój numer konta';
```

### Zmiana stawki VAT

W pliku `src/components/invoices/InvoiceForm.tsx` zmień:
```typescript
vatRate: 23  // Na inną stawkę (np. 8, 0)
```

## 💾 Dane lokalne

Wszystkie dane są przechowywane w **localStorage** przeglądarki:
- `invoice_buyers` - lista odbiorców
- `invoice_history` - historia faktur

### Backup danych
1. Otwórz `/manage`
2. Zakładka "DOKUMENTY"
3. Kliknij **"EKSPORT"**
4. Zapisz plik JSON

### Przywracanie danych
1. Otwórz `/manage`
2. Zakładka "DOKUMENTY"  
3. Kliknij **"IMPORT"**
4. Wybierz plik JSON

### Czyszczenie danych
W konsoli przeglądarki (F12):
```javascript
clearAllData()
```

## 🎨 Dostosowanie wyglądu

Aplikacja używa **Tailwind CSS**. 

Style możesz dostosować w:
- `tailwind.config.js` - konfiguracja Tailwind
- `src/index.css` - globalne style + print styles
- Komponenty - inline Tailwind classes

## 📱 Responsive

Aplikacja jest responsywna i działa na:
- Desktop (pełna funkcjonalność)
- Tablet (2-kolumnowy layout zmienia się na 1-kolumnowy)
- Mobile (pionowy layout)

## 🐛 Rozwiązywanie problemów

### Aplikacja nie startuje
```bash
# Usuń node_modules i zainstaluj ponownie
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Błędy TypeScript
```bash
# Usuń cache i zbuduj ponownie
rm -rf node_modules/.vite
npm run build
```

### Dane się nie zapisują
- Sprawdź czy localStorage jest włączony w przeglądarce
- Sprawdź czy tryb prywatny/incognito nie blokuje localStorage
- Otwórz DevTools > Application > Local Storage

### Preview faktury nie wyświetla się
- Sprawdź konsolę (F12) na błędy
- Odśwież stronę (Ctrl+F5)

## 📚 Struktura projektu

```
invoice-system/
├── src/
│   ├── components/        # Komponenty React
│   │   ├── invoices/     # Komponenty faktur
│   │   ├── layout/       # Layout (TopBar)
│   │   └── ui/           # UI components (Button, Input, Modal)
│   ├── pages/            # Strony (Create, Manage)
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript types
│   ├── utils/            # Funkcje pomocnicze
│   ├── App.tsx           # Router
│   ├── main.tsx          # Entry point
│   └── index.css         # Style
├── public/               # Pliki statyczne
├── example-data.js       # Przykładowe dane
├── package.json          # Zależności
├── tailwind.config.js    # Konfiguracja Tailwind
└── README.md             # README

```

## 🚀 Deployment

### Hostowanie statyczne (Vercel, Netlify, GitHub Pages)

```bash
npm run build
# Upload folderu dist/ na hosting
```

### Konfiguracja dla React Router

Dodaj `_redirects` (Netlify) lub `vercel.json` (Vercel):

**_redirects (Netlify):**
```
/*    /index.html   200
```

**vercel.json (Vercel):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## 📞 Wsparcie

Jeśli masz pytania lub problemy:
1. Sprawdź ten dokument
2. Sprawdź konsolę przeglądarki (F12) na błędy
3. Sprawdź README.md w projekcie

---

**Wersja 2.0** - React + TypeScript + Vite + Tailwind + Zustand
