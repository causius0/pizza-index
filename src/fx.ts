// FX reference: ECB euro reference rates, 3 Sep 2026 (EUR base) + market-indicative crosses.
// Units: foreign currency per 1 EUR. Indicative crosses are flagged and re-run on a
// single ECB date once all observations share a timestamp.
export interface FxEntry {
  perEur: number;
  source: string;
}

export const FX_DATE = '2026-09-03';

export const FX: Record<string, FxEntry> = {
  EUR: { perEur: 1, source: 'base' },
  GBP: { perEur: 0.86055, source: 'ECB 2026-09-03' },
  USD: { perEur: 1.1615, source: 'ECB 2026-09-03' },
  CAD: { perEur: 1.6, source: 'indicative (EURUSD 1.1615 x USDCAD ~1.38)' },
  BRL: { perEur: 6.3, source: 'indicative (EURUSD 1.1615 x USDBRL ~5.45)' },
  COP: { perEur: 4590, source: 'indicative (EURUSD 1.1615 x USDCOP ~3950)' },
  CLP: { perEur: 1103, source: 'indicative (EURUSD 1.1615 x USDCLP ~950)' },
  ARS: { perEur: 1568, source: 'indicative (EURUSD 1.1615 x USDARS ~1350)' },
  CNY: { perEur: 7.85, source: 'indicative' },
  AED: { perEur: 4.266, source: 'indicative (EURUSD 1.1615 x 3.6725 peg)' },
  QAR: { perEur: 4.228, source: 'indicative (EURUSD 1.1615 x 3.64 peg)' },
};
