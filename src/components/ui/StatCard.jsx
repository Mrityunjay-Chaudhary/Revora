import { useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

/**
 * StatCard
 *
 * An animated metric/statistic display card for car data and platform stats.
 *
 * Props:
 *   label      — string           (metric name)
 *   value      — number | string  (main value displayed)
 *   unit       — string           (suffix, e.g. 'kmpl', 'bhp', 'Nm', 'L')
 *   prefix     — string           (prefix, e.g. '₹', '#')
 *   trend      — number | null    (% change; + is up, - is down, 0 is neutral)
 *   trendLabel — string           (label for trend, e.g. 'vs segment avg')
 *   icon       — ReactNode
 *   accent     — 'teal'|'amber'|'purple'|'green'|'zinc'   default: 'zinc'
 *   size       — 'sm' | 'md' | 'lg'                       default: 'md'
 *   variant    — 'default' | 'glass' | 'minimal'          default: 'default'
 *   animateCount — boolean (count-up animation)           default: true
 *   description— string (supporting text)
 *   highlight  — boolean (strong glow/border)             default: false
 *   className  — string
 *
 * Usage:
 *   <StatCard label="Fuel Economy" value={21.5} unit="kmpl" accent="green"
 *             trend={12} trendLabel="vs segment avg" icon={<Gauge />} />
 *
 *   <StatCard label="Ownership Cost" prefix="₹" value="18,000" unit="/yr"
 *             accent="amber" variant="glass" />
 *
 *   <StatCard label="Safety Rating" value="5★" accent="teal" highlight />
 */

const ACCENTS = {
  teal:   { text: 'text-[#00C8FF]',  bg: 'bg-[#00C8FF]/8',  border: 'border-[#00C8FF]/20', glow: '0 0 32px rgba(0,200,255,0.12)',   icon: 'text-[#00C8FF]/70' },
  amber:  { text: 'text-[#FF8C35]',  bg: 'bg-[#FF8C35]/8',  border: 'border-[#FF8C35]/20', glow: '0 0 32px rgba(255,140,53,0.12)',  icon: 'text-[#FF8C35]/70' },
  purple: { text: 'text-[#8B5CF6]',  bg: 'bg-[#8B5CF6]/8',  border: 'border-[#8B5CF6]/20', glow: '0 0 32px rgba(139,92,246,0.12)', icon: 'text-[#8B5CF6]/70' },
  green:  { text: 'text-[#00E096]',  bg: 'bg-[#00E096]/8',  border: 'border-[#00E096]/20', glow: '0 0 32px rgba(0,224,150,0.12)',  icon: 'text-[#00E096]/70' },
  zinc:   { text: 'text-[#A0A0C0]',  bg: 'bg-white/4',       border: 'border-white/10',      glow: 'none',                           icon: 'text-[#7070A0]' },
}

const SIZES = {
  sm: { card: 'p-4 rounded-2xl', label: 'text-xs', value: 'text-2xl', unit: 'text-sm', icon: 'w-8 h-8 text-lg' },
  md: { card: 'p-5 rounded-2xl', label: 'text-xs', value: 'text-3xl', unit: 'text-base', icon: 'w-10 h-10 text-xl' },
  lg: { card: 'p-6 rounded-3xl', label: 'text-sm', value: 'text-4xl', unit: 'text-lg', icon: 'w-12 h-12 text-2xl' },
}

// ── Count-up animation hook ───────────────────────────────────
function useCountUp(target, enabled, duration = 1.2) {
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (v) => {
    if (typeof target !== 'number') return target
    if (Number.isInteger(target)) return Math.round(v).toLocaleString()
    return v.toFixed(1)
  })

  useEffect(() => {
    if (!enabled || typeof target !== 'number') return
    const controls = animate(motionVal, target, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    })
    return controls.stop
  }, [target, enabled])

  return rounded
}

// ── Mini Sparkline (purely decorative SVG bars) ───────────────
function MiniSparkline({ data, color }) {
  if (!data?.length) return null
  const max = Math.max(...data)
  const bars = data.map((v) => Math.max(2, (v / max) * 24))

  return (
    <div className="flex items-end gap-[3px] h-6" aria-hidden>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: h }}
          transition={{ delay: 0.05 * i, duration: 0.4, ease: 'easeOut' }}
          className="w-1 rounded-full"
          style={{ backgroundColor: color ?? '#00C8FF', opacity: 0.4 + (i / bars.length) * 0.6 }}
        />
      ))}
    </div>
  )
}

