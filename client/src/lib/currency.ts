// Country to currency mapping with flags and currency codes
export const countryCurrencyMap: Record<string, { 
  symbol: string; 
  code: string; 
  flag: string;
  name: string;
  locale: string;
}> = {
  us: { 
    symbol: "$", 
    code: "USD", 
    flag: "🇺🇸",
    name: "US Dollar",
    locale: "en-US"
  },
  ca: { 
    symbol: "CA$", 
    code: "CAD", 
    flag: "🇨🇦",
    name: "Canadian Dollar",
    locale: "en-CA"
  },
  uk: { 
    symbol: "£", 
    code: "GBP", 
    flag: "🇬🇧",
    name: "British Pound",
    locale: "en-GB"
  },
  au: { 
    symbol: "A$", 
    code: "AUD", 
    flag: "🇦🇺",
    name: "Australian Dollar",
    locale: "en-AU"
  },
  in: { 
    symbol: "₹", 
    code: "INR", 
    flag: "🇮🇳",
    name: "Indian Rupee",
    locale: "en-IN"
  },
  de: { 
    symbol: "€", 
    code: "EUR", 
    flag: "🇩🇪",
    name: "Euro",
    locale: "de-DE"
  },
  fr: { 
    symbol: "€", 
    code: "EUR", 
    flag: "🇫🇷",
    name: "Euro",
    locale: "fr-FR"
  },
  jp: { 
    symbol: "¥", 
    code: "JPY", 
    flag: "🇯🇵",
    name: "Japanese Yen",
    locale: "ja-JP"
  },
  cn: {
    symbol: "¥",
    code: "CNY",
    flag: "🇨🇳",
    name: "Chinese Yuan",
    locale: "zh-CN"
  },
  br: {
    symbol: "R$",
    code: "BRL",
    flag: "🇧🇷",
    name: "Brazilian Real",
    locale: "pt-BR"
  },
  ru: {
    symbol: "₽",
    code: "RUB",
    flag: "🇷🇺",
    name: "Russian Ruble",
    locale: "ru-RU"
  },
  za: {
    symbol: "R",
    code: "ZAR",
    flag: "🇿🇦",
    name: "South African Rand",
    locale: "en-ZA"
  },
  mx: {
    symbol: "MX$",
    code: "MXN",
    flag: "🇲🇽",
    name: "Mexican Peso",
    locale: "es-MX"
  },
  sg: {
    symbol: "S$",
    code: "SGD",
    flag: "🇸🇬",
    name: "Singapore Dollar",
    locale: "en-SG"
  },
  ae: {
    symbol: "د.إ",
    code: "AED",
    flag: "🇦🇪",
    name: "UAE Dirham",
    locale: "ar-AE"
  },
  sa: {
    symbol: "﷼",
    code: "SAR",
    flag: "🇸🇦",
    name: "Saudi Riyal",
    locale: "ar-SA"
  },
  kr: {
    symbol: "₩",
    code: "KRW",
    flag: "🇰🇷",
    name: "South Korean Won",
    locale: "ko-KR"
  },
  nz: {
    symbol: "NZ$",
    code: "NZD",
    flag: "🇳🇿",
    name: "New Zealand Dollar",
    locale: "en-NZ"
  },
  ch: {
    symbol: "CHF",
    code: "CHF",
    flag: "🇨🇭",
    name: "Swiss Franc",
    locale: "de-CH"
  },
  se: {
    symbol: "kr",
    code: "SEK",
    flag: "🇸🇪",
    name: "Swedish Krona",
    locale: "sv-SE"
  },
  no: {
    symbol: "kr",
    code: "NOK",
    flag: "🇳🇴",
    name: "Norwegian Krone",
    locale: "nb-NO"
  },
  dk: {
    symbol: "kr",
    code: "DKK",
    flag: "🇩🇰",
    name: "Danish Krone",
    locale: "da-DK"
  },
  pl: {
    symbol: "zł",
    code: "PLN",
    flag: "🇵🇱",
    name: "Polish Złoty",
    locale: "pl-PL"
  },
  tr: {
    symbol: "₺",
    code: "TRY",
    flag: "🇹🇷",
    name: "Turkish Lira",
    locale: "tr-TR"
  },
  id: {
    symbol: "Rp",
    code: "IDR",
    flag: "🇮🇩",
    name: "Indonesian Rupiah",
    locale: "id-ID"
  },
  my: {
    symbol: "RM",
    code: "MYR",
    flag: "🇲🇾",
    name: "Malaysian Ringgit",
    locale: "ms-MY"
  },
  th: {
    symbol: "฿",
    code: "THB",
    flag: "🇹🇭",
    name: "Thai Baht",
    locale: "th-TH"
  },
  vn: {
    symbol: "₫",
    code: "VND",
    flag: "🇻🇳",
    name: "Vietnamese Dong",
    locale: "vi-VN"
  },
  ph: {
    symbol: "₱",
    code: "PHP",
    flag: "🇵🇭",
    name: "Philippine Peso",
    locale: "en-PH"
  },
  hk: {
    symbol: "HK$",
    code: "HKD",
    flag: "🇭🇰",
    name: "Hong Kong Dollar",
    locale: "zh-HK"
  },
  tw: {
    symbol: "NT$",
    code: "TWD",
    flag: "🇹🇼",
    name: "New Taiwan Dollar",
    locale: "zh-TW"
  }
};

// Currency formatting options
export const currencyFormats: Record<string, { locale: string; currency: string }> = {
  us: { locale: "en-US", currency: "USD" },
  ca: { locale: "en-CA", currency: "CAD" },
  uk: { locale: "en-GB", currency: "GBP" },
  au: { locale: "en-AU", currency: "AUD" },
  in: { locale: "en-IN", currency: "INR" },
  de: { locale: "de-DE", currency: "EUR" },
  fr: { locale: "fr-FR", currency: "EUR" },
  jp: { locale: "ja-JP", currency: "JPY" },
};

// Get currency info for a country
export function getCurrencyInfo(country: string) {
  return countryCurrencyMap[country.toLowerCase()] || countryCurrencyMap["us"];
}

// Format currency with country-specific settings
export function formatCurrency(amount: number, country: string): string {
  const { locale, code } = getCurrencyInfo(country);
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format currency with symbol and code
export function formatCurrencyWithSymbol(amount: number, country: string): string {
  const { symbol, code, flag } = getCurrencyInfo(country);
  return `${flag} ${symbol}${amount.toFixed(2)} ${code}`;
} 