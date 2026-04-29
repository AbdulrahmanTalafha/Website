'use client'

import Link from 'next/link'
import { Palette } from 'lucide-react'

interface Props {
  darkHref: string
  lightHref: string
  classicHref: string
  current: 'dark' | 'light' | 'classic'
  isRTL: boolean
}

export default function DesignSwitcher({ darkHref, lightHref, classicHref, current, isRTL }: Props) {
  const variants = [
    { key: 'dark' as const,    href: darkHref,    dot: 'bg-primary-900 border-white/30',   label: isRTL ? 'داكن'   : 'Dark',    active: 'bg-primary-500' },
    { key: 'light' as const,   href: lightHref,   dot: 'bg-white border-neutral-300',      label: isRTL ? 'فاتح'   : 'Light',   active: 'bg-secondary-500' },
    { key: 'classic' as const, href: classicHref, dot: 'bg-neutral-200 border-neutral-400', label: isRTL ? 'كلاسيك' : 'Classic', active: 'bg-neutral-600' },
  ]

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-2">
      <div className="flex items-center gap-1.5 bg-black/70 text-white/50 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
        <Palette className="w-3 h-3" />
        {isRTL ? 'اختر التصميم' : 'Choose Design'}
      </div>
      <div className="flex rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/40 backdrop-blur-sm bg-black/60">
        {variants.map((v) => (
          <Link
            key={v.key}
            href={v.href}
            scroll={false}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-black transition-all border-s border-white/10 first:border-s-0 ${
              current === v.key
                ? `${v.active} text-white`
                : 'text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className={`w-3 h-3 rounded-full border ${v.dot}`} />
            {v.label}
            {current === v.key && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                {isRTL ? 'محدد' : 'Active'}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
