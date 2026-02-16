'use client'

import { cn } from '@/lib/utils'

const FLAG_CDN = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3'

interface CurrencyFlagProps {
  countryCode: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizePx = {
  sm: 20,
  md: 24,
  lg: 28,
}

export function CurrencyFlag({ countryCode, className, size = 'md' }: CurrencyFlagProps) {
  const code = countryCode.toLowerCase()
  const dim = sizePx[size]
  const src = `${FLAG_CDN}/${code}.svg`
  return (
    <span
      className={cn('inline-block shrink-0 overflow-hidden rounded-[3px] bg-gray-100', className)}
      style={{ width: dim, height: Math.round(dim * 0.75) }}
      role="img"
      aria-hidden
    >
      <img
        src={src}
        alt=""
        width={dim}
        height={Math.round(dim * 0.75)}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </span>
  )
}
