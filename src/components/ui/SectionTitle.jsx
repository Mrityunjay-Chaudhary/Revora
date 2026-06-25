import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import clsx from 'clsx'

/**
 * SectionTitle
 *
 * Animated section header with optional eyebrow label, title, subtitle, and decorative accent.
 *
 * Props:
 *   eyebrow    — string (small label above title, e.g. "AI-POWERED")
 *   title      — string | ReactNode  (main heading, supports gradient spans)
 *   subtitle   — string | ReactNode  (body text below)
 *   align      — 'left' | 'center' | 'right'      default: 'left'
 *   size       — 'sm' | 'md' | 'lg' | 'xl'        default: 'lg'
 *   accent     — 'teal' | 'amber' | 'purple' | 'none'   default: 'teal'
 *   showLine   — boolean (decorative gradient line)  default: true
 *   animate    — boolean (scroll-triggered)           default: true
 *   tag        — 'h1'|'h2'|'h3'|'h4'               default: 'h2'
 *   action     — ReactNode (button/link placed right of title)
 *   className  — string
 *
 * Usage:
 *   <SectionTitle
 *     eyebrow="Deep Analysis"
 *     title="Compare Vehicles Side-by-Side"
 *     subtitle="Every metric that actually matters for real ownership."
 *     accent="teal"
 *   />
 *
 *   <SectionTitle
 *     title={<>What <span className="text-grad-teal">Actually</span> Fits You</>}
 *     align="center"
 *     size="xl"
 *   />
 */

const ACCENTS = {
  teal:   { eyebrow: 'text-[#00C8FF]', line: 'from-[#00C8FF] via-[#00C8FF]/40 to-transparent', dot: 'bg-[#00C8FF]' },
  amber:  { eyebrow: 'text-[#FF8C35]', line: 'from-[#FF8C35] via-[#FF8C35]/40 to-transparent', dot: 'bg-[#FF8C35]' },
  purple: { eyebrow: 'text-[#8B5CF6]', line: 'from-[#8B5CF6] via-[#8B5CF6]/40 to-transparent', dot: 'bg-[#8B5CF6]' },
  none:   { eyebrow: 'text-[#7070A0]', line: 'from-white/20 via-white/10 to-transparent',        dot: 'bg-white/40' },
}

const SIZES = {
  sm: {
    eyebrow: 'text-[9px]',
    title: 'text-xl sm:text-2xl',
    subtitle: 'text-sm',
    lineH: 'h-[1.5px]',
    lineW: 80,
    gap: 'gap-2',
  },
  md: {
    eyebrow: 'text-[10px]',
    title: 'text-2xl sm:text-3xl',
    subtitle: 'text-sm',
    lineH: 'h-[2px]',
    lineW: 100,
    gap: 'gap-2.5',
  },
  lg: {
    eyebrow: 'text-[10px]',
    title: 'text-3xl sm:text-4xl md:text-5xl',
    subtitle: 'text-base',
    lineH: 'h-[2px]',
    lineW: 140,
    gap: 'gap-3',
  },
  xl: {
    eyebrow: 'text-xs',
    title: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    subtitle: 'text-lg',
    lineH: 'h-[2.5px]',
    lineW: 180,
    gap: 'gap-4',
  },
}

const ALIGNS = {
  left:   { wrap: 'items-start text-left', line: 'mr-auto', subtitle: 'max-w-2xl' },
  center: { wrap: 'items-center text-center', line: 'mx-auto', subtitle: 'max-w-2xl mx-auto' },
  right:  { wrap: 'items-end text-right', line: 'ml-auto', subtitle: 'max-w-2xl ml-auto' },
}

// ── Container animation ───────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  size = 'lg',
  accent = 'teal',
  showLine = true,
  animate = true,
  tag: Heading = 'h2',
  action,
  className,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const ac = ACCENTS[accent] ?? ACCENTS.teal
  const sz = SIZES[size] ?? SIZES.lg
  const al = ALIGNS[align] ?? ALIGNS.left

  const isAnimated = animate && inView

  return (
    <motion.div
      ref={ref}
      variants={animate ? containerVariants : {}}
      initial={animate ? 'hidden' : false}
      animate={animate ? (isAnimated ? 'visible' : 'hidden') : false}
      className={clsx('flex flex-col', sz.gap, al.wrap, className)}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <motion.div
          variants={animate ? itemVariants : {}}
          className={clsx(
            'flex items-center gap-2',
            align === 'center' && 'justify-center',
            align === 'right' && 'justify-end'
          )}
        >
          {/* Dot */}
          <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', ac.dot)} aria-hidden />
          <span
            className={clsx(
              sz.eyebrow,
              'font-display font-semibold uppercase tracking-[0.25em]',
              ac.eyebrow
            )}
          >
            {eyebrow}
          </span>
        </motion.div>
      )}

      {/* Title row */}
      <div className={clsx(
        'flex items-start gap-4',
        align === 'center' && 'flex-col items-center',
        align === 'right' && 'flex-row-reverse items-end',
        action && align !== 'center' && 'w-full justify-between items-end'
      )}>
        <motion.div variants={animate ? itemVariants : {}}>
          <Heading
            className={clsx(
              'font-display font-bold leading-[1.05] tracking-[-0.02em] text-[#F0F0F8]',
              sz.title
            )}
          >
            {title}
          </Heading>
        </motion.div>

        {action && (
          <motion.div variants={animate ? itemVariants : {}} className="shrink-0 pb-1">
            {action}
          </motion.div>
        )}
      </div>

      {/* Decorative line */}
      {showLine && (
        <motion.div
          variants={animate ? lineVariants : {}}
          style={{ width: sz.lineW, transformOrigin: align === 'right' ? 'right' : 'left' }}
          className={clsx(
            sz.lineH,
            'rounded-full bg-gradient-to-r',
            ac.line,
            al.line
          )}
          aria-hidden
        />
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={animate ? itemVariants : {}}
          className={clsx(
            sz.subtitle,
            'text-[#7070A0] leading-relaxed font-body',
            al.subtitle
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}