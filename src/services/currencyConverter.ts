// Currency Converter Service for Display Purposes
// All transactions remain in TZS for LATRA compliance

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate from TZS to this currency
}

export const supportedCurrencies: CurrencyRate[] = [
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TZS', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.00042 }, // ~2380 TZS = 1 USD
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.00038 }, // ~2630 TZS = 1 EUR  
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 0.054 }, // ~18.5 TZS = 1 KES
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.00033 }, // ~3030 TZS = 1 GBP
];

export class CurrencyConverter {
  private rates: Map<string, CurrencyRate>;

  constructor() {
    this.rates = new Map(supportedCurrencies.map(curr => [curr.code, curr]));
  }

  convert(amountInTZS: number, toCurrency: string): number {
    const rate = this.rates.get(toCurrency);
    if (!rate) {
      throw new Error(`Unsupported currency: ${toCurrency}`);
    }
    return amountInTZS * rate.rate;
  }

  formatAmount(amount: number, currency: string): string {
    const currencyInfo = this.rates.get(currency);
    if (!currencyInfo) return amount.toString();

    const rounded = Math.round(amount * 100) / 100;
    
    if (currency === 'TZS') {
      return `${currencyInfo.symbol} ${rounded.toLocaleString()}`;
    }
    
    return `${currencyInfo.symbol}${rounded.toFixed(2)}`;
  }

  getCurrencyInfo(code: string): CurrencyRate | undefined {
    return this.rates.get(code);
  }

  getAllCurrencies(): CurrencyRate[] {
    return supportedCurrencies;
  }
}

export const currencyConverter = new CurrencyConverter();