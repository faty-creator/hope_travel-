
export type Language = 'fr' | 'ar' | 'en';

export interface Trip {
  id: string;
  title: {
    fr: string;
    ar: string;
    en: string;
  };
  destination: string;
  duration?: {
    fr: string;
    ar: string;
    en: string;
  };
  duration_value?: number;
  price: number;
  price_currency?: 'MAD' | 'EUR' | 'USD';
  created_at?: string;
  image: string;
  description: {
    fr: string;
    ar: string;
    en: string;
  };
  program: {
    day: number;
    title: { fr: string; ar: string; en: string };
    desc: { fr: string; ar: string; en: string };
  }[];
  included: { fr: string; ar: string; en: string }[];
  not_included: { fr: string; ar: string; en: string }[];
  departure: string;
  departure_location: {
    fr: string;
    ar: string;
    en: string;
  };
  arrival_location: {
    fr: string;
    ar: string;
    en: string;
  };
  map_embed: string;
}

export interface Translation {
  [key: string]: {
    fr: string;
    ar: string;
    en: string;
  };
}
