export interface CountryOption {
  code: string;
  nameEn: string;
  nameEs: string;
  locale: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: "AR", nameEn: "Argentina", nameEs: "Argentina", locale: "es-AR" },
  { code: "AU", nameEn: "Australia", nameEs: "Australia", locale: "en-AU" },
  { code: "AT", nameEn: "Austria", nameEs: "Austria", locale: "de-AT" },
  { code: "BE", nameEn: "Belgium", nameEs: "Bélgica", locale: "fr-BE" },
  { code: "BO", nameEn: "Bolivia", nameEs: "Bolivia", locale: "es-BO" },
  { code: "BR", nameEn: "Brazil", nameEs: "Brasil", locale: "pt-BR" },
  { code: "CA", nameEn: "Canada", nameEs: "Canadá", locale: "en-CA" },
  { code: "CL", nameEn: "Chile", nameEs: "Chile", locale: "es-CL" },
  { code: "CN", nameEn: "China", nameEs: "China", locale: "zh-CN" },
  { code: "CO", nameEn: "Colombia", nameEs: "Colombia", locale: "es-CO" },
  { code: "CR", nameEn: "Costa Rica", nameEs: "Costa Rica", locale: "es-CR" },
  { code: "CU", nameEn: "Cuba", nameEs: "Cuba", locale: "es-CU" },
  { code: "CZ", nameEn: "Czech Republic", nameEs: "República Checa", locale: "cs-CZ" },
  { code: "DK", nameEn: "Denmark", nameEs: "Dinamarca", locale: "da-DK" },
  { code: "DO", nameEn: "Dominican Republic", nameEs: "República Dominicana", locale: "es-DO" },
  { code: "EC", nameEn: "Ecuador", nameEs: "Ecuador", locale: "es-EC" },
  { code: "SV", nameEn: "El Salvador", nameEs: "El Salvador", locale: "es-SV" },
  { code: "FI", nameEn: "Finland", nameEs: "Finlandia", locale: "fi-FI" },
  { code: "FR", nameEn: "France", nameEs: "Francia", locale: "fr-FR" },
  { code: "DE", nameEn: "Germany", nameEs: "Alemania", locale: "de-DE" },
  { code: "GR", nameEn: "Greece", nameEs: "Grecia", locale: "el-GR" },
  { code: "GT", nameEn: "Guatemala", nameEs: "Guatemala", locale: "es-GT" },
  { code: "HN", nameEn: "Honduras", nameEs: "Honduras", locale: "es-HN" },
  { code: "IN", nameEn: "India", nameEs: "India", locale: "en-IN" },
  { code: "IE", nameEn: "Ireland", nameEs: "Irlanda", locale: "en-IE" },
  { code: "IL", nameEn: "Israel", nameEs: "Israel", locale: "he-IL" },
  { code: "IT", nameEn: "Italy", nameEs: "Italia", locale: "it-IT" },
  { code: "JP", nameEn: "Japan", nameEs: "Japón", locale: "ja-JP" },
  { code: "KR", nameEn: "South Korea", nameEs: "Corea del Sur", locale: "ko-KR" },
  { code: "MX", nameEn: "Mexico", nameEs: "México", locale: "es-MX" },
  { code: "NL", nameEn: "Netherlands", nameEs: "Países Bajos", locale: "nl-NL" },
  { code: "NZ", nameEn: "New Zealand", nameEs: "Nueva Zelanda", locale: "en-NZ" },
  { code: "NI", nameEn: "Nicaragua", nameEs: "Nicaragua", locale: "es-NI" },
  { code: "NO", nameEn: "Norway", nameEs: "Noruega", locale: "nb-NO" },
  { code: "PA", nameEn: "Panama", nameEs: "Panamá", locale: "es-PA" },
  { code: "PY", nameEn: "Paraguay", nameEs: "Paraguay", locale: "es-PY" },
  { code: "PE", nameEn: "Peru", nameEs: "Perú", locale: "es-PE" },
  { code: "PH", nameEn: "Philippines", nameEs: "Filipinas", locale: "en-PH" },
  { code: "PL", nameEn: "Poland", nameEs: "Polonia", locale: "pl-PL" },
  { code: "PT", nameEn: "Portugal", nameEs: "Portugal", locale: "pt-PT" },
  { code: "PR", nameEn: "Puerto Rico", nameEs: "Puerto Rico", locale: "es-PR" },
  { code: "RO", nameEn: "Romania", nameEs: "Rumanía", locale: "ro-RO" },
  { code: "SE", nameEn: "Sweden", nameEs: "Suecia", locale: "sv-SE" },
  { code: "CH", nameEn: "Switzerland", nameEs: "Suiza", locale: "de-CH" },
  { code: "GB", nameEn: "United Kingdom", nameEs: "Reino Unido", locale: "en-GB" },
  { code: "US", nameEn: "United States", nameEs: "Estados Unidos", locale: "en-US" },
  { code: "UY", nameEn: "Uruguay", nameEs: "Uruguay", locale: "es-UY" },
  { code: "VE", nameEn: "Venezuela", nameEs: "Venezuela", locale: "es-VE" },
  { code: "OT", nameEn: "Other", nameEs: "Otro", locale: "en" },
];

export function getCountryByCode(code: string): CountryOption | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function getCountryLocale(code: string, fallbackLocale: string): string {
  const country = getCountryByCode(code);

  if (country) {
    return country.locale;
  }

  return fallbackLocale === "es" ? "es" : "en";
}
