/**
 * Validates Polish NIP (tax identification number)
 * NIP should be 10 digits with valid checksum
 */
export function validateNIP(nip: string): boolean {
  const cleaned = nip.replace(/[^0-9]/g, '');
  
  if (cleaned.length !== 10) {
    return false;
  }

  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }

  const checksum = sum % 11;
  const lastDigit = parseInt(cleaned[9]);

  return checksum === lastDigit;
}

/**
 * Validates Polish bank account number (IBAN format)
 * Should be PL followed by 26 digits
 */
export function validateBankAccount(account: string): boolean {
  const cleaned = account.replace(/\s/g, '');
  
  // Check format: PL + 26 digits
  if (!/^PL\d{26}$/.test(cleaned)) {
    return false;
  }

  // IBAN checksum validation
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (char) => 
    String(char.charCodeAt(0) - 55)
  );

  let remainder = numeric;
  while (remainder.length > 2) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97) + remainder.slice(9);
  }

  return parseInt(remainder, 10) % 97 === 1;
}

/**
 * Validates Polish postal code format
 */
export function validatePostalCode(city: string): boolean {
  return /\b\d{2}-\d{3}\b/.test(city);
}

/**
 * Formats NIP for display (XXX-XXX-XX-XX or XXX-XX-XX-XXX)
 */
export function formatNIP(nip: string): string {
  const cleaned = nip.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
  }
  return nip;
}

/**
 * Formats bank account for display (PL XX XXXX XXXX XXXX XXXX XXXX XXXX)
 */
export function formatBankAccount(account: string): string {
  const cleaned = account.replace(/\s/g, '');
  if (/^PL\d{26}$/.test(cleaned)) {
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : account;
  }
  return account;
}
