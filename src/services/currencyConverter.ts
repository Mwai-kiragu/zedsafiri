// East African Currency Converter Service for Display Purposes
// All transactions remain in TZS for LATRA compliance

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate from TZS to this currency
}

export const supportedCurrencies: CurrencyRate[] = [
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', rate: 1 }, // Base currency
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 0.18 }, // 1 TZS = 0.18 KES
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', rate: 1.55 }, // 1 TZS = 1.55 UGX
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', rate: 0.54 }, // 1 TZS = 0.54 RWF
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', rate: 1.20 }, // 1 TZS = 1.20 BIF
  { code: 'SSP', name: 'South Sudanese Pound', symbol: 'SS£', rate: 0.0007 }, // 1 TZS = 0.0007 SSP
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
    
    if (currency === 'TZS' || currency === 'UGX' || currency === 'RWF' || currency === 'BIF') {
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