'use client'

import { useState, useRef } from 'react'
import { Shield, Upload, CheckCircle, AlertTriangle, X, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { submitObservatoryReport } from '@/lib/cms'

type Locale = 'ar' | 'en'

interface Props {
  locale: Locale
  cardCls: string
  inputCls: string
  labelCls: string
  headingCls: string
  accentColor: string
  btnCls: string
  isDark?: boolean
}

const CASE_TYPES = {
  ar: [
    { value: 'hate-speech', label: 'خطاب الكراهية' },
    { value: 'digital-violence', label: 'عنف رقمي' },
    { value: 'harassment', label: 'تحرش إلكتروني' },
    { value: 'doxxing', label: 'كشف هوية (Doxxing)' },
    { value: 'impersonation', label: 'انتحال شخصية' },
    { value: 'other', label: 'أخرى' },
  ],
  en: [
    { value: 'hate-speech', label: 'Hate Speech' },
    { value: 'digital-violence', label: 'Digital Violence' },
    { value: 'harassment', label: 'Online Harassment' },
    { value: 'doxxing', label: 'Doxxing' },
    { value: 'impersonation', label: 'Impersonation' },
    { value: 'other', label: 'Other' },
  ],
}

const PLATFORMS = ['Facebook', 'X (Twitter)', 'Instagram', 'TikTok', 'YouTube', 'Snapchat', 'WhatsApp', 'Telegram']
const TARGET_GROUPS = {
  ar: ['النساء', 'الأقليات الدينية', 'اللاجئون', 'مجتمع LGBTQ+', 'الصحفيون', 'الناشطون', 'أخرى'],
  en: ['Women', 'Religious Minorities', 'Refugees', 'LGBTQ+', 'Journalists', 'Activists', 'Other'],
}

export default function ReportForm({ locale, cardCls, inputCls, labelCls, headingCls, accentColor, btnCls, isDark = false }: Props) {
  const isRTL = locale === 'ar'
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    description: '',
    caseType: '',
    platform: '',
    targetGroup: '',
    anonymous: true,
    name: '',
    email: '',
    phone: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const [submitted, setSubmitted] = useState(false)
  const [refNum, setRefNum] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [copied, setCopied] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  function addFiles(fileList: FileList | File[]) {
    const newFiles = Array.from(fileList).slice(0, 5)
    setFiles(prev => [...prev, ...newFiles].slice(0, 5))
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) addFiles(e.target.files)
    e.target.value = ''
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current += 1
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  function removeFile(idx: number) {
    setFiles(f => f.filter((_, i) => i !== idx))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.description.trim() || form.description.trim().length < 20)
      errs.description = isRTL ? 'يرجى وصف الحالة بتفصيل كافٍ (20 حرف على الأقل)' : 'Please describe the case in sufficient detail (at least 20 characters)'
    if (!form.caseType)
      errs.caseType = isRTL ? 'يرجى تحديد نوع الحالة' : 'Please select the case type'
    if (!form.platform)
      errs.platform = isRTL ? 'يرجى تحديد المنصة' : 'Please select the platform'
    if (!form.anonymous && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setSubmitError('')

    const body = new FormData()
    body.append('locale', locale)
    body.append('description', form.description.trim())
    body.append('case_type', form.caseType)
    body.append('platform', form.platform)
    if (form.targetGroup) body.append('target_group', form.targetGroup)
    body.append('anonymous', form.anonymous ? '1' : '0')
    if (!form.anonymous) {
      if (form.name) body.append('name', form.name)
      if (form.email) body.append('email', form.email)
      if (form.phone) body.append('phone', form.phone)
    }
    files.forEach((file) => body.append('files[]', file))

    const result = await submitObservatoryReport(body)

    setLoading(false)

    if (!result.ok) {
      const apiErrors = result.error.errors ?? {}
      const mapped: Record<string, string> = {}
      if (apiErrors.description?.[0]) mapped.description = apiErrors.description[0]
      if (apiErrors.case_type?.[0]) mapped.caseType = apiErrors.case_type[0]
      if (apiErrors.platform?.[0]) mapped.platform = apiErrors.platform[0]
      if (apiErrors.email?.[0]) mapped.email = apiErrors.email[0]
      if (Object.keys(mapped).length) {
        setErrors(mapped)
      } else {
        setSubmitError(
          isRTL
            ? 'تعذّر إرسال البلاغ. يرجى المحاولة مرة أخرى.'
            : result.error.message || 'Could not submit the report. Please try again.',
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

  if (submitted) return (
    <div className={`${cardCls} relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center`}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 0%, rgba(34, 197, 94, 0.14) 0%, transparent 55%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(34, 197, 94, 0.12) 0%, transparent 55%)',
        }}
      />

      <div className="relative z-10">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ring-4 ${
            isDark
              ? 'bg-green-500/15 ring-green-500/25 shadow-[0_0_40px_rgba(34,197,94,0.25)]'
              : 'bg-green-100 ring-green-200/80 shadow-lg shadow-green-100'
          }`}
        >
          <CheckCircle className={`h-10 w-10 ${isDark ? 'text-green-400' : 'text-green-600'}`} strokeWidth={2.25} />
        </div>

        <h3 className={`text-2xl sm:text-3xl font-black mb-3 leading-tight ${headingCls}`}>
          {isRTL ? 'تم استلام البلاغ بنجاح' : 'Report Received Successfully'}
        </h3>
        <p className={`mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed ${labelCls}`}>
          {isRTL
            ? 'شكرًا لإبلاغك. سيراجع فريقنا الحالة المُبلَّغ عنها قريبًا وسنتابع معك عند الحاجة.'
            : 'Thank you for reporting. Our team will review the submitted case shortly and follow up if needed.'}
        </p>

        <div
          className={`mx-auto max-w-sm rounded-2xl border p-6 mb-8 ${
            isDark
              ? 'border-green-500/30 bg-gradient-to-b from-green-500/10 to-green-500/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
              : 'border-green-200 bg-gradient-to-b from-green-50 to-white shadow-sm'
          }`}
        >
          <span className={`text-[11px] font-black uppercase tracking-[0.14em] mb-2 block ${isDark ? 'text-green-400/90' : 'text-green-600'}`}>
            {isRTL ? 'رقم المرجع الخاص بك' : 'Your Reference Number'}
          </span>
          <div className="flex items-center justify-center gap-2">
            <span
              className={`text-2xl sm:text-3xl font-black tracking-wider font-mono ${isDark ? 'text-green-300' : 'text-green-700'}`}
              dir="ltr"
            >
              {refNum}
            </span>
            <button
              type="button"
              onClick={copyReference}
              className={`shrink-0 rounded-lg p-2 transition-colors ${
                isDark
                  ? 'text-green-400/80 hover:bg-white/10 hover:text-green-300'
                  : 'text-green-600 hover:bg-green-100'
              }`}
              aria-label={isRTL ? 'نسخ الرقم' : 'Copy reference number'}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <span className={`text-xs mt-3 block ${isDark ? 'text-green-400/70' : 'text-green-600'}`}>
            {copied
              ? (isRTL ? 'تم نسخ الرقم' : 'Reference copied')
              : (isRTL ? 'احتفظ بهذا الرقم للمتابعة' : 'Keep this number for follow-up')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setCopied(false)
            setForm({ description: '', caseType: '', platform: '', targetGroup: '', anonymous: true, name: '', email: '', phone: '' })
            setFiles([])
          }}
          className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
            isDark
              ? 'text-white/70 hover:text-white hover:bg-white/10'
              : 'text-primary-600 hover:bg-primary-50'
          }`}
        >
          {isRTL ? 'الإبلاغ عن حالة أخرى' : 'Report another case'}
        </button>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className={`${cardCls} rounded-3xl p-8 space-y-6`} noValidate>

      {/* Case description */}
      <div>
        <label className={`block text-sm font-black mb-2 ${labelCls}`}>
          {isRTL ? 'وصف الحالة *' : 'Case Description *'}
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder={isRTL ? 'صِف الحالة بالتفصيل: ما الذي حدث، متى، وما السياق...' : 'Describe the case in detail: what happened, when, and the context...'}
          className={`w-full rounded-2xl px-4 py-3 text-sm resize-none ${inputCls} ${errors.description ? 'border-red-400' : ''}`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Case type + Platform row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-black mb-2 ${labelCls}`}>
            {isRTL ? 'نوع الحالة *' : 'Case Type *'}
          </label>
          <select name="caseType" value={form.caseType} onChange={handleChange} className={`w-full rounded-2xl px-4 py-3 text-sm ${inputCls} ${errors.caseType ? 'border-red-400' : ''}`}>
            <option value="">{isRTL ? '— اختر النوع —' : '— Select type —'}</option>
            {CASE_TYPES[locale].map(ct => (
              <option key={ct.value} value={ct.value}>{ct.label}</option>
            ))}
          </select>
          {errors.caseType && <p className="text-red-500 text-xs mt-1">{errors.caseType}</p>}
        </div>
        <div>
          <label className={`block text-sm font-black mb-2 ${labelCls}`}>
            {isRTL ? 'المنصة *' : 'Platform *'}
          </label>
          <select name="platform" value={form.platform} onChange={handleChange} className={`w-full rounded-2xl px-4 py-3 text-sm ${inputCls} ${errors.platform ? 'border-red-400' : ''}`}>
            <option value="">{isRTL ? '— اختر المنصة —' : '— Select platform —'}</option>
            {PLATFORMS.map(pl => <option key={pl} value={pl}>{pl}</option>)}
          </select>
          {errors.platform && <p className="text-red-500 text-xs mt-1">{errors.platform}</p>}
        </div>
      </div>

      {/* Target group */}
      <div>
        <label className={`block text-sm font-black mb-2 ${labelCls}`}>
          {isRTL ? 'الفئة المستهدفة (اختياري)' : 'Target Group (optional)'}
        </label>
        <select name="targetGroup" value={form.targetGroup} onChange={handleChange} className={`w-full rounded-2xl px-4 py-3 text-sm ${inputCls}`}>
          <option value="">{isRTL ? '— اختر الفئة —' : '— Select group —'}</option>
          {TARGET_GROUPS[locale].map(tg => <option key={tg} value={tg}>{tg}</option>)}
        </select>
      </div>

      {/* File upload */}
      <div>
        <label className={`block text-sm font-black mb-2 ${labelCls}`}>
          {isRTL ? 'صور أو ملفات داعمة (اختياري، حتى 5 ملفات)' : 'Supporting Screenshots or Files (optional, up to 5)'}
        </label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileRef.current?.click()
            }
          }}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${inputCls} hover:border-primary-400 ${
            isDragging ? 'border-primary-400 bg-primary-500/10' : ''
          }`}
        >
          <Upload className="w-6 h-6 mx-auto mb-2 opacity-40" />
          <p className={`text-sm ${labelCls}`}>{isRTL ? 'انقر لرفع ملفات أو اسحب وأفلت' : 'Click to upload files or drag & drop'}</p>
          <p className="text-xs opacity-40 mt-1">{isRTL ? 'PNG, JPG, PDF, MP4 حتى 10MB لكل ملف' : 'PNG, JPG, PDF, MP4 up to 10MB each'}</p>
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf,video/mp4" className="hidden" onChange={handleFiles} />
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-2 text-sm ${inputCls}`}>
                <span className="truncate max-w-xs opacity-80">{f.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 shrink-0 ms-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Anonymous toggle */}
      <button
        type="button"
        onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
        className={`w-full flex items-center justify-between gap-4 rounded-2xl p-4 text-start transition-colors ${inputCls}`}
      >
        <div className="flex items-center gap-2">
          {form.anonymous ? <EyeOff className={`w-4 h-4 shrink-0 ${headingCls}`} /> : <Eye className={`w-4 h-4 shrink-0 ${headingCls}`} />}
          <div>
            <div className={`text-sm font-black ${headingCls}`}>
              {isRTL ? (form.anonymous ? 'الإبلاغ بشكل مجهول' : 'الإبلاغ بهويتك') : (form.anonymous ? 'Report Anonymously' : 'Report with Identity')}
            </div>
            <p className={`text-xs mt-0.5 opacity-60 ${labelCls}`}>
              {isRTL
                ? (form.anonymous ? 'لن يتم حفظ أي بيانات تعريفية' : 'يمكنك ترك بيانات تواصل للمتابعة')
                : (form.anonymous ? 'No identifying data will be stored' : 'You may leave contact info for follow-up')}
            </p>
          </div>
        </div>
        {/* Toggle pill */}
        <div
          className="relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
          style={{ backgroundColor: form.anonymous ? accentColor : '#d1d5db' }}
        >
          <span
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
            style={{ [isRTL ? 'right' : 'left']: form.anonymous ? '4px' : 'calc(100% - 20px)' }}
          />
        </div>
      </button>

      {/* Contact info (shown when not anonymous) */}
      {!form.anonymous && (
        <div className="space-y-4">
          <p className={`text-xs font-bold uppercase tracking-wider opacity-50 ${labelCls}`}>
            {isRTL ? 'بيانات التواصل (اختيارية)' : 'Contact Information (optional)'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${labelCls}`}>{isRTL ? 'الاسم' : 'Name'}</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={isRTL ? 'اسمك الكامل' : 'Full name'} className={`w-full rounded-xl px-3 py-2.5 text-sm ${inputCls}`} />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${labelCls}`}>{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" className={`w-full rounded-xl px-3 py-2.5 text-sm ${inputCls} ${errors.email ? 'border-red-400' : ''}`} dir="ltr" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${labelCls}`}>{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+962 7X XXX XXXX" className={`w-full rounded-xl px-3 py-2.5 text-sm ${inputCls}`} dir="ltr" />
            </div>
          </div>
        </div>
      )}

      {/* Legal notice */}
      <div className="flex items-start gap-3 rounded-2xl p-4 bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          {isRTL
            ? 'جميع البلاغات تُراجع من قِبل الفريق المتخصص. البيانات المُجمَّعة تُستخدم لأغراض إحصائية وبحثية فقط. لا يتم مشاركة المعلومات الشخصية مع أطراف ثالثة.'
            : 'All reports are reviewed by our specialized team. Aggregated data is used for statistical and research purposes only. Personal information is never shared with third parties.'}
        </p>
      </div>

      {submitError && (
        <p className="text-red-500 text-sm">{submitError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-2xl text-white font-black text-sm transition-all flex items-center justify-center gap-2 ${btnCls} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isRTL ? 'جارٍ الإرسال...' : 'Submitting...'}</>
        ) : (
          <><Shield className="w-4 h-4" />{isRTL ? 'إرسال البلاغ' : 'Submit Report'}</>
        )}
      </button>
    </form>
  )
}
