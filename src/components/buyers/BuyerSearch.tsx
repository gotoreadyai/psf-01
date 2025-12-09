import React, { useState, useEffect, useRef } from 'react';
import type { Buyer } from '../../types/invoice';
import { useInvoiceStore } from '../../store/invoiceStore';

interface BuyerSearchProps {
  onSelect: (buyer: Buyer) => void;
}

export const BuyerSearch: React.FC<BuyerSearchProps> = ({ onSelect }) => {
  const { searchBuyers, buyers } = useInvoiceStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Buyer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const found = searchBuyers(query);
      setResults(found);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, searchBuyers, buyers]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (buyer: Buyer) => {
    onSelect(buyer);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative mb-4">
      <label className="block text-[10px] uppercase tracking-wide text-gray-600 mb-1">
        Wyszukaj odbiorcę
      </label>
      
      <input
        type="text"
        className="w-full px-3 py-2 border border-black text-[13px] focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Nazwa firmy lub NIP..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowResults(true)}
      />

      {showResults && (
        <div className="absolute z-10 w-full mt-1 border-2 border-black bg-white max-h-[250px] overflow-y-auto shadow-lg">
          {results.length > 0 ? (
            <>
              <div className="p-2 bg-gray-100 border-b border-gray-300 sticky top-0">
                <p className="text-[10px] uppercase tracking-wide text-gray-600">
                  Znaleziono: {results.length}
                </p>
              </div>
              {results.map((buyer) => (
                <button
                  key={buyer.id}
                  type="button"
                  onClick={() => handleSelect(buyer)}
                  className="w-full text-left p-3 hover:bg-gray-100 border-b border-gray-200 transition-colors"
                >
                  <div className="text-[13px] font-bold mb-1">{buyer.name}</div>
                  <div className="text-[11px] text-gray-600">
                    NIP: {buyer.nip}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {buyer.address}, {buyer.city}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-3 text-[12px] text-gray-600">
              Nie znaleziono. Wypełnij dane ręcznie poniżej.
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-gray-500 mt-1">
        💡 Wpisz min. 2 znaki aby wyszukać w bazie odbiorców
      </p>
    </div>
  );
};
