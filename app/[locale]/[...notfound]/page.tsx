import { notFound } from 'next/navigation'

/** Triggers `app/[locale]/not-found.tsx` for unknown paths under a locale (e.g. /en/test). */
export default function LocaleCatchAllPage() {
  notFound()
}
