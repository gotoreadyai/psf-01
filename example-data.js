// PRZYKŁADOWE DANE DO TESTOWANIA SYSTEMU
// Otwórz konsolę przeglądarki (F12) i wklej ten kod aby załadować przykładowe dane

// Przykładowi odbiorcy
const exampleBuyers = [
    {
        id: "buyer_1",
        name: "Tech Solutions Sp. z o.o.",
        nip: "1234563218",
        address: "ul. Innowacyjna 15",
        city: "00-001 Warszawa",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "buyer_2",
        name: "Digital Marketing Agency",
        nip: "9876543210",
        address: "al. Biznesowa 42",
        city: "30-002 Kraków",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "buyer_3",
        name: "Creative Studio",
        nip: "5555555550",
        address: "ul. Artystyczna 7",
        city: "50-003 Wrocław",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Przykładowe dokumenty (faktury VAT + proformy)
const exampleInvoices = [
    // FAKTURA VAT
    {
        id: "invoice_1",
        documentType: "vat",
        invoiceNumber: "1/11/2025",
        issueDate: "01-11-2025",
        saleDate: "01-11-2025",
        paymentDue: "15-11-2025",
        issuePlace: "Warszawa",
        paymentMethod: "Przelew",
        vatRate: 23,
        seller: {
            name: "BLOCKBOX SP. Z O.O.",
            address: "Kolady 3",
            city: "02-691 Warszawa",
            nip: "7393864444"
        },
        buyer: exampleBuyers[0],
        items: [
            {
                name: "Usługi programistyczne",
                quantity: 40,
                unit: "godz.",
                unitPrice: 180.00
            },
            {
                name: "Konsultacje techniczne",
                quantity: 10,
                unit: "godz.",
                unitPrice: 200.00
            }
        ],
        paidAmount: 0,
        bankAccount: "mBank Retail 41 1140 2004 0000 3202 8296 2689",
        createdAt: new Date("2025-11-01").toISOString()
    },
    
    // PROFORMA
    {
        id: "invoice_2",
        documentType: "proforma",
        invoiceNumber: "PRO/1/11/2025",
        issueDate: "05-11-2025",
        saleDate: "05-11-2025",
        paymentDue: "19-11-2025",
        issuePlace: "Warszawa",
        paymentMethod: "Przelew",
        vatRate: 23,
        seller: {
            name: "BLOCKBOX SP. Z O.O.",
            address: "Kolady 3",
            city: "02-691 Warszawa",
            nip: "7393864444"
        },
        buyer: exampleBuyers[1],
        items: [
            {
                name: "Projekt aplikacji mobilnej - oferta",
                quantity: 1,
                unit: "szt.",
                unitPrice: 15000.00
            }
        ],
        paidAmount: 0,
        bankAccount: "mBank Retail 41 1140 2004 0000 3202 8296 2689",
        createdAt: new Date("2025-11-05").toISOString()
    },
    
    // FAKTURA VAT
    {
        id: "invoice_3",
        documentType: "vat",
        invoiceNumber: "2/11/2025",
        issueDate: "10-11-2025",
        saleDate: "10-11-2025",
        paymentDue: "24-11-2025",
        issuePlace: "Warszawa",
        paymentMethod: "Przelew",
        vatRate: 23,
        seller: {
            name: "BLOCKBOX SP. Z O.O.",
            address: "Kolady 3",
            city: "02-691 Warszawa",
            nip: "7393864444"
        },
        buyer: exampleBuyers[1],
        items: [
            {
                name: "Projekt strony internetowej",
                quantity: 1,
                unit: "szt.",
                unitPrice: 8000.00
            }
        ],
        paidAmount: 0,
        bankAccount: "mBank Retail 41 1140 2004 0000 3202 8296 2689",
        createdAt: new Date("2025-11-10").toISOString(),
        proformaReference: "PRO/1/11/2025"
    }
];

// Funkcja ładująca dane
function loadExampleData() {
    localStorage.setItem('invoice_buyers', JSON.stringify(exampleBuyers));
    localStorage.setItem('invoice_history', JSON.stringify(exampleInvoices));
    
    console.log('✅ Załadowano przykładowe dane!');
    console.log(`- ${exampleBuyers.length} odbiorców`);
    console.log(`- ${exampleInvoices.length} dokumentów (${exampleInvoices.filter(i => i.documentType === 'vat').length} faktur VAT, ${exampleInvoices.filter(i => i.documentType === 'proforma').length} proform)`);
    console.log('Odśwież stronę aby zobaczyć zmiany.');
}

// Funkcja czyszcząca dane
function clearAllData() {
    if (confirm('Czy na pewno chcesz usunąć wszystkie dane?')) {
        localStorage.removeItem('invoice_buyers');
        localStorage.removeItem('invoice_history');
        console.log('🗑️ Wyczyszczono wszystkie dane!');
        console.log('Odśwież stronę.');
    }
}

// Auto-load
console.log('=== FUNKCJE POMOCNICZE ===');
console.log('loadExampleData() - załaduj przykładowe dane');
console.log('clearAllData() - wyczyść wszystkie dane');
console.log('========================');

// Możesz wywołać automatycznie:
// loadExampleData();
