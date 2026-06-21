'use client'

import { useState } from 'react'
import { Send, CheckCircle, Copy, Check } from 'lucide-react'
import { submitContactForm } from '@/lib/cms'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
  formTitle?: string | null
  formDescription?: string | null
}

export default function ContactForm({ locale, formTitle, formDescription }: Props) {
  const isRTL = locale === 'ar'

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [refNum, setRefNum] = useState('')
  const [copied, setCopied] = useState(false)

  const title = formTitle?.trim() || (isRTL ? 'أرسل رسالة' : 'Send a Message')
  const description = formDescription?.trim() || (isRTL
    ? 'أرسل رسالتك وسيتواصل معك فريقنا في أقرب وقت.'
    : 'Fill out the form and our team will get back to you as soon as possible.')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = isRTL ? 'يرجى إدخال اسمك' : 'Please enter your name'
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address'
    }
    if (!form.subject.trim() || form.subject.trim().length < 3) {
      errs.subject = isRTL ? 'يرجى إدخال موضوع الرسالة' : 'Please enter a subject'
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

    const result = await submitContactForm({
      locale,
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    })

    setLoading(false)

    if (!result.ok) {
      const apiErrors = result.error.errors ?? {}
      const mapped: Record<string, string> = {}
      if (apiErrors.name?.[0]) mapped.name = apiErrors.name[0]
      if (apiErrors.email?.[0]) mapped.email = apiErrors.email[0]
      if (apiErrors.subject?.[0]) mapped.subject = apiErrors.subject[0]
      if (apiErrors.message?.[0]) mapped.message = apiErrors.message[0]
      if (Object.keys(mapped).length) {
        setErrors(mapped)
      } else {
        setSubmitError(
          isRTL
            ? 'تعذّر إرسال الرسالة. يرجى المحاولة مرة أخرى.'
            : result.error.message || 'Could not send your message. Please try again.',
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
          {isRTL ? 'تم إرسال رسالتك' : 'Message Sent'}
        </h2>
        <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
          {isRTL
            ? 'شكرًا لتواصلك معنا. سيراجع فريقنا رسالتك وسيتابع معك قريبًا.'
            : 'Thank you for reaching out. Our team will review your message and follow up soon.'}
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
            setForm({ name: '', email: '', subject: '', message: '' })
          }}
          className="text-sm font-bold text-primary-500 hover:text-secondary-500 transition-colors"
        >
          {isRTL ? 'إرسال رسالة أخرى' : 'Send another message'}
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

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            {isRTL ? 'موضوع الرسالة' : 'Subject'} *
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className={`${inputCls} ${errors.subject ? 'border-red-400' : ''}`}
            placeholder={isRTL ? 'موضوع رسالتك' : 'Message subject'}
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            {isRTL ? 'الرسالة' : 'Message'} *
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            className={`${inputCls} resize-none ${errors.message ? 'border-red-400' : ''}`}
            placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
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
              {isRTL ? 'جارٍ الإرسال...' : 'Sending...'}
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {isRTL ? 'إرسال الرسالة' : 'Send Message'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
