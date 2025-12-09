import React, { useState } from 'react';
import type { SellerData } from '../../types/seller';
import { Input } from '../ui/Input';
import { validateNIP, validateBankAccount, validatePostalCode } from '../../utils/validation';

interface SellerFormProps {
  initialData?: SellerData;
  onSubmit: (data: SellerData) => void;
  submitLabel?: string;
}

export const SellerForm: React.FC<SellerFormProps> = ({ 
  initialData, 
  onSubmit,
  submitLabel = 'ZAPISZ'
}) => {
  const [formData, setFormData] = useState<SellerData>(
    initialData || {
      name: '',
      address: '',
      city: '',
      nip: '',
      bankAccount: '',
      email: '',
      phone: '',
      website: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof SellerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa firmy jest wymagana';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Adres jest wymagany';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Miasto i kod pocztowy są wymagane';
    } else if (!validatePostalCode(formData.city)) {
      newErrors.city = 'Podaj kod pocztowy w formacie XX-XXX';
    }

    if (!formData.nip.trim()) {
      newErrors.nip = 'NIP jest wymagany';
    } else if (!validateNIP(formData.nip)) {
      newErrors.nip = 'Nieprawidłowy NIP (wymagane 10 cyfr z poprawną sumą kontrolną)';
    }

    if (!formData.bankAccount.trim()) {
      newErrors.bankAccount = 'Numer konta jest wymagany';
    } else if (!validateBankAccount(formData.bankAccount)) {
      newErrors.bankAccount = 'Nieprawidłowy numer konta (wymagany format PL + 26 cyfr)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-[10px] uppercase tracking-wider mb-4 text-gray-600">
        Dane wystawcy
      </h3>

      <Input
        label="Nazwa firmy *"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="np. BLOCKBOX SP. Z O.O."
      />
      {errors.name && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.name}</p>}

      <Input
        label="Ulica i numer *"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        placeholder="np. Kolady 3"
      />
      {errors.address && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.address}</p>}

      <Input
        label="Kod pocztowy i miasto *"
        value={formData.city}
        onChange={(e) => handleChange('city', e.target.value)}
        placeholder="np. 02-691 Warszawa"
      />
      {errors.city && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.city}</p>}

      <Input
        label="NIP *"
        value={formData.nip}
        onChange={(e) => handleChange('nip', e.target.value)}
        placeholder="np. 7393864444"
        maxLength={10}
      />
      {errors.nip && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.nip}</p>}

      <Input
        label="Numer konta bankowego *"
        value={formData.bankAccount}
        onChange={(e) => handleChange('bankAccount', e.target.value)}
        placeholder="np. PL 41 1140 2004 0000 3202 8296 2689"
      />
      {errors.bankAccount && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.bankAccount}</p>}

      <div className="border-t border-gray-300 pt-4 mt-4">
        <h3 className="text-[10px] uppercase tracking-wider mb-4 text-gray-600">
          Dane opcjonalne
        </h3>

        <Input
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="np. kontakt@firma.pl"
        />

        <Input
          label="Telefon"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="np. +48 123 456 789"
        />

        <Input
          label="Strona WWW"
          type="url"
          value={formData.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="np. https://firma.pl"
        />
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 text-[11px] uppercase tracking-wider font-medium bg-black text-white hover:bg-gray-800 transition-colors mt-6"
      >
        {submitLabel}
      </button>

      <p className="text-[10px] text-gray-500 mt-3 text-center">
        * Pola wymagane zgodnie z art. 106e ustawy o VAT
      </p>
    </form>
  );
};
