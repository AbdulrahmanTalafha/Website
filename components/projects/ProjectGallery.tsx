'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ZoomIn } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'

interface ProjectGalleryProps {
  images: string[]
  alt: string
  variant: 'dark' | 'light' | 'classic'
  isRTL: boolean
}

export default function ProjectGallery({ images, alt, variant, isRTL }: ProjectGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const slides = useMemo(() => images.map((src) => ({ src })), [images])

  const gridClass =
    variant === 'classic'
      ? 'grid grid-cols-2 gap-3'
      : 'grid grid-cols-2 md:grid-cols-3 gap-3'

  return (
    <>
      <div className={gridClass}>
        {images.map((img, i) => {
          const itemClass =
            variant === 'classic'
              ? 'relative rounded-xl overflow-hidden aspect-video bg-neutral-100 group'
              : variant === 'dark'
                ? `relative rounded-2xl overflow-hidden bg-primary-800 border border-white/10 ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'} group`
                : `relative rounded-2xl overflow-hidden bg-primary-50 border border-neutral-100 ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'} group shadow-sm`

          const imageClass =
            variant === 'dark'
              ? 'object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700'
              : variant === 'light'
                ? 'object-cover group-hover:scale-105 transition-transform duration-700'
                : 'object-cover group-hover:scale-105 transition-transform duration-500'

          return (
            <button
              key={img + i}
              type="button"
              onClick={() => {
                setIndex(i)
                setOpen(true)
              }}
              className={`${itemClass} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2`}
              aria-label={`${alt} ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${alt} ${i + 1}`}
                fill
                className={imageClass}
                sizes="(max-width:768px) 50vw, 33vw"
                unoptimized={isCmsHostedMediaUrl(img)}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
                <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-3.5 w-3.5" />
                  {isRTL ? 'عرض' : 'View'}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Counter, Thumbnails, Zoom, Fullscreen]}
        thumbnails={{
          position: 'bottom',
          width: 72,
          height: 54,
          border: 2,
          borderRadius: 8,
          padding: 12,
          gap: 10,
          imageFit: 'cover',
        }}
        zoom={{
          maxZoomPixelRatio: 4,
          scrollToZoom: true,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
        }}
        animation={{ fade: 280, swipe: 350 }}
        carousel={{
          finite: images.length <= 1,
          padding: 24,
          spacing: '12%',
          imageFit: 'contain',
        }}
        controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
        labels={{
          Close: isRTL ? 'إغلاق' : 'Close',
          Previous: isRTL ? 'الصورة السابقة' : 'Previous',
          Next: isRTL ? 'الصورة التالية' : 'Next',
          '{index} of {total}': isRTL ? '{index} من {total}' : '{index} of {total}',
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.96)' },
          thumbnailsContainer: { backgroundColor: 'rgba(0, 0, 0, 0.55)' },
          button: { filter: 'none' },
        }}
        on={{
          view: ({ index: current }) => setIndex(current),
        }}
      />
    </>
  )
}