// ── Trend indicator ───────────────────────────────────────────
function TrendBadge({ trend, trendLabel }) {
  if (trend === null || trend === undefined) return null
  const isUp = trend > 0
  const isFlat = trend === 0
  const Icon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown
  const colorClass = isFlat
    ? 'text-[#7070A0] bg-white/5'
    : isUp
    ? 'text-[#00E096] bg-[#00E096]/10'
    : 'text-[#EF4444] bg-[#EF4444]/10'

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={clsx('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', colorClass)}>
        <Icon size={10} />
        {isFlat ? 'Average' : `${isUp ? '+' : ''}${trend}%`}
      </span>
      {trendLabel && (
        <span className="text-[10px] text-[#505070] truncate">{trendLabel}</span>
      )}
    </div>
  )
}

export default function StatCard({
  label,
  value,
  unit,
  prefix,
  trend = null,
  trendLabel,
  icon,
  accent = 'zinc',
  size = 'md',
  variant = 'default',
  animateCount = true,
  description,
  highlight = false,
  sparklineData,
  className,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  const ac = ACCENTS[accent] ?? ACCENTS.zinc
  const sz = SIZES[size] ?? SIZES.md

  const numericValue = typeof value === 'number' ? value : null
  const countedValue = useCountUp(numericValue, animateCount && inView)
  const displayValue = numericValue !== null
    ? (animateCount ? countedValue : value)
    : value

  const cardStyle = (() => {
    if (variant === 'glass') return 'bg-[#0D0D16]/70 backdrop-blur-xl border border-white/8'
    if (variant === 'minimal') return 'bg-transparent border-0 p-0'
    return clsx('bg-[#0D0D16]/80 backdrop-blur-md border', ac.border)
  })()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={variant !== 'minimal' ? { y: -2, transition: { duration: 0.2 } } : {}}
      style={highlight ? { boxShadow: ac.glow } : {}}
      className={clsx(
        sz.card,
        cardStyle,
        highlight && ac.border,
        'transition-all duration-300 relative overflow-hidden',
        className
      )}
    >
      {/* Accent bar (top) */}
      {highlight && (
        <span
          className={clsx(
            'absolute top-0 left-4 right-4 h-[2px] rounded-b-none rounded-t-full',
            ac.text,
            'bg-current opacity-60'
          )}
          aria-hidden
        />
      )}

      {/* Icon + Label row */}
      <div className="flex items-start justify-between mb-3">
        {label && (
          <span className={clsx(sz.label, 'font-body font-medium text-[#6060808] uppercase tracking-wider leading-none')}>
            {label}
          </span>
        )}
        {icon && (
          <span className={clsx(
            sz.icon,
            'flex items-center justify-center rounded-xl shrink-0',
            ac.bg, ac.icon
          )} aria-hidden>
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5 mb-1">
        {prefix && (
          <span className={clsx('font-display font-bold leading-none mb-0.5', sz.unit, 'text-[#5050708]')}>
            {prefix}
          </span>
        )}
        <motion.span
          className={clsx('font-display font-bold leading-none', sz.value, ac.text)}
        >
          {displayValue}
        </motion.span>
        {unit && (
          <span className={clsx('font-body font-medium leading-none mb-1 text-[#5050708]', sz.unit)}>
            {unit}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-[11px] text-[#505070] leading-snug mt-1 mb-2">{description}</p>
      )}

      {/* Sparkline */}
      {sparklineData && (
        <div className="mt-2 mb-2">
          <MiniSparkline
            data={sparklineData}
            color={accent === 'zinc' ? undefined : ac.text.replace('text-[', '').replace(']', '')}
          />
        </div>
      )}

      {/* Trend */}
      {(trend !== null || trendLabel) && (
        <div className="mt-2">
          <TrendBadge trend={trend} trendLabel={trendLabel} />
        </div>
      )}
    </motion.div>
  )
}