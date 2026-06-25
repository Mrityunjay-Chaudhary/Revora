import { motion } from 'framer-motion'
import clsx from 'clsx'
import {
  Zap, Shield, Leaf, Flame, Star, Trophy, Award, Tag,
  TrendingUp, TrendingDown, Check, X, Clock, Info,
  Fuel, Battery, Gauge, Users, Wrench,
} from 'lucide-react'

/**
 * StatusBadge
 *
 * A versatile label/tag/chip for car attributes, filters, statuses, and ratings.
 *
 * Props:
 *   variant   — 'solid' | 'outline' | 'subtle' | 'pill'       default: 'subtle'
 *   color     — 'teal' | 'amber' | 'green' | 'purple' | 'red'
 *               | 'blue' | 'zinc' | 'yellow'                  default: 'zinc'
 *   preset    — shorthand for common automotive tags (see PRESETS)
 *   size      — 'xs' | 'sm' | 'md'                            default: 'sm'
 *   icon      — ReactNode | string (icon name from ICON_MAP)
 *   dot       — boolean (show leading colored dot instead of icon)
 *   pulse     — boolean (animate dot for "live" states)
 *   uppercase — boolean                                        default: false
 *   onClick   — triggers interactive/clickable mode
 *   active    — boolean (for toggle-style badges)
 *   children  — label text
 *   className — string
 *
 * Presets (auto-sets color + icon + label):
 *   'ev' | 'petrol' | 'diesel' | 'hybrid' | 'safe' | 'best-value'
 *   | 'highway' | 'city' | 'family' | 'performance' | 'eco'
 *   | 'manual' | 'automatic'
 *
 * Usage:
 *   <StatusBadge preset="ev" />
 *   <StatusBadge preset="safe" />
 *   <StatusBadge color="teal" icon={<Star size={10} />} size="xs">
 *     5-Star NCAP
 *   </StatusBadge>
 *   <StatusBadge color="amber" dot pulse>Live Pricing</StatusBadge>
 */

