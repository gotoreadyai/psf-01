import React from 'react';
import type { SellerData } from '../../types/seller';
import { SellerForm } from './SellerForm';

interface SellerSetupModalProps {
  isOpen: boolean;
  onComplete: (data: SellerData) => void;
}

export const SellerSetupModal: React.FC<SellerSetupModalProps> = ({ 
  isOpen, 
  onComplete 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto">
        <div className="border-b-3 border-black px-6 py-5">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            KONFIGURACJA DANYCH WYSTAWCY
          </h2>
          <p className="text-[13px] text-gray-600 mt-2">
            Przed rozpoczęciem pracy z systemem faktur uzupełnij dane swojej firmy.
            Te informacje będą widoczne na wszystkich wystawianych fakturach.
          </p>
        </div>
        
        <div className="px-6 py-5">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-[12px] text-yellow-800">
              <strong>Uwaga:</strong> Dane wystawcy są wymagane zgodnie z polskim prawem 
              (art. 106e ustawy o VAT). Bez ich uzupełnienia nie będzie możliwe wystawianie faktur.
            </p>
          </div>

          <SellerForm 
            onSubmit={onComplete}
            submitLabel="ZAPISZ I ROZPOCZNIJ PRACĘ"
          />
        </div>
      </div>
    </div>
  );
};
