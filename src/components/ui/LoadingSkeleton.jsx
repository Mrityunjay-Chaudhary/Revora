import { motion } from 'framer-motion'
import clsx from 'clsx'

/**
 * LoadingSkeleton
 *
 * A collection of skeleton components for content-aware loading states.
 *
 * Exports:
 *   Skeleton           — base shimmer block (any shape/size)
 *   SkeletonText       — paragraph lines
 *   SkeletonCarCard    — full car card skeleton
 *   SkeletonCarGrid    — grid of car cards (count prop)
 *   SkeletonStatRow    — horizontal stat bar
 *   SkeletonDetailPage — full car detail page skeleton
 *
 * Base Skeleton Props:
 *   width     — string | number     default: '100%'
 *   height    — string | number     default: 16
 *   rounded   — 'sm'|'md'|'lg'|'xl'|'full'   default: 'md'
 *   className — string
 *
 * Usage:
 *   <Skeleton width={120} height={120} rounded="full" />
 *   <SkeletonText lines={3} />
 *   <SkeletonCarGrid count={6} />
 */

// ── Animation ─────────────────────────────────────────────────
const shimmerVariants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 2.2, ease: 'linear', repeat: Infinity },
  },
}

const ROUNDEDS = {
  sm: 'rounded-md',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
}

// ── Base Skeleton ─────────────────────────────────────────────
export function Skeleton({ width = '100%', height = 16, rounded = 'md', className }) {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #0D0D16 25%, #1A1A2B 50%, #0D0D16 75%)',
        backgroundSize: '400% 100%',
      }}
      className={clsx(ROUNDEDS[rounded], 'shrink-0', className)}
      aria-hidden="true"
    />
  )
}

// ── Text Lines ────────────────────────────────────────────────
export function SkeletonText({ lines = 3, lastLineWidth = '60%', className }) {
  return (
    <div className={clsx('flex flex-col gap-2.5', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={13}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          rounded="md"
        />
      ))}
    </div>
  )
}

// ── Car Card Skeleton ─────────────────────────────────────────
export function SkeletonCarCard() {
  return (
    <div
      className="rounded-2xl border border-white/6 bg-[#0D0D16]/60 overflow-hidden"
      aria-hidden="true"
      aria-label="Loading car card"
    >
      {/* Image area */}
      <Skeleton height={200} rounded="sm" className="!rounded-none" />

      <div className="p-5 space-y-4">
        {/* Badge + Brand */}
        <div className="flex items-center justify-between">
          <Skeleton width={80} height={22} rounded="full" />
          <Skeleton width={50} height={14} />
        </div>

        {/* Car name */}
        <div className="space-y-2">
          <Skeleton height={22} width="75%" />
          <Skeleton height={14} width="50%" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 text-center">
              <Skeleton height={18} rounded="md" />
              <Skeleton height={11} width="70%" className="mx-auto" />
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton width={70} height={24} rounded="full" />
          <Skeleton width={90} height={24} rounded="full" />
          <Skeleton width={60} height={24} rounded="full" />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* Buttons */}
        <div className="flex gap-3">
          <Skeleton height={40} rounded="xl" className="flex-1" />
          <Skeleton width={40} height={40} rounded="xl" />
        </div>
      </div>
    </div>
  )
}

// ── Car Grid Skeleton ─────────────────────────────────────────
export function SkeletonCarGrid({ count = 6, className }) {
  return (
    <div
      className={clsx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}
      role="status"
      aria-label="Loading cars…"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.07, duration: 0.3 }}
        >
          <SkeletonCarCard />
        </motion.div>
      ))}
      <span className="sr-only">Loading car listings…</span>
    </div>
  )
}

// ── Stat Row Skeleton ─────────────────────────────────────────
export function SkeletonStatRow({ rows = 5, className }) {
  return (
    <div className={clsx('space-y-3', className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton width={110} height={13} />
          <div className="flex-1">
            <Skeleton height={6} rounded="full" />
          </div>
          <Skeleton width={36} height={13} />
        </div>
      ))}
    </div>
  )
}

// ── Full Detail Page Skeleton ─────────────────────────────────
export function SkeletonDetailPage() {
  return (
    <div
      className="min-h-screen pt-20 px-4 max-w-7xl mx-auto space-y-10"
      role="status"
      aria-label="Loading car details…"
      aria-busy="true"
    >
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton height={400} rounded="xl" />
        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton width={80} height={28} rounded="full" />
            <Skeleton width={100} height={28} rounded="full" />
          </div>
          <Skeleton height={44} width="85%" />
          <Skeleton height={22} width="50%" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-2xl border border-white/6 space-y-2">
                <Skeleton height={11} width="60%" />
                <Skeleton height={22} width="80%" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Skeleton height={48} rounded="xl" className="flex-1" />
            <Skeleton width={48} height={48} rounded="xl" />
            <Skeleton width={48} height={48} rounded="xl" />
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="space-y-4">
        <Skeleton height={28} width={200} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="p-4 rounded-2xl border border-white/6 space-y-2">
              <Skeleton height={11} width="60%" />
              <Skeleton height={18} width="75%" />
            </div>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-4">
        <Skeleton height={28} width={160} />
        <SkeletonStatRow rows={6} />
      </div>

      <span className="sr-only">Loading vehicle details…</span>
    </div>
  )
}

// ── Default export ─────────────────────────────────────────────
export default Skeleton