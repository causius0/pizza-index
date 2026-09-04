// FX reference: ECB euro reference rates, 3 Sep 2026 (EUR base) + indicative crosses.
// Units: foreign currency per 1 EUR.

export interface FxEntry {
  perEur: number;
  src: string;
}

export const FX_DATE = '2026-09-03';

export const FX: Record<string, FxEntry> = {
  EUR: { perEur: 1, src: 'base' },
  GBP: { perEur: 0.86055, src: 'ECB 2026-09-03' },
  USD: { perEur: 1.1615, src: 'ECB 2026-09-03' },
  CAD: { perEur: 1.6, src: 'indicative (EURUSD 1.1615 x USDCAD ~1.38)' },
  BRL: { perEur: 6.3, src: 'indicative (EURUSD 1.1615 x USDBRL ~5.45)' },
  COP: { perEur: 4590, src: 'indicative (EURUSD 1.1615 x USDCOP ~3950)' },
  CLP: { perEur: 1103, src: 'indicative (EURUSD 1.1615 x USDCLP ~950)' },
  ARS: { perEur: 1568, src: 'indicative (EURUSD 1.1615 x USDARS ~1350)' },
  CNY: { perEur: 7.85, src: 'indicative' },
  AED: { perEur: 4.266, src: 'indicative (EURUSD 1.1615 x 3.6725 peg)' },
  QAR: { perEur: 4.228, src: 'indicative (EURUSD 1.1615 x 3.64 peg)' },
  RUB: { perEur: 97.44, src: 'CBR official 25 Aug 2026 (ECB suspended RUB)' },
};

export const USD_PER_EUR = FX['USD'].perEur;
