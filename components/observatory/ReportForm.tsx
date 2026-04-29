'use client'

import { useState, useRef } from 'react'
import { Shield, Upload, CheckCircle, AlertTriangle, X, Eye, EyeOff } from 'lucide-react'

type Locale = 'ar' | 'en'

interface Props {
  locale: Locale
  cardCls: string
  inputCls: string
  labelCls: string
  headingCls: string
  accentColor: string
  btnCls: string
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

function genRef(): string {
  const yr = new Date().getFullYear()
  const rnd = Math.floor(10000 + Math.random() * 90000)
  return `WR-${yr}-${rnd}`
}

export default function ReportForm({ locale, cardCls, inputCls, labelCls, headingCls, accentColor, btnCls }: Props) {
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
  const [submitted, setSubmitted] = useState(false)
  const [refNum, setRefNum] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files || []).slice(0, 5)
    setFiles(prev => [...prev, ...newFiles].slice(0, 5))
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
    await new Promise(r => setTimeout(r, 1500))
    const ref = genRef()
    setRefNum(ref)
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) return (
    <div className={`${cardCls} rounded-3xl p-10 text-center`}>
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className={`text-2xl font-black mb-3 ${headingCls}`}>
        {isRTL ? 'تم استلام البلاغ بنجاح' : 'Report Received Successfully'}
      </h3>
      <p className={`mb-6 ${labelCls}`}>
        {isRTL
          ? 'شكرًا لإبلاغك. سيراجع فريقنا الحالة المُبلَّغ عنها قريبًا.'
          : 'Thank you for reporting. Our team will review the submitted case shortly.'}
      </p>
      <div className="inline-flex flex-col items-center bg-green-50 border border-green-200 rounded-2xl px-8 py-5 mb-6">
        <span className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">
          {isRTL ? 'رقم المرجع الخاص بك' : 'Your Reference Number'}
        </span>
        <span className="text-3xl font-black text-green-700 tracking-wider font-mono">{refNum}</span>
        <span className="text-xs text-green-500 mt-1">{isRTL ? 'احتفظ بهذا الرقم للمتابعة' : 'Keep this number for follow-up'}</span>
      </div>
      <button
        onClick={() => { setSubmitted(false); setForm({ description: '', caseType: '', platform: '', targetGroup: '', anonymous: true, name: '', email: '', phone: '' }); setFiles([]) }}
        className="text-sm font-bold underline opacity-60 hover:opacity-100 transition-opacity"
      >
        {isRTL ? 'الإبلاغ عن حالة أخرى' : 'Report Another Case'}
      </button>
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
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${inputCls} hover:border-primary-400`}
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
