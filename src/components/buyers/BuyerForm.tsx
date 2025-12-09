import React, { useState, useEffect, useRef } from 'react';
import type { Buyer } from '../../types/invoice';
import { Input } from '../ui/Input';
import { BuyerSearch } from './BuyerSearch';
import { validateNIP, validatePostalCode } from '../../utils/validation';

interface BuyerFormProps {
  initialData?: Buyer;
  onSubmit: (data: Buyer) => void;
  submitLabel?: string;
  showSubmitButton?: boolean;
  showSearch?: boolean;
  onChange?: (data: Buyer) => void;
}

export const BuyerForm: React.FC<BuyerFormProps> = ({ 
  initialData, 
  onSubmit,
  submitLabel = 'ZAPISZ',
  showSubmitButton = true,
  showSearch = true,
  onChange
}) => {
  const [formData, setFormData] = useState<Buyer>(
    initialData || {
      name: '',
      nip: '',
      address: '',
      city: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (onChange) {
      onChange(formData);
    }
  }, [formData]);

  const handleChange = (field: keyof Buyer, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBuyerSelect = (buyer: Buyer) => {
    setFormData({
      ...formData,
      name: buyer.name,
      nip: buyer.nip,
      address: buyer.address,
      city: buyer.city
    });
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa firmy jest wymagana';
    }

    if (!formData.nip.trim()) {
      newErrors.nip = 'NIP jest wymagany';
    } else if (!validateNIP(formData.nip)) {
      newErrors.nip = 'Nieprawidłowy NIP (wymagane 10 cyfr z poprawną sumą kontrolną)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Adres jest wymagany';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Miasto i kod pocztowy są wymagane';
    } else if (!validatePostalCode(formData.city)) {
      newErrors.city = 'Podaj kod pocztowy w formacie XX-XXX';
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
      {showSearch && <BuyerSearch onSelect={handleBuyerSelect} />}

      <div className={showSearch ? "border-t border-gray-300 pt-4 mt-4" : ""}>
        {showSearch && (
          <h3 className="text-[10px] uppercase tracking-wider mb-4 text-gray-600">
            Dane nabywcy
          </h3>
        )}

        <Input
          label="Nazwa firmy *"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="np. EXAMPLE SP. Z O.O."
        />
        {errors.name && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.name}</p>}

        <Input
          label="NIP *"
          value={formData.nip}
          onChange={(e) => handleChange('nip', e.target.value)}
          placeholder="np. 1234567890"
          maxLength={10}
        />
        {errors.nip && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.nip}</p>}

        <Input
          label="Ulica i numer *"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="np. ul. Testowa 1"
        />
        {errors.address && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.address}</p>}

        <Input
          label="Kod pocztowy i miasto *"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="np. 00-001 Warszawa"
        />
        {errors.city && <p className="text-red-600 text-xs -mt-3 mb-3">{errors.city}</p>}
      </div>

      {showSubmitButton && (
        <>
          <button
            type="submit"
            className="w-full px-6 py-3 text-[11px] uppercase tracking-wider font-medium bg-black text-white hover:bg-gray-800 transition-colors mt-6"
          >
            {submitLabel}
          </button>

          <p className="text-[10px] text-gray-500 mt-3 text-center">
            * Pola wymagane zgodnie z art. 106e ustawy o VAT
          </p>
        </>
      )}
    </form>
  );
};
