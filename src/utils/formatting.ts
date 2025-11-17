// Format numbers with Polish notation
export function formatNumber(num: number): string {
  return num
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    .replace('.', ',');
}

// Convert number to Polish words (0-9999)
export function numberToWords(num: number): string {
  const thousands = Math.floor(num / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const tens = Math.floor((num % 100) / 10);
  const ones = num % 10;

  const parts: string[] = [];

  // Thousands
  if (thousands > 0) {
    const thousandWords = [
      '', 'tysiąc', 'dwa tysiące', 'trzy tysiące', 'cztery tysiące',
      'pięć tysięcy', 'sześć tysięcy', 'siedem tysięcy', 'osiem tysięcy', 'dziewięć tysięcy'
    ];
    parts.push(thousandWords[thousands]);
  }

  // Hundreds
  if (hundreds > 0) {
    const hundredWords = [
      '', 'sto', 'dwieście', 'trzysta', 'czterysta',
      'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'
    ];
    parts.push(hundredWords[hundreds]);
  }

  // Special case for 10–19
  if (tens === 1) {
    const teenWords = [
      'dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście',
      'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'
    ];
    parts.push(teenWords[ones]);
  } else {
    // Tens
    if (tens > 1) {
      const tensWords = [
        '', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści',
        'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt',
        'osiemdziesiąt', 'dziewięćdziesiąt'
      ];
      parts.push(tensWords[tens]);
    }

    // Ones
    if (ones > 0 || (thousands === 0 && hundreds === 0 && tens === 0)) {
      const onesWords = [
        'zero', 'jeden', 'dwa', 'trzy', 'cztery',
        'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'
      ];
      parts.push(onesWords[ones]);
    }
  }

  return parts.join(' ') + ' PLN';
}

// Date helpers
export function getCurrentDate(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

export function dateToInput(str: string): string {
  const m = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}

export function inputToDate(str: string): string {
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}

export function isoToDate(str: string): string {
  // przyjmuje "DD-MM-YYYY" lub "YYYY-MM-DD" i zwraca "YYYY-MM-DD"
  if (!str) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const m = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return str;
}
