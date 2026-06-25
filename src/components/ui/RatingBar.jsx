import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import clsx from 'clsx'

/**
 * RatingBar
 *
 * Animated horizontal rating bar.
 * Value → colour auto-grades: green (8+), teal/accent (6+), amber (4+), red (<4)
 *
 * Props:
 *   label       — string
 *   value       — number  (0–max)
 *   max         — number  default 10
 *   showValue   — boolean default true
 *   accentColor — hex string  (used for 6–7.9 range)
 *   delay       — number  animation stagger delay
 *   size        — 'sm' | 'md'  default 'md'
 *   className
 */
export default function RatingBar({
  label,
  value,
  max = 10,
  showValue = true,
  accentColor,
  delay = 0,
  size = 'md',
  className,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })

  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  // Semantic colour based on score
  const barColor =
    value >= 8.5 ? '#00E096' :
    value >= 7.0 ? (accentColor || '#00C8FF') :
    value >= 5.0 ? '#FF8C35' :
    '#EF4444'

  const labelSize  = size === 'sm' ? 'text-xs'  : 'text-sm'
  const valueSize  = size === 'sm' ? 'text-xs'  : 'text-sm'
  const trackHeight = size === 'sm' ? 'h-1'     : 'h-1.5'
  const labelWidth  = size === 'sm' ? 'w-28'    : 'w-36'

  return (
    <div
      ref={ref}
      className={clsx('flex items-center gap-3 group', className)}
    >
      {/* Label */}
      <span
        className={clsx(
          labelSize,
          labelWidth,
          'shrink-0 text-[#6868888] group-hover:text-[#9090B0] transition-colors duration-150 truncate'
        )}
      >
        {label}
      </span>

      {/* Track */}
      <div className={clsx('flex-1 bg-[#1A1A2B] rounded-full overflow-hidden', trackHeight)}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{
            duration: 1.1,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>

      {/* Value */}
      {showValue && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.5, duration: 0.3 }}
          className={clsx(
            valueSize,
            'font-display font-bold w-7 text-right tabular-nums shrink-0'
          )}
          style={{ color: barColor }}
        >
          {value}
        </motion.span>
      )}
    </div>
  )
}