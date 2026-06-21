'use client'

import type { CSSProperties } from 'react'

interface ObservatoryHeroBackgroundProps {
  videoUrl?: string | null
  className?: string
  overlayClassName?: string
  /** Full-viewport fixed layers behind scrolling page content. */
  fixed?: boolean
}

const FULL_PAGE_OVERLAY_STYLE: CSSProperties = {
  background:
    'linear-gradient(to bottom, rgba(11, 9, 31, 0.88) 0%, rgba(11, 9, 31, 0.82) 45%, rgba(11, 9, 31, 0.9) 100%)',
}

function videoMimeType(url: string): string {
  if (url.includes('.webm')) return 'video/webm'
  return 'video/mp4'
}

export default function ObservatoryHeroBackground({
  videoUrl,
  className = 'absolute inset-0 w-full h-full object-cover',
  overlayClassName,
  fixed = false,
}: ObservatoryHeroBackgroundProps) {
  if (!videoUrl) return null

  if (fixed) {
    return (
      <>
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type={videoMimeType(videoUrl)} />
          </video>
        </div>
        <div
          className={`fixed inset-0 z-[1] pointer-events-none ${overlayClassName ?? ''}`}
          style={FULL_PAGE_OVERLAY_STYLE}
          aria-hidden="true"
        />
      </>
    )
  }

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`${className} z-0`}
      >
        <source src={videoUrl} type={videoMimeType(videoUrl)} />
      </video>
      {overlayClassName && (
        <div
          className={`absolute inset-0 z-[1] ${overlayClassName}`}
          style={{
            background:
              'linear-gradient(to top, rgba(11, 9, 31, 0.95) 0%, rgba(11, 9, 31, 0.55) 55%, rgba(11, 9, 31, 0.35) 100%)',
          }}
        />
      )}
    </div>
  )
}
