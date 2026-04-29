'use client'
import { Link2, Check } from 'lucide-react'
import { useState } from 'react'

export default function CopyLinkButton({ url, labelAr, labelEn, isRTL }: {
  url: string; labelAr: string; labelEn: string; isRTL: boolean
}) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy}
      className="flex items-center gap-2 bg-neutral-100 text-neutral-700 text-xs font-bold px-4 py-2.5 rounded-2xl hover:bg-neutral-200 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link2 className="w-3.5 h-3.5" />}
      {copied ? (isRTL ? 'تم النسخ!' : 'Copied!') : (isRTL ? labelAr : labelEn)}
    </button>
  )
}
