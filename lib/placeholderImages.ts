/**
 * Reliable placeholder photos (picsum.photos is often unreachable).
 * Uses a fixed Unsplash set so the same seed always maps to the same image.
 */

const UNSPLASH_PHOTO_IDS = [
  '1522071820081-009f0129c71c',
  '1552664730-d307ca884978',
  '1517248135467-4c7edcad34c4',
  '1497366216548-37526070297c',
  '1486406146926-c627a92ad1ab',
  '1560472354-b33ff0c44a43',
  '1556761175-b413da4ef4ef',
  '1551434678-e076c223a692',
  '1460925895917-afdab827c52f',
  '1504384308090-c894fdcc538d',
  '1521737711864-e3b97375b587',
  '1542744173-8b7f938759b0',
  '1600880292203-757bb62b4baf',
  '1556761175-5973dc0f0e08',
  '1553877522-43269d4ea984',
  '1523241284936-9a0b74a0c9a5',
  '1573164713714-d95e436ab8d6',
  '1582213782179-e0d53f98f2ca',
]

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash
}

export function placeholderPhotoUrl(seed: string, width: number, height: number): string {
  const photoId = UNSPLASH_PHOTO_IDS[hashSeed(seed) % UNSPLASH_PHOTO_IDS.length]
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`
}

/** Rewrite legacy picsum.photos URLs stored in CMS seeds or static data. */
export function rewriteLegacyImageUrl(url: string): string {
  if (!url.includes('picsum.photos')) {
    return url
  }

  const seedMatch = url.match(/seed\/([^/]+)/)
  const seed = seedMatch?.[1] ?? 'werise'
  const dimMatch = url.match(/(\d+)\/(\d+)(?:\?|$)/)
  const width = dimMatch ? Number(dimMatch[1]) : 800
  const height = dimMatch ? Number(dimMatch[2]) : 500

  return placeholderPhotoUrl(seed, width, height)
}

export const PLACEHOLDER_HERO = placeholderPhotoUrl('werise-hero', 1400, 700)
export const PLACEHOLDER_MEDIA_HERO = placeholderPhotoUrl('werise-media-hero', 1400, 600)
