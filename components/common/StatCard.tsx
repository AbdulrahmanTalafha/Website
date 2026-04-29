'use client'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  value: number
  suffix?: string
  label: string
  icon?: string
  light?: boolean
}

export default function StatCard({ value, suffix = '', label, light = false }: StatCardProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  if (light) {
    return (
      <div
        ref={ref}
        className="group relative text-center p-5 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/15 hover:bg-white/14 hover:border-white/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      >
        {/* Red accent top bar */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-500 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 bg-secondary-500/0 group-hover:bg-secondary-500/5 rounded-2xl transition-colors duration-300 pointer-events-none" />

        <div className="relative">
          {/* Number */}
          <div className="flex items-baseline justify-center gap-0.5 mb-1">
            <span className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-none tabular-nums">
              {count.toLocaleString()}
            </span>
            {suffix && (
              <span className="text-lg lg:text-xl font-black text-secondary-400 leading-none">
                {suffix}
              </span>
            )}
          </div>
          {/* Divider */}
          <div className="w-8 h-px bg-secondary-500/60 mx-auto my-2.5" />
          {/* Label */}
          <p className="text-xs lg:text-sm font-semibold text-white/70 leading-snug">
            {label}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="group relative text-center p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-500 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="text-4xl lg:text-5xl font-black text-primary-500 mb-1 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="w-6 h-px bg-secondary-500/50 mx-auto my-2" />
      <p className="text-sm font-medium text-neutral-600">{label}</p>
    </div>
  )
}
