import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

/**
 * SecondaryButton
 *
 * Props:
 *   variant   — 'ghost' | 'outline' | 'outline-teal' | 'outline-amber' | 'subtle'
 *               default: 'outline'
 *   size      — 'sm' | 'md' | 'lg' | 'xl'    default: 'md'
 *   loading   — boolean                        default: false
 *   disabled  — boolean                        default: false
 *   fullWidth — boolean                        default: false
 *   icon      — ReactNode (left icon)
 *   iconRight — ReactNode (right icon)
 *   active    — boolean (pressed/selected state)
 *   onClick, children, className, type, ...rest
 *
 * Usage:
 *   <SecondaryButton variant="outline-teal" icon={<Heart size={15} />}>
 *     Save Car
 *   </SecondaryButton>
 *
 *   <SecondaryButton variant="ghost" size="sm">
 *     Cancel
 *   </SecondaryButton>
 */

const VARIANTS = {
  ghost: {
    base: 'bg-transparent text-[#A0A0C0] border border-transparent',
    hover: 'hover:bg-white/5 hover:text-[#F0F0F8] hover:border-white/10',
    active: 'bg-white/8 text-[#F0F0F8] border-white/12',
    ring: 'focus-visible:ring-white/30',
  },
  outline: {
    base: 'bg-transparent text-[#A0A0C0] border border-white/12',
    hover: 'hover:bg-white/5 hover:text-[#F0F0F8] hover:border-white/20',
    active: 'bg-white/8 text-[#F0F0F8] border-white/25',
    ring: 'focus-visible:ring-white/30',
  },
  'outline-teal': {
    base: 'bg-[#00C8FF]/0 text-[#00C8FF] border border-[#00C8FF]/30',
    hover: 'hover:bg-[#00C8FF]/8 hover:border-[#00C8FF]/60',
    active: 'bg-[#00C8FF]/12 border-[#00C8FF]/70',
    ring: 'focus-visible:ring-[#00C8FF]/40',
  },
  'outline-amber': {
    base: 'bg-[#FF8C35]/0 text-[#FF8C35] border border-[#FF8C35]/30',
    hover: 'hover:bg-[#FF8C35]/8 hover:border-[#FF8C35]/60',
    active: 'bg-[#FF8C35]/12 border-[#FF8C35]/70',
    ring: 'focus-visible:ring-[#FF8C35]/40',
  },
  subtle: {
    base: 'bg-white/4 text-[#B0B0CC] border border-white/6',
    hover: 'hover:bg-white/8 hover:text-[#F0F0F8] hover:border-white/14',
    active: 'bg-white/10 text-[#F0F0F8] border-white/18',
    ring: 'focus-visible:ring-white/30',
  },
}

const SIZES = {
  sm: 'h-8 px-3.5 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
  xl: 'h-14 px-8 text-lg gap-3 rounded-2xl',
}

const ICON_SIZES = { sm: 13, md: 15, lg: 17, xl: 20 }

const SecondaryButton = forwardRef(function SecondaryButton(
  {
    variant = 'outline',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    active = false,
    icon,
    iconRight,
    children,
    className,
    onClick,
    type = 'button',
    ...rest
  },
  ref
) {
  const v = VARIANTS[variant] ?? VARIANTS.outline
  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.015 }}
      whileTap={isDisabled ? {} : { scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={clsx(
        'relative inline-flex items-center justify-center font-body font-medium',
        'select-none outline-none transition-all duration-200 backdrop-blur-sm',
        // variant base
        v.base,
        // hover (via class, applied via CSS)
        v.hover,
        // active/selected state
        active && v.active,
        // size
        SIZES[size],
        // focus ring
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060C]',
        v.ring,
        // full width
        fullWidth && 'w-full',
        // disabled
        isDisabled && 'opacity-35 cursor-not-allowed pointer-events-none',
        'tracking-wide',
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 size={ICON_SIZES[size]} className="animate-spin shrink-0" aria-hidden />
      ) : icon ? (
        <span className="shrink-0" aria-hidden>{icon}</span>
      ) : null}

      <span className="leading-none">{children}</span>

      {!loading && iconRight && (
        <span className="shrink-0" aria-hidden>{iconRight}</span>
      )}
    </motion.button>
  )
})

export default SecondaryButton