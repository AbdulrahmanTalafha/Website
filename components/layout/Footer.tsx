'use client'

import Link from 'next/link'
import type { Locale } from '@/types'
import { siteData } from '@/data/site'
import { footerLinks } from '@/data/navigation'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'

interface FooterProps {
  locale: Locale
}

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary-500 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-flex mb-4">
              <div className="bg-white/95 rounded-xl px-4 py-2 shadow-sm">
                <img
                  src={locale === 'ar' ? '/logo-ar.svg' : '/logo-en.svg'}
                  alt={siteData.name[locale]}
                  className="h-10 w-auto"
                />
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-xs">
              {siteData.description[locale]}
            </p>
            {/* Contact info */}
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary-400 shrink-0" />
                <span>{siteData.address[locale]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary-400 shrink-0" />
                <a href={`mailto:${siteData.email}`} className="hover:text-white transition-colors">
                  {siteData.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary-400 shrink-0" />
                <a href={`tel:${siteData.phone}`} className="hover:text-white transition-colors" dir="ltr">
                  {siteData.phone}
                </a>
              </div>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {Object.entries(siteData.social).map(([key, url]) => {
                if (!url) return null
                const Icon = socialIcons[key as keyof typeof socialIcons]
                if (!Icon) return null
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary-500 transition-colors"
                    aria-label={key}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-bold text-sm mb-4 text-white">
                {section.label[locale]}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={`/${locale}${item.href}`}
                      className="text-sm text-white/65 hover:text-secondary-400 transition-colors"
                    >
                      {item.label[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm">
                {locale === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to our newsletter'}
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                {locale === 'ar'
                  ? 'كن أول من يصلك أحدث تقاريرنا وفعالياتنا'
                  : 'Be first to receive our latest reports and events'}
              </p>
            </div>
            <form className="flex gap-2 w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-secondary-400 w-full sm:w-64"
                aria-label={locale === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
              >
                {locale === 'ar' ? 'اشترك' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
            <p>
              © {year} {siteData.name[locale]}. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/sitemap.xml`} className="hover:text-white/80 transition-colors">
                {locale === 'ar' ? 'خريطة الموقع' : 'Sitemap'}
              </Link>
              <span>·</span>
              <span>{locale === 'ar' ? 'تأسس عام 2018 — عمّان، الأردن' : 'Founded 2018 — Amman, Jordan'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
