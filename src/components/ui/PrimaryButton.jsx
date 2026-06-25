import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

/**
 * PrimaryButton
 *
 * Props:
 *   variant   — 'teal' | 'amber' | 'white' | 'danger'    default: 'teal'
 *   size      — 'sm' | 'md' | 'lg' | 'xl'                default: 'md'
 *   loading   — boolean                                    default: false
 *   disabled  — boolean                                    default: false
 *   fullWidth — boolean                                    default: false
 *   icon      — ReactNode (left icon)
 *   iconRight — ReactNode (right icon)
 *   glow      — boolean (adds matching glow shadow)        default: true
 *   onClick, children, className, type, ...rest
 *
 * Usage:
 *   <PrimaryButton variant="teal" icon={<Search size={16} />}>
 *     Find My Car
 *   </PrimaryButton>
 */

const VARIANTS = {
  teal: {
    base: 'bg-gradient-to-r from-[#00C8FF] to-[#0096CC] text-[#030308]',
    hover: 'hover:from-[#33D4FF] hover:to-[#00AAEE]',
    glow: '0 0 28px rgba(0, 200, 255, 0.45), 0 4px 16px rgba(0, 200, 255, 0.2)',
    ring: 'focus-visible:ring-[#00C8FF]/50',
  },
  amber: {
    base: 'bg-gradient-to-r from-[#FF8C35] to-[#E06010] text-[#0D0808]',
    hover: 'hover:from-[#FFA050] hover:to-[#FF7020]',
    glow: '0 0 28px rgba(255, 140, 53, 0.45), 0 4px 16px rgba(255, 140, 53, 0.2)',
    ring: 'focus-visible:ring-[#FF8C35]/50',
  },
  white: {
    base: 'bg-[#F0F0F8] text-[#06060C]',
    hover: 'hover:bg-white',
    glow: '0 0 20px rgba(240, 240, 248, 0.2)',
    ring: 'focus-visible:ring-white/50',
  },
  danger: {
    base: 'bg-gradient-to-r from-[#EF4444] to-[#C81E1E] text-white',
    hover: 'hover:from-[#F87171] hover:to-[#EF4444]',
    glow: '0 0 28px rgba(239, 68, 68, 0.4)',
    ring: 'focus-visible:ring-red-500/50',
  },
}

const SIZES = {
  sm: 'h-8 px-4 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-7 text-base gap-2.5 rounded-xl',
  xl: 'h-14 px-9 text-lg gap-3 rounded-2xl',
}

const ICON_SIZES = { sm: 14, md: 15, lg: 17, xl: 20 }

const PrimaryButton = forwardRef(function PrimaryButton(
  {
    variant = 'teal',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    glow = true,
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
  const v = VARIANTS[variant] ?? VARIANTS.teal
  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.025, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      style={glow && !isDisabled ? { boxShadow: v.glow } : {}}
      className={clsx(
        // base layout
        'relative inline-flex items-center justify-center font-body font-semibold',
        'select-none outline-none transition-colors duration-200',
        // variant
        v.base, v.hover,
        // size
        SIZES[size],
        // focus ring
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060C]',
        v.ring,
        // full width
        fullWidth && 'w-full',
        // disabled
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        // tracking
        'tracking-wide',
        className
      )}
      {...rest}
    >
      {/* Shimmer overlay on hover */}
      {!isDisabled && (
        <motion.span
          className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"
          aria-hidden
        >
          <motion.span
            className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20"
            whileHover={{ translateX: '200%' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        </motion.span>
      )}

      {/* Left icon or spinner */}
      {loading ? (
        <Loader2 size={ICON_SIZES[size]} className="animate-spin shrink-0" aria-hidden />
      ) : icon ? (
        <span className="shrink-0" aria-hidden>{icon}</span>
      ) : null}

      {/* Label */}
      <span className="relative leading-none">{children}</span>

      {/* Right icon */}
      {!loading && iconRight && (
        <span className="shrink-0" aria-hidden>{iconRight}</span>
      )}
    </motion.button>
  )
})

export default PrimaryButton