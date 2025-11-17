# 🚀 Szybki Start - System Faktur

## ⚡ 3 kroki do uruchomienia

### 1️⃣ Zainstaluj
```bash
cd invoice-system
npm install
```

### 2️⃣ Uruchom
```bash
npm run dev
```

### 3️⃣ Otwórz
```
http://localhost:5173
```

## 📊 Przykładowe dane (opcjonalnie)

1. Naciśnij **F12** w przeglądarce
2. Skopiuj zawartość pliku `example-data.js` do konsoli
3. Wywołaj: `loadExampleData()`
4. Odśwież stronę: **F5**

## 🎯 Co możesz zrobić?

✅ **Twórz faktury VAT** - pełne dokumenty księgowe  
✅ **Twórz proformy** - oferty dla klientów  
✅ **Zarządzaj odbiorcami** - zapisuj dane kontrahentów  
✅ **Export KSeF XML** - dla faktur VAT (system KSeF)  
✅ **Drukuj** - optymalizowane pod A4  
✅ **Backup** - eksport/import JSON  

## 📁 Routing

- `/` - Tworzenie faktur
- `/manage` - Zarządzanie (odbiorcy + dokumenty)

## 🎨 Stack technologiczny

- **React 18** + **TypeScript**
- **Vite** (super szybki build)
- **Tailwind CSS** (Swiss Design)
- **Zustand** (state management)
- **React Router** (routing)
- **localStorage** (baza danych)

## 🔧 Konfiguracja

Edytuj dane sprzedawcy w:
```
src/components/invoices/InvoiceForm.tsx
```

Zmień:
```typescript
const DEFAULT_SELLER = {
  name: 'TWOJA FIRMA',
  address: 'Twój adres',
  city: '00-000 Miasto',
  nip: '1234567890'
};
```

## 📦 Build produkcyjny

```bash
npm run build
```

Zbudowana aplikacja w folderze `dist/`

## 📚 Pełna dokumentacja

Sprawdź `INSTRUKCJA.md` dla szczegółów!

---

**Gotowe!** Zacznij tworzyć faktury 🎉
