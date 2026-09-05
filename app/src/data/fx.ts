// FX reference: ECB euro reference rates, 4 Sep 2026 (EUR base) + indicative crosses.
// Units: foreign currency per 1 EUR.

export interface FxEntry {
  perEur: number;
  src: string;
}

export const FX_DATE = '2026-09-04';

export const FX: Record<string, FxEntry> = {
  EUR: { perEur: 1, src: 'base' },
  GBP: { perEur: 0.85898, src: 'ECB 2026-09-04' },
  USD: { perEur: 1.1622, src: 'ECB 2026-09-04' },
  CAD: { perEur: 1.6038, src: 'ECB 2026-09-04' },
  BRL: { perEur: 5.9405, src: 'ECB 2026-09-04' },
  CNY: { perEur: 7.7994, src: 'ECB 2026-09-04' },
  SEK: { perEur: 11.1005, src: 'ECB 2026-09-04' },
  DKK: { perEur: 7.4747, src: 'ECB 2026-09-04' },
  PLN: { perEur: 4.3148, src: 'ECB 2026-09-04' },
  CZK: { perEur: 24.189, src: 'ECB 2026-09-04' },
  HUF: { perEur: 363.28, src: 'ECB 2026-09-04' },
  RON: { perEur: 5.2530, src: 'ECB 2026-09-04' },
  AUD: { perEur: 1.6134, src: 'ECB 2026-09-04' },
  NZD: { perEur: 1.9755, src: 'ECB 2026-09-04' },
  NOK: { perEur: 10.8035, src: 'ECB 2026-09-04' },
  CHF: { perEur: 0.9405, src: 'ECB 2026-09-04' },
  RSD: { perEur: 117.2, src: 'indicative (NBS ~117.2)' },
  TRY: { perEur: 56.2995, src: 'ECB 2026-09-04' },
  COP: { perEur: 4590, src: 'indicative (EURUSD 1.1622 x USDCOP ~3950)' },
  CLP: { perEur: 1103, src: 'indicative (EURUSD 1.1622 x USDCLP ~950)' },
  ARS: { perEur: 1568, src: 'indicative (EURUSD 1.1622 x USDARS ~1350)' },
  AED: { perEur: 4.268, src: 'indicative (EURUSD 1.1622 x 3.6725 peg)' },
  QAR: { perEur: 4.23, src: 'indicative (EURUSD 1.1622 x 3.64 peg)' },
  RUB: { perEur: 97.44, src: 'CBR official 25 Aug 2026 (ECB suspended RUB)' },
};

export const USD_PER_EUR = FX['USD'].perEur;
