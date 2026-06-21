'use client'

import { useState } from 'react'
import { Send, CheckCircle, Copy, Check } from 'lucide-react'
import { submitJoinApplication } from '@/lib/cms'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
  formTitle?: string | null
  formDescription?: string | null
  interests: Record<string, string>
}

export default function JoinForm({ locale, formTitle, formDescription, interests }: Props) {
  const isRTL = locale === 'ar'

  const defaultInterests: Record<string, string> = isRTL
    ? {
        volunteer: 'التطوع',
        internship: 'تدريب',
        employment: 'توظيف',
        partnership: 'شراكة / تعاون',
      }
    : {
        volunteer: 'Volunteering',
        internship: 'Internship',
        employment: 'Employment',
        partnership: 'Partnership / Collaboration',
      }

  const interestOptions = Object.keys(interests).length > 0 ? interests : defaultInterests
  const firstInterest = Object.keys(interestOptions)[0] ?? 'volunteer'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interest: firstInterest,
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [refNum, setRefNum] = useState('')
  const [copied, setCopied] = useState(false)

  const title = formTitle?.trim() || (isRTL ? 'قدّم طلبك' : 'Submit Your Application')
  const description = formDescription?.trim() || (isRTL
    ? 'أخبرنا كيف ترغب في المشاركة. سيراجع فريقنا طلبك وسيتواصل معك.'
    : 'Tell us how you would like to contribute. Our team will review your application and contact you.')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = isRTL ? 'يرجى إدخال اسمك' : 'Please enter your name'
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address'
    }
    if (!form.phone.trim() || form.phone.trim().length < 7) {
      errs.phone = isRTL ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number'
    }
    if (!form.interest.trim()) {
      errs.interest = isRTL ? 'يرجى اختيار نوع المشاركة' : 'Please select an interest'
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      errs.message = isRTL ? 'يرجى كتابة رسالة (10 أحرف على الأقل)' : 'Please write a message (at least 10 characters)'
    }
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setSubmitError('')

    const result = await submitJoinApplication({
      locale,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      interest: form.interest,
      message: form.message.trim(),
    })

    setLoading(false)

    if (!result.ok) {
      const apiErrors = result.error.errors ?? {}
      const mapped: Record<string, string> = {}
      if (apiErrors.name?.[0]) mapped.name = apiErrors.name[0]
      if (apiErrors.email?.[0]) mapped.email = apiErrors.email[0]
      if (apiErrors.phone?.[0]) mapped.phone = apiErrors.phone[0]
      if (apiErrors.city?.[0]) mapped.city = apiErrors.city[0]
      if (apiErrors.interest?.[0]) mapped.interest = apiErrors.interest[0]
      if (apiErrors.message?.[0]) mapped.message = apiErrors.message[0]
      if (Object.keys(mapped).length) {
        setErrors(mapped)
      } else {
        setSubmitError(
          isRTL
            ? 'تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى.'
            : result.error.message || 'Could not submit your application. Please try again.',
        )
      }
      return
    }

    setRefNum(result.data.reference_number)
    setSubmitted(true)
  }

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(refNum)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-green-200 bg-white p-8 sm:p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ring-4 ring-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" strokeWidth={2.25} />
        </div>
        <h2 className="text-2xl font-black text-primary-500 mb-2">
          {isRTL ? 'تم إرسال طلبك' : 'Application Submitted'}
        </h2>
        <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
          {isRTL
            ? 'شكرًا لاهتمامك بالانضمام إلى We Rise. سيراجع فريقنا طلبك وسيتواصل معك قريبًا.'
            : 'Thank you for your interest in joining We Rise. Our team will review your application and follow up soon.'}
        </p>
        <div className="mx-auto max-w-sm rounded-2xl border border-green-200 bg-green-50 p-5 mb-6">
          <span className="text-[11px] font-black uppercase tracking-widest text-green-700 mb-2 block">
            {isRTL ? 'رقم المرجع' : 'Reference Number'}
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-black text-green-700 font-mono tracking-wider" dir="ltr">{refNum}</span>
            <button
              type="button"
              onClick={copyReference}
              className="rounded-lg p-2 text-green-600 hover:bg-green-100 transition-colors"
              aria-label={isRTL ? 'نسخ الرقم' : 'Copy reference'}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setCopied(false)
            setForm({
              name: '',
              email: '',
              phone: '',
              city: '',
              interest: firstInterest,
              message: '',
            })
          }}
          className="text-sm font-bold text-primary-500 hover:text-secondary-500 transition-colors"
        >
          {isRTL ? 'إرسال طلب آخر' : 'Submit another application'}
        </button>
      </div>
    )
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors bg-white'

  return (
    <div className="rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black text-primary-500 mb-2">{title}</h2>
      <p className="text-neutral-500 text-sm mb-6 leading-relaxed">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              {isRTL ? 'الاسم الكامل' : 'Full Name'} *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`}
              placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              {isRTL ? 'البريد الإلكتروني' : 'Email Address'} *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`${inputCls} ${errors.email ? 'border-red-400' : ''}`}
              placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              dir="ltr"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              {isRTL ? 'رقم الهاتف' : 'Phone Number'} *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`${inputCls} ${errors.phone ? 'border-red-400' : ''}`}
              placeholder={isRTL ? '+962 7X XXX XXXX' : '+962 7X XXX XXXX'}
              dir="ltr"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              {isRTL ? 'المدينة' : 'City'}
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className={`${inputCls} ${errors.city ? 'border-red-400' : ''}`}
              placeholder={isRTL ? 'مثال: عمان' : 'e.g. Amman'}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            {isRTL ? 'نوع المشاركة' : 'How would you like to join?'} *
          </label>
          <select
            name="interest"
            value={form.interest}
            onChange={handleChange}
            className={`${inputCls} ${errors.interest ? 'border-red-400' : ''}`}
          >
            {Object.entries(interestOptions).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.interest && <p className="text-red-500 text-xs mt-1">{errors.interest}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            {isRTL ? 'لماذا ترغب في الانضمام؟' : 'Why do you want to join?'} *
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            className={`${inputCls} resize-none ${errors.message ? 'border-red-400' : ''}`}
            placeholder={isRTL
              ? 'أخبرنا عن خبراتك ومهاراتك وكيف ترغب في المساهمة...'
              : 'Tell us about your experience, skills, and how you would like to contribute...'}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white rounded-xl py-3.5 font-bold hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isRTL ? 'جارٍ الإرسال...' : 'Submitting...'}
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {isRTL ? 'إرسال الطلب' : 'Submit Application'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
