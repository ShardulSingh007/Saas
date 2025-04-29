import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the currency type
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// List of available currencies
export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'AED', symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
];

// Format a number as currency
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode);
  
  if (!currency) {
    return `$${amount.toFixed(2)}`; // Default to USD if currency not found
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currencies or browsers
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
}

// Define the context type
interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

// Create context with default values
const CurrencyContext = createContext<CurrencyContextType>({
  currency: currencies[0], // Default to USD
  setCurrency: () => {},
  formatAmount: (amount: number) => `$${amount.toFixed(2)}`,
});

// Provider component
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    // Try to get the currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency);
        return parsed;
      } catch (e) {
        return currencies[0]; // Default to USD if parsing fails
      }
    }
    return currencies[0]; // Default to USD
  });

  // Save to localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
  }, [currency]);

  // Format an amount using the current currency
  const formatAmount = (amount: number): string => {
    return formatCurrency(amount, currency.code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Hook for consuming the context
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}