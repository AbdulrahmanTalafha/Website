import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  external?: boolean
  icon?: React.ReactNode
  iconPosition?: 'start' | 'end'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white border border-transparent',
  secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white border border-transparent',
  outline: 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
  ghost: 'bg-transparent text-primary-500 hover:bg-primary-50 border border-transparent',
  white: 'bg-white text-primary-500 hover:bg-neutral-50 border border-transparent',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-base rounded-xl gap-2.5',
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled,
  external,
  icon,
  iconPosition = 'end',
  fullWidth,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary-500',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    fullWidth && 'w-full',
    className
  )

  const content = (
    <>
      {icon && iconPosition === 'start' && icon}
      {children}
      {icon && iconPosition === 'end' && icon}
    </>
  )

  if (href) {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <Link href={href} className={classes} {...externalProps}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  )
}
