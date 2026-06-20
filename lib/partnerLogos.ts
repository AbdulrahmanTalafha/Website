/** Logo file keys — must match seeder assets and `public/partners/logos/` filenames. */
export const PARTNER_LOGO_KEYS = [
  'usaid',
  'european-union',
  'aecid',
  'international-republican-institute',
  'british-embassy-jordan',
  'mercy-corps-jordan',
  'swiss-embassy-jordan',
  'kafd',
  'irex',
] as const

export type PartnerLogoKey = typeof PARTNER_LOGO_KEYS[number]

export function partnerStaticLogo(
  logoKey: string,
  extension: 'png' | 'jpg' | 'jpeg' | 'svg' | 'webp' = 'png',
): string {
  return `/partners/logos/${logoKey}.${extension}`
}

export function staticPartnerLogoByNameEn(nameEn: string, partners: { name: { en: string }; logo: string }[]): string | undefined {
  return partners.find((partner) => partner.name.en === nameEn)?.logo
}
