import React, { useState } from 'react';
import type { KRSCompany } from '../../services/krsApi';
import { searchKRS, searchByNIP } from '../../services/krsApi';

interface CompanySearchProps {
  onSelect: (company: KRSCompany) => void;
}

export const CompanySearch: React.FC<CompanySearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KRSCompany[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (query.length < 3) {
      setError('Wpisz co najmniej 3 znaki');
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      // Check if query is NIP (10 digits)
      const cleanQuery = query.replace(/[^0-9]/g, '');
      if (cleanQuery.length === 10) {
        const result = await searchByNIP(cleanQuery);
        if (result) {
          setResults([result]);
          setShowResults(true);
        } else {
          setError('Nie znaleziono firmy o podanym NIP');
        }
      } else {
        // Search by name
        const searchResults = await searchKRS(query);
        setResults(searchResults);
        setShowResults(true);
        
        if (searchResults.length === 0) {
          setError('Nie znaleziono firm. Spróbuj innej frazy lub wpisz dane ręcznie.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd wyszukiwania');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectCompany = (company: KRSCompany) => {
    onSelect(company);
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div className="mb-4">
      <label className="block text-[10px] uppercase tracking-wide text-gray-600 mb-1">
        Wyszukaj w KRS
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-black text-[13px] focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Nazwa firmy lub NIP..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || query.length < 3}
          className="px-6 py-2 text-[11px] uppercase tracking-wider font-medium bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? 'SZUKAM...' : 'SZUKAJ'}
        </button>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-[12px] text-yellow-800">{error}</p>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="mt-2 border-2 border-black bg-white max-h-[300px] overflow-y-auto">
          <div className="p-2 bg-gray-100 border-b border-gray-300">
            <p className="text-[10px] uppercase tracking-wide text-gray-600">
              Znaleziono: {results.length}
            </p>
          </div>
          {results.map((company, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectCompany(company)}
              className="w-full text-left p-3 hover:bg-gray-100 border-b border-gray-200 transition-colors"
            >
              <div className="text-[13px] font-bold mb-1">{company.name}</div>
              <div className="text-[11px] text-gray-600">
                NIP: {company.nip}
                {company.krs && ` | KRS: ${company.krs}`}
                {company.regon && ` | REGON: ${company.regon}`}
              </div>
              <div className="text-[11px] text-gray-600 mt-1">
                {company.address}, {company.city}
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-gray-500 mt-2">
        💡 Możesz wyszukać po nazwie firmy lub numerze NIP. Lub wypełnij dane ręcznie poniżej.
      </p>
    </div>
  );
};