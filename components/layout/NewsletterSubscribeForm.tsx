'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { submitNewsletterSubscription } from '@/lib/cms'
import type { Locale } from '@/types'
import type { ResolvedSiteSettings } from '@/lib/siteSettings'

interface Props {
  locale: Locale
  footer?: ResolvedSiteSettings['footer']
}

export default function NewsletterSubscribeForm({ locale, footer }: Props) {
  const isRTL = locale === 'ar'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const placeholder = footer?.newsletterPlaceholder ?? (isRTL ? 'بريدك الإلكتروني' : 'Your email')
  const buttonLabel = footer?.newsletterButton ?? (isRTL ? 'اشترك' : 'Subscribe')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address')
      return
    }

    setLoading(true)

    const result = await submitNewsletterSubscription({ locale, email: trimmed })

    setLoading(false)

    if (!result.ok) {
      const emailError = result.error.errors?.email?.[0]
      if (emailError) {
        setError(
          emailError.includes('unique') || emailError.includes('already')
            ? (isRTL ? 'هذا البريد مسجّل مسبقًا في النشرة.' : 'This email is already subscribed.')
            : emailError,
        )
      } else {
        setError(
          isRTL
            ? 'تعذّر الاشتراك. يرجى المحاولة مرة أخرى.'
            : result.error.message || 'Could not subscribe. Please try again.',
        )
      }
      return
    }

    setSubmitted(true)
    setEmail('')
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-300 w-full sm:w-auto">
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span>
          {isRTL
            ? 'تم الاشتراك بنجاح. شكرًا لك!'
            : 'Successfully subscribed. Thank you!'}
        </span>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-2 w-full sm:w-auto" onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2 w-full sm:w-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError('')
          }}
          placeholder={placeholder}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-secondary-400 w-full sm:w-64"
          aria-label={placeholder}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg text-sm font-medium transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (isRTL ? 'جارٍ...' : 'Sending...') : buttonLabel}
        </button>
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </form>
  )
}
