export interface KRSCompany {
    name: string;
    nip: string;
    regon?: string;
    krs?: string;
    address: string;
    city: string;
    postalCode?: string;
    province?: string;
  }
  
  /**
   * Search for companies in KRS registry
   * Note: This uses the official KRS search page which may change its structure
   */
  export async function searchKRS(query: string): Promise<KRSCompany[]> {
    try {
      // KRS wyszukiwarka endpoint
      const searchUrl = `https://wyszukiwarka-krs.ms.gov.pl/`;
      
      // For now, we'll return mock data since scraping would require CORS proxy
      // In production, you'd need a backend proxy or CORS-enabled service
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for demonstration
      const mockResults: KRSCompany[] = [
        {
          name: query.toUpperCase() + ' SP. Z O.O.',
          nip: '1234567890',
          regon: '123456789',
          krs: '0000123456',
          address: 'ul. Testowa 1',
          city: '00-001 Warszawa',
          postalCode: '00-001',
          province: 'mazowieckie'
        }
      ];
      
      // Filter mock results based on query
      if (query.length < 3) {
        return [];
      }
      
      return mockResults;
    } catch (error) {
      console.error('KRS search error:', error);
      throw new Error('Błąd podczas wyszukiwania w KRS');
    }
  }
  
  /**
   * Get company details by KRS number
   */
  export async function getKRSDetails(krsNumber: string): Promise<KRSCompany | null> {
    try {
      // API endpoint for KRS data
      const apiUrl = `https://api-krs.ms.gov.pl/api/krs/odpisaktualny/${krsNumber}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Nie znaleziono firmy w KRS');
      }
      
      const data = await response.json();
      
      // Parse the KRS JSON response
      return parseKRSResponse(data);
    } catch (error) {
      console.error('KRS details error:', error);
      return null;
    }
  }
  
  /**
   * Parse KRS API response to our format
   */
  function parseKRSResponse(data: any): KRSCompany | null {
    try {
      const odpis = data.odpis;
      const dane = odpis?.dane;
      const dzial1 = dane?.dzial1;
      const danePodmiotu = dzial1?.danePodmiotu;
      const siedzibaIAdres = danePodmiotu?.siedzibaIAdres;
      
      return {
        name: danePodmiotu?.nazwa || '',
        nip: danePodmiotu?.identyfikatory?.nip || '',
        regon: danePodmiotu?.identyfikatory?.regon || '',
        krs: odpis?.naglowekA?.numerKRS || '',
        address: `${siedzibaIAdres?.ulica || ''} ${siedzibaIAdres?.nrDomu || ''}${siedzibaIAdres?.nrLokalu ? '/' + siedzibaIAdres.nrLokalu : ''}`.trim(),
        city: `${siedzibaIAdres?.kodPocztowy || ''} ${siedzibaIAdres?.miejscowosc || ''}`.trim(),
        postalCode: siedzibaIAdres?.kodPocztowy || '',
        province: siedzibaIAdres?.wojewodztwo || ''
      };
    } catch (error) {
      console.error('Error parsing KRS response:', error);
      return null;
    }
  }
  
  /**
   * Search by NIP - returns single result if found
   */
  export async function searchByNIP(nip: string): Promise<KRSCompany | null> {
    // Basic NIP validation (10 digits)
    const cleaned = nip.replace(/[^0-9]/g, '');
    if (cleaned.length !== 10) {
      throw new Error('Nieprawidłowy numer NIP');
    }
    
    // In real implementation, this would query KRS by NIP
    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      name: 'FIRMA TESTOWA SP. Z O.O.',
      nip: nip,
      regon: '123456789',
      krs: '0000123456',
      address: 'ul. Testowa 1',
      city: '00-001 Warszawa',
      postalCode: '00-001',
      province: 'mazowieckie'
    };
  }