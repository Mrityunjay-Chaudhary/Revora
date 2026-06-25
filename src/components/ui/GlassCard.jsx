import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

/**
 * GlassCard
 *
 * A reusable glassmorphism container. Composes well with any child content.
 *
 * Props:
 *   variant     — 'default' | 'elevated' | 'inset' | 'bordered'    default: 'default'
 *   accent      — 'none' | 'teal' | 'amber' | 'purple' | 'green'   default: 'none'
 *   accentSide  — 'top' | 'left' | 'bottom'                        default: 'top'
 *   hoverable   — boolean (adds hover lift + border brighten)       default: false
 *   clickable   — boolean (cursor-pointer + press scale)            default: false
 *   padding     — 'none' | 'sm' | 'md' | 'lg' | 'xl'              default: 'md'
 *   rounded     — 'md' | 'lg' | 'xl' | '2xl'                       default: 'xl'
 *   glow        — boolean (subtle ambient glow for accent)          default: false
 *   animate     — boolean (fade-in on mount via framer)             default: false
 *   delay       — number (animation delay in seconds)               default: 0
 *   as          — element type                                       default: 'div'
 *   onClick, children, className, style, ...rest
 *
 * Usage:
 *   <GlassCard hoverable accent="teal" padding="lg">
 *     <p>Premium card content</p>
 *   </GlassCard>
 *
 *   <GlassCard as={Link} to="/car/abc" clickable hoverable>
 *     ...
 *   </GlassCard>
 */

const ACCENT_COLORS = {
  none: { border: '', glow: '', bar: '' },
  teal: {
    border: 'border-[#00C8FF]/25 hover:border-[#00C8FF]/45',
    glow: '0 0 40px rgba(0, 200, 255, 0.08)',
    bar: 'bg-gradient-to-r from-[#00C8FF] to-[#0096CC]',
  },
  amber: {
    border: 'border-[#FF8C35]/25 hover:border-[#FF8C35]/45',
    glow: '0 0 40px rgba(255, 140, 53, 0.08)',
    bar: 'bg-gradient-to-r from-[#FF8C35] to-[#E06010]',
  },
  purple: {
    border: 'border-[#8B5CF6]/25 hover:border-[#8B5CF6]/45',
    glow: '0 0 40px rgba(139, 92, 246, 0.08)',
    bar: 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]',
  },
  green: {
    border: 'border-[#00E096]/25 hover:border-[#00E096]/45',
    glow: '0 0 40px rgba(0, 224, 150, 0.08)',
    bar: 'bg-gradient-to-r from-[#00E096] to-[#00A86B]',
  },
}

const VARIANTS = {
  default: 'bg-[#0D0D16]/80 backdrop-blur-xl border border-white/7',
  elevated: 'bg-[#13131F]/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_48px_rgba(0,0,0,0.5)]',
  inset: 'bg-black/30 backdrop-blur-md border border-white/5 shadow-inner',
  bordered: 'bg-[#0D0D16]/70 backdrop-blur-xl border-2 border-white/10',
}

const PADDINGS = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
}

const ROUNDEDS = {
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-[20px]',
  '2xl': 'rounded-3xl',
}

const ACCENT_SIDE_CLASSES = {
  top: 'top-0 left-4 right-4 h-[2px] rounded-b-none rounded-t-full',
  left: 'left-0 top-4 bottom-4 w-[2px] rounded-r-none rounded-l-full',
  bottom: 'bottom-0 left-4 right-4 h-[2px] rounded-t-none rounded-b-full',
}

const GlassCard = forwardRef(function GlassCard(
  {
    variant = 'default',
    accent = 'none',
    accentSide = 'top',
    hoverable = false,
    clickable = false,
    padding = 'md',
    rounded = 'xl',
    glow = false,
    animate = false,
    delay = 0,
    as: Tag = 'div',
    onClick,
    children,
    className,
    style,
    ...rest
  },
  ref
) {
  const accentCfg = ACCENT_COLORS[accent] ?? ACCENT_COLORS.none
  const hasAccent = accent !== 'none'
  const isInteractive = hoverable || clickable || !!onClick

  const baseStyle = {
    ...(glow && hasAccent ? { boxShadow: accentCfg.glow } : {}),
    ...style,
  }

  const containerClasses = clsx(
    'relative overflow-hidden transition-all duration-300',
    VARIANTS[variant],
    PADDINGS[padding],
    ROUNDEDS[rounded],
    // accent border override
    hasAccent && accentCfg.border,
    // hover states
    isInteractive && [
      'hover:bg-[#13131F]/90',
      'hover:shadow-[0_8px_40px_rgba(0,0,0,0.45)]',
      '-translate-y-0 hover:-translate-y-0.5',
    ],
    clickable && 'cursor-pointer',
    className
  )

  if (animate) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={baseStyle}
        className={containerClasses}
        onClick={onClick}
        whileTap={clickable ? { scale: 0.99 } : undefined}
        {...rest}
      >
        {hasAccent && (
          <span
            className={clsx('absolute z-10', accentCfg.bar, ACCENT_SIDE_CLASSES[accentSide])}
            aria-hidden
          />
        )}
        {children}
      </motion.div>
    )
  }

  return (
    <Tag
      ref={ref}
      style={baseStyle}
      className={containerClasses}
      onClick={onClick}
      {...rest}
    >
      {hasAccent && (
        <span
          className={clsx('absolute z-10', accentCfg.bar, ACCENT_SIDE_CLASSES[accentSide])}
          aria-hidden
        />
      )}
      {children}
    </Tag>
  )
})

export default GlassCard