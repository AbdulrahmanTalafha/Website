'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Locale, TeamMember } from '@/types'
import { Mail, Linkedin, ArrowRight, ArrowLeft } from 'lucide-react'

interface TeamMemberCardProps {
  member: TeamMember
  locale: Locale
}

export default function TeamMemberCard({ member, locale }: TeamMemberCardProps) {
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const profileHref = `/${locale}/team-governance/${member.slug}`

  return (
    <Link href={profileHref} className="group block relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 aspect-[3/4]">
      {/* Full background image */}
      <Image
        src={member.photo}
        alt={member.name[locale]}
        fill
        className="object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
        sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />

      {/* Always-visible bottom gradient — fades out on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />

      {/* Static name/role at bottom — slides down + fades on hover */}
      <div className="absolute bottom-0 inset-x-0 p-5 transition-all duration-400 ease-in group-hover:opacity-0 group-hover:translate-y-3">
        <p className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
          {member.department[locale]}
        </p>
        <h3 className="text-white font-black text-lg leading-tight">
          {member.name[locale]}
        </h3>
        <p className="text-white/70 text-sm font-medium mt-0.5">
          {member.position[locale]}
        </p>
      </div>

      {/* Hover overlay — slides up from bottom */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-primary-900/90">
        <div className="mb-4 mt-auto translate-y-5 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary-400 mb-1">
            {member.department[locale]}
          </p>
          <h3 className="text-white font-black text-lg leading-tight">
            {member.name[locale]}
          </h3>
          <p className="text-white/80 text-sm font-medium mt-0.5 mb-3">
            {member.position[locale]}
          </p>
          <p className="text-white/70 text-xs leading-relaxed line-clamp-3">
            {member.bio[locale]}
          </p>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between border-t border-white/20 pt-3">
          <div className="flex gap-2">
            <span
              onClick={(e) => { e.preventDefault(); window.location.href = `mailto:${member.email}` }}
              className="w-8 h-8 bg-white/20 hover:bg-secondary-500 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-sm"
            >
              <Mail className="w-3.5 h-3.5" />
            </span>
            {member.linkedin && (
              <span
                onClick={(e) => { e.preventDefault(); window.open(member.linkedin, '_blank') }}
                className="w-8 h-8 bg-white/20 hover:bg-secondary-500 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-sm"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-white text-xs font-semibold bg-white/20 hover:bg-secondary-500 px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm">
            {isRTL ? 'الملف الشخصي' : 'Profile'}
            <ArrowIcon className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

