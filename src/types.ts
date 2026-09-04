// Core domain types for the Margherita Pizza Index.

export type CertificationSource = 'AVPN' | 'EccellenzeItaliane' | 'OspitalitaItaliana' | 'Unverified';

export interface Certification {
  source: CertificationSource;
  /** AVPN member number, e.g. "459" */
  memberNumber?: string;
  /** Direct link to the certification page (member page or directory) */
  certUrl: string;
}

export interface Pizzeria {
  id: string;
  name: string;
  city: string;
  country: string; // ISO-3166 alpha-2
  website?: string;
  certification: Certification;
}

export type PriceConfidence = 'HIGH' | 'MED' | 'LOW';

export interface PriceObservation {
  pizzeriaId: string;
  /** Margherita price in local currency units */
  price: number;
  currency: string; // ISO-4217
  source: string; // URL or description of the menu
  observedAt: string; // YYYY-MM-DD
  confidence: PriceConfidence;
  note?: string;
  /** Include in the country average? false = listed but excluded */
  includeInAverage?: boolean;
}

export interface CountryIndex {
  country: string;
  currency: string;
  nCertified: number;
  nPriced: number;
  avgLocal: number | null;
  avgEur: number | null;
  impliedPpp: number | null;
  actualFx: number | null;
  overUnderPct: number | null;
}
