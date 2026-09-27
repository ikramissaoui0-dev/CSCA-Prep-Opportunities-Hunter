// A curated, non-exhaustive list rather than the full ISO set (~200
// entries) — Morocco first as the default (Opportunities Hunter's home
// market), then the countries CSCA Prep's actual audience is most
// likely calling from: Francophone Africa, Europe, and a few common
// origins for students applying to Chinese universities. "Other" covers
// everything else with a free-text code instead of bloating this list.
export const PHONE_COUNTRY_CODES = [
  { code: "+212", country: "Morocco" },
  { code: "+213", country: "Algeria" },
  { code: "+216", country: "Tunisia" },
  { code: "+33", country: "France" },
  { code: "+32", country: "Belgium" },
  { code: "+34", country: "Spain" },
  { code: "+44", country: "United Kingdom" },
  { code: "+1", country: "United States / Canada" },
  { code: "+221", country: "Senegal" },
  { code: "+225", country: "Côte d'Ivoire" },
  { code: "+237", country: "Cameroon" },
  { code: "+223", country: "Mali" },
  { code: "+227", country: "Niger" },
  { code: "+226", country: "Burkina Faso" },
  { code: "+229", country: "Benin" },
  { code: "+228", country: "Togo" },
  { code: "+241", country: "Gabon" },
  { code: "+20", country: "Egypt" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+86", country: "China" },
] as const;

export const DEFAULT_PHONE_COUNTRY_CODE = "+212";
export const OTHER_PHONE_COUNTRY_VALUE = "other";
