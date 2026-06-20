import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title?: string | null
  subtitle?: string | null
  label?: string | null
  align?: 'start' | 'center' | 'end'
  titleClassName?: string
  light?: boolean
}

export default function SectionHeader({
  title,
  subtitle,
  label,
  align = 'start',
  titleClassName,
  light = false,
}: SectionHeaderProps) {
  const hasTitle = title?.trim()
  const hasSubtitle = subtitle?.trim()
  const hasLabel = label?.trim()

  if (!hasTitle && !hasSubtitle && !hasLabel) return null

  return (
    <div
      className={cn('mb-10', {
        'text-start': align === 'start',
        'text-center mx-auto': align === 'center',
        'text-end': align === 'end',
      })}
    >
      {hasLabel && (
        <span className={cn(
          'inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3',
          light
            ? 'bg-white/20 text-white'
            : 'bg-secondary-50 text-secondary-600'
        )}>
          {hasLabel}
        </span>
      )}
      {hasTitle && (
      <h2
        className={cn(
          'font-bold leading-tight text-balance',
          light ? 'text-white' : 'text-primary-500',
          titleClassName ?? 'text-3xl lg:text-4xl'
        )}
      >
        {hasTitle}
      </h2>
      )}
      {hasSubtitle && (
        <p
          className={cn(
            'mt-3 text-base lg:text-lg max-w-2xl leading-relaxed',
            align === 'center' && 'mx-auto',
            light ? 'text-white/75' : 'text-neutral-600'
          )}
        >
          {hasSubtitle}
        </p>
      )}
      {(hasTitle || hasSubtitle) && (
      <div
        className={cn(
          'mt-4 h-1 w-12 rounded-full bg-secondary-500',
          align === 'center' && 'mx-auto',
          align === 'end' && 'ms-auto'
        )}
      />
      )}
    </div>
  )
}