// ── Color system ──────────────────────────────────────────────
const COLORS = {
  teal:   { solid: 'bg-[#00C8FF] text-[#030308]',            outline: 'border-[#00C8FF]/50 text-[#00C8FF]',            subtle: 'bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/20',   dot: 'bg-[#00C8FF]' },
  amber:  { solid: 'bg-[#FF8C35] text-[#0D0808]',            outline: 'border-[#FF8C35]/50 text-[#FF8C35]',            subtle: 'bg-[#FF8C35]/10 text-[#FF8C35] border border-[#FF8C35]/20',   dot: 'bg-[#FF8C35]' },
  green:  { solid: 'bg-[#00E096] text-[#030D07]',            outline: 'border-[#00E096]/50 text-[#00E096]',            subtle: 'bg-[#00E096]/10 text-[#00E096] border border-[#00E096]/20',   dot: 'bg-[#00E096]' },
  purple: { solid: 'bg-[#8B5CF6] text-white',                outline: 'border-[#8B5CF6]/50 text-[#8B5CF6]',            subtle: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20',   dot: 'bg-[#8B5CF6]' },
  red:    { solid: 'bg-[#EF4444] text-white',                 outline: 'border-[#EF4444]/50 text-[#EF4444]',            subtle: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20',   dot: 'bg-[#EF4444]' },
  blue:   { solid: 'bg-[#3B82F6] text-white',                 outline: 'border-[#3B82F6]/50 text-[#3B82F6]',            subtle: 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20',   dot: 'bg-[#3B82F6]' },
  yellow: { solid: 'bg-[#EAB308] text-[#0D0D00]',            outline: 'border-[#EAB308]/50 text-[#EAB308]',            subtle: 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20',   dot: 'bg-[#EAB308]' },
  zinc:   { solid: 'bg-[#52525B] text-[#F4F4F5]',            outline: 'border-white/20 text-[#A0A0B8]',                subtle: 'bg-white/6 text-[#8888A8] border border-white/10',             dot: 'bg-[#71717A]' },
}

// ── Sizes ─────────────────────────────────────────────────────
const SIZES = {
  xs: 'text-[9px] px-2 py-0.5 gap-1 rounded-md',
  sm: 'text-[11px] px-2.5 py-1 gap-1.5 rounded-lg',
  md: 'text-xs px-3 py-1.5 gap-2 rounded-xl',
}

const ICON_SIZES = { xs: 9, sm: 10, md: 12 }

// ── Built-in icon map ─────────────────────────────────────────
const ICON_MAP = {
  zap: Zap, shield: Shield, leaf: Leaf, flame: Flame, star: Star,
  trophy: Trophy, award: Award, tag: Tag, 'trending-up': TrendingUp,
  'trending-down': TrendingDown, check: Check, x: X, clock: Clock,
  info: Info, fuel: Fuel, battery: Battery, gauge: Gauge,
  users: Users, wrench: Wrench,
}

// ── Automotive presets ────────────────────────────────────────
const PRESETS = {
  ev:          { color: 'teal',   icon: 'battery', label: 'Electric' },
  petrol:      { color: 'amber',  icon: 'fuel',    label: 'Petrol' },
  diesel:      { color: 'blue',   icon: 'fuel',    label: 'Diesel' },
  hybrid:      { color: 'green',  icon: 'leaf',    label: 'Hybrid' },
  safe:        { color: 'green',  icon: 'shield',  label: '5-Star Safe' },
  'best-value':{ color: 'yellow', icon: 'trophy',  label: 'Best Value' },
  highway:     { color: 'purple', icon: 'gauge',   label: 'Highway Pro' },
  city:        { color: 'teal',   icon: 'zap',     label: 'City Pick' },
  family:      { color: 'blue',   icon: 'users',   label: 'Family Ready' },
  performance: { color: 'red',    icon: 'flame',   label: 'Performance' },
  eco:         { color: 'green',  icon: 'leaf',    label: 'Eco Friendly' },
  manual:      { color: 'zinc',   icon: 'wrench',  label: 'Manual' },
  automatic:   { color: 'zinc',   icon: 'gauge',   label: 'Automatic' },
  new:         { color: 'teal',   icon: 'star',    label: 'New 2024' },
  'low-cost':  { color: 'green',  icon: 'tag',     label: 'Low Upkeep' },
}

export default function StatusBadge({
  variant = 'subtle',
  color: colorProp,
  preset,
  size = 'sm',
  icon: iconProp,
  dot = false,
  pulse = false,
  uppercase = false,
  onClick,
  active = false,
  children,
  className,
}) {
  // Resolve preset
  const presetCfg = preset ? (PRESETS[preset] ?? null) : null
  const resolvedColor = colorProp ?? presetCfg?.color ?? 'zinc'
  const resolvedLabel = children ?? presetCfg?.label
  const resolvedIcon = iconProp ?? (presetCfg?.icon ? null : null) // handled below

  // Color config
  const colorCfg = COLORS[resolvedColor] ?? COLORS.zinc

  // Variant class
  const variantClass = (() => {
    if (variant === 'pill') return colorCfg.subtle // pill just changes shape
    if (variant === 'outline') return `border ${colorCfg.outline} bg-transparent`
    if (variant === 'solid') return colorCfg.solid
    return colorCfg.subtle // default: subtle
  })()

  // Icon resolution
  const renderIcon = () => {
    const iconSize = ICON_SIZES[size]
    if (dot) return null
    // Preset icon
    if (presetCfg?.icon && !iconProp) {
      const IconComp = ICON_MAP[presetCfg.icon]
      return IconComp ? <IconComp size={iconSize} aria-hidden /> : null
    }
    // String icon name
    if (typeof iconProp === 'string') {
      const IconComp = ICON_MAP[iconProp]
      return IconComp ? <IconComp size={iconSize} aria-hidden /> : null
    }
    // ReactNode icon
    if (iconProp) return <span aria-hidden>{iconProp}</span>
    return null
  }

  const Tag = onClick ? motion.button : motion.span
  const iconEl = renderIcon()
  const dotColor = colorCfg.dot

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={clsx(
        'inline-flex items-center font-body font-semibold shrink-0',
        'select-none leading-none transition-all duration-150',
        SIZES[size],
        variantClass,
        variant === 'pill' && 'rounded-full',
        uppercase && 'uppercase tracking-wider',
        onClick && 'cursor-pointer hover:opacity-80',
        active && 'ring-1 ring-current ring-offset-1 ring-offset-[#06060C]',
        className
      )}
    >
      {/* Dot indicator */}
      {dot && (
        <span className="relative flex items-center justify-center shrink-0">
          <span className={clsx('w-1.5 h-1.5 rounded-full', dotColor)} />
          {pulse && (
            <span
              className={clsx('absolute w-1.5 h-1.5 rounded-full animate-ping opacity-60', dotColor)}
            />
          )}
        </span>
      )}

      {/* Icon */}
      {iconEl && <span className="shrink-0">{iconEl}</span>}

      {/* Label */}
      {resolvedLabel && <span>{resolvedLabel}</span>}
    </Tag>
  )
}