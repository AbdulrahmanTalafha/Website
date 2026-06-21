'use client'

import { useSearchParams } from 'next/navigation'
import type { Locale } from '@/types'
import SiteSearchResults from '@/components/search/SiteSearchResults'

interface Props {
  locale: Locale
}

export default function SearchPageClient({ locale }: Props) {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  return (
    <SiteSearchResults locale={locale} variant="page" initialQuery={q} />
  )
}
