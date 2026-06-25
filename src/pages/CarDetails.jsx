import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Heart, BarChart3, ChevronRight, Search,
  Shield, Check, X, Star, Gauge, Zap,
  Wrench, TrendingUp, TrendingDown, Users,
  Fuel, Car, Navigation2, Layers, Wind,
  Volume2, AlertTriangle, Award, Calendar,
  Clock, BatteryCharging, IndianRupee,
  CheckCircle2, XCircle, Settings, Route,
  Building2, ArrowLeft, SlidersHorizontal,
  Info, Package, Repeat2,
} from 'lucide-react'
import clsx from 'clsx'

import { useApp }     from '../contexts/AppContext'
import { CARS }       from '../data/Cars'
import {
  PrimaryButton, SecondaryButton, GlassCard,
  StatusBadge, SectionTitle, StatCard,
} from '../components/ui'

// ─── Section navigation items ─────────────────────────────────────────────────
const SECTION_NAV = [
  { id: 'overview',   label: 'Overview'    },
  { id: 'specs',      label: 'Specs'       },
  { id: 'safety',     label: 'Safety'      },
  { id: 'ownership',  label: 'Ownership'   },
  { id: 'driving',    label: 'Driving'     },
  { id: 'pros-cons',  label: 'Pros & Cons' },
  { id: 'buyer',      label: 'Who For?'    },
  { id: 'scores',     label: 'AI Scores'   },
  { id: 'related',    label: 'Similar'     },
]

// ─── Shared animation presets ─────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: d, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }


// ══════════════════════════════════════════════════════════════════════════════
// SMALL HELPERS
// ══════════════════════════════════════════════════════════════════════════════

/** Thin section divider that alternates bg for rhythm */
function SectionWrapper({ id, children, alt = false, className }) {
  return (
    <section
      id={id}
      className={clsx(
        'relative py-20 sm:py-28 scroll-mt-[7rem]',
        alt ? 'bg-[#080810]' : 'bg-[#06060C]',
        className,
      )}
    >
      {children}
    </section>
  )
}

/** Full-width container shorthand */
function Container({ children, narrow = false }) {
  return (
    <div className={clsx(
      'w-full mx-auto px-4 sm:px-6',
      narrow ? 'max-w-5xl' : 'max-w-7xl',
    )}>
      {children}
    </div>
  )
}

/** Subtle grid-dot background used in some sections */
function GridBg({ opacity = 0.025 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),' +
          'linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
        backgroundSize: '52px 52px',
        opacity,
      }}
      aria-hidden
    />
  )
}

// ── Animated score bar (0–100 scale for recommendation scores) ────────────────
function ScoreBar({ label, value, icon, delay = 0, accentColor }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const barColor =
    value >= 80 ? '#00E096' :
    value >= 60 ? (accentColor || '#00C8FF') :
    value >= 40 ? '#FF8C35' :
    '#EF4444'

  return (
    <div ref={ref} className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="shrink-0" style={{ color: barColor }} aria-hidden>
              {icon}
            </span>
          )}
          <span className="text-sm font-medium text-[#9090B0]">{label}</span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.9, duration: 0.3 }}
          className="font-display font-bold text-lg leading-none"
          style={{ color: barColor }}
        >
          {value}
          <span className="text-xs font-body font-normal text-[#3A3A5A] ml-0.5">/100</span>
        </motion.span>
      </div>

      {/* Track */}
      <div className="h-3 bg-[#131320] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg, ${barColor}55 0%, ${barColor} 100%)`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.3, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Shine sweep */}
          <motion.div
            className="absolute inset-y-0 w-12 bg-white/20 skew-x-[-18deg]"
            style={{ left: '-3rem' }}
            animate={inView ? { left: '110%' } : {}}
            transition={{ delay: delay + 1.4, duration: 0.5, ease: 'easeOut' }}
          />
        </motion.div>
      </div>
    </div>
  )
}
// Ratingbar by gpt//
function RatingBar({
  label,
  value,
  accentColor = '#00C8FF',
  delay = 0,
}) {
  const percentage = Math.min(100, (value / 10) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-[#9090B0]">
          {label}
        </span>

        <span
          className="font-semibold"
          style={{ color: accentColor }}
        >
          {value}/10
        </span>
      </div>

      <div className="h-2 bg-[#131320] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay,
          }}
          className="h-full rounded-full"
          style={{
            background: accentColor,
          }}
        />
      </div>
    </div>
  )
}
// ── Safety feature check row ───────────────────────────────────────────────────
function SafetyFeatureRow({ label, value }) {
  return (
    <motion.div
      variants={fadeUp}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors duration-200',
        value
          ? 'bg-[#00E096]/5 border-[#00E096]/15 hover:border-[#00E096]/30'
          : 'bg-[#EF4444]/5 border-[#EF4444]/12 hover:border-[#EF4444]/25',
      )}
    >
      {value
        ? <CheckCircle2 size={15} className="text-[#00E096] shrink-0" aria-hidden />
        : <XCircle     size={15} className="text-[#EF4444] shrink-0" aria-hidden />}
      <span className={clsx('text-sm font-medium', value ? 'text-[#C0EED8]' : 'text-[#EEC0C0]')}>
        {label}
      </span>
    </motion.div>
  )
}

// ── Individual spec tile ───────────────────────────────────────────────────────
function SpecTile({ icon, label, value, unit, accentColor, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <GlassCard
        padding="md"
        hoverable
        className="text-center h-full flex flex-col items-center justify-center py-5 gap-3"
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}18` }}
        >
          <span style={{ color: accentColor }} aria-hidden>{icon}</span>
        </div>
        <div>
          <div className="font-display font-bold text-[#EEE8F8] text-xl leading-tight">
            {value}
            {unit && (
              <span className="text-xs font-body font-normal text-[#4A4A6A] ml-1">{unit}</span>
            )}
          </div>
          <div className="text-[10px] text-[#3E3E5E] uppercase tracking-wider mt-0.5">{label}</div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ── Driving feel card ──────────────────────────────────────────────────────────
function DrivingCard({ icon, title, content, accentColor, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <GlassCard padding="lg" hoverable className="h-full">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${accentColor}18` }}
          >
            <span style={{ color: accentColor }} aria-hidden>{icon}</span>
          </div>
          <h3 className="font-display font-bold text-[#E8E8F0] text-lg leading-tight pt-1.5">
            {title}
          </h3>
        </div>
        <p className="text-sm text-[#686888] leading-relaxed">{content}</p>
      </GlassCard>
    </motion.div>
  )
}

// ── Pro / Con item row ─────────────────────────────────────────────────────────
function ProConItem({ text, index, type, delay = 0 }) {
  const ref   = useRef(null)
  const inView = useInView(ref, { once: true })
  const isPro  = type === 'pro'

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: isPro ? -16 : 16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={clsx(
        'flex gap-3.5 p-4 rounded-xl border transition-colors duration-200 group',
        isPro
          ? 'bg-[#00E096]/4 border-[#00E096]/12 hover:border-[#00E096]/25'
          : 'bg-[#FF8C35]/4 border-[#FF8C35]/12 hover:border-[#FF8C35]/25',
      )}
    >
      {/* Number badge */}
      <span
        className={clsx(
          'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5',
          isPro
            ? 'bg-[#00E096]/15 text-[#00E096]'
            : 'bg-[#FF8C35]/15 text-[#FF8C35]',
        )}
        aria-hidden
      >
        {index + 1}
      </span>
      <p
        className={clsx(
          'text-sm leading-relaxed',
          isPro ? 'text-[#C8EEE0]' : 'text-[#EED8C8]',
        )}
      >
        {text}
      </p>
    </motion.li>
  )
}

// ── Buyer profile card (idealFor / avoidIf) ────────────────────────────────────
function BuyerCard({ text, type, delay = 0 }) {
  const ref    = useRef(null)
  const inView  = useInView(ref, { once: true })
  const isIdeal = type === 'ideal'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={clsx(
        'flex gap-3 p-4 rounded-xl border',
        isIdeal
          ? 'bg-[#00E096]/5 border-[#00E096]/15'
          : 'bg-[#FF8C35]/5 border-[#FF8C35]/15',
      )}
    >
      <span
        className={clsx(
          'w-7 h-7 rounded-xl flex items-center justify-center shrink-0',
          isIdeal ? 'bg-[#00E096]/15' : 'bg-[#FF8C35]/15',
        )}
        aria-hidden
      >
        {isIdeal
          ? <Check size={14} className="text-[#00E096]" />
          : <AlertTriangle size={13} className="text-[#FF8C35]" />}
      </span>
      <p className={clsx('text-sm leading-relaxed', isIdeal ? 'text-[#C8EEE0]' : 'text-[#EED8C8]')}>
        {text}
      </p>
    </motion.div>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — HERO
// ══════════════════════════════════════════════════════════════════════════════
function HeroSection({ car, accentColor }) {
  const navigate = useNavigate()
  const { toggleSaved, isSaved, addToComparison, isInComparison } = useApp()
  const saved  = isSaved(car.id)
  const inComp = isInComparison(car.id)

  const isEV     = car.fuelType === 'electric' || car.category === 'ev'
  const mileageDisplay = isEV
    ? `${car.specs?.range || '—'} km`
    : `${car.specs?.mileage || '—'} kmpl`

  const quickStats = [
    { icon: <Gauge size={13} />,    label: mileageDisplay,           key: 'mileage' },
    { icon: <Zap size={13} />,      label: car.specs?.power || '—',  key: 'power'   },
    { icon: <Settings size={13} />, label: car.specs?.torque || '—', key: 'torque'  },
    car.safetyRating?.gncap && {
      icon: <Shield size={13} />,
      label: `${car.safetyRating.gncap}★ NCAP`,
      key:   'ncap',
    },
    car.specs?.acceleration && {
      icon: <Route size={13} />,
      label: car.specs.acceleration,
      key:   'accel',
    },
  ].filter(Boolean)

  return (
    <section
      id="overview"
      className="relative min-h-[100svh] flex items-center overflow-hidden scroll-mt-0"
      aria-label="Car overview"
    >
      {/* ── Background layers ── */}
      {/* Gradient base */}
      <div className={clsx('absolute inset-0 bg-gradient-to-br', car.gradient || 'from-slate-900 to-[#06060C]')} />

      {/* Grid overlay */}
      <GridBg opacity={0.03} />

      {/* Accent radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 65% 80% at 15% 45%, ${accentColor}0F 0%, transparent 60%)`,
        }}
        aria-hidden
      />

      {/* Bottom fade-to-page */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#06060C] to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Breadcrumb */}
        <motion.nav
          variants={fadeUp} custom={0}
          initial="hidden" animate="visible"
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-[#2E2E4A] mb-10"
        >
          <Link to="/"          className="hover:text-[#606080] transition-colors">Home</Link>
          <ChevronRight size={11} aria-hidden />
          <Link to="/discover"  className="hover:text-[#606080] transition-colors">Discover</Link>
          <ChevronRight size={11} aria-hidden />
          <span className="text-[#4A4A6A]">{car.brand}</span>
          <ChevronRight size={11} aria-hidden />
          <span style={{ color: accentColor }}>{car.model || car.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 xl:gap-20 items-center">

          {/* ── Left: Main info ── */}
          <div>
            {/* Tag row */}
            <motion.div variants={fadeUp} custom={0.05} initial="hidden" animate="visible"
              className="flex flex-wrap items-center gap-2 mb-6">
              {car.badge && (
                <StatusBadge color="zinc" variant="solid" size="sm">
                  {car.badge}
                </StatusBadge>
              )}
              <StatusBadge preset={car.fuelType} size="sm" />
              <StatusBadge color="zinc" size="sm" className="capitalize">
                {car.transmission}
              </StatusBadge>
              {car.year && (
                <StatusBadge color="zinc" size="sm">{car.year}</StatusBadge>
              )}
              {isEV && (
                <StatusBadge color="green" dot size="sm">Zero Emission</StatusBadge>
              )}
            </motion.div>

            {/* Brand label */}
            <motion.p variants={fadeUp} custom={0.1} initial="hidden" animate="visible"
              className="font-body font-semibold text-xs uppercase tracking-[0.25em] text-[#4A4A6A] mb-3">
              {car.brand}
            </motion.p>

            {/* Car name — giant display */}
            <motion.h1
              variants={fadeUp} custom={0.15}
              initial="hidden" animate="visible"
              className="font-display font-black tracking-[-0.025em] leading-[0.93] mb-5"
              style={{ fontSize: 'clamp(3.8rem, 11vw, 8rem)' }}
            >
              <span
                style={{
                  background: `linear-gradient(140deg, #F0F0F8 25%, ${accentColor} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {car.model || car.name}
              </span>
            </motion.h1>

            {/* Variant + meta */}
            <motion.div variants={fadeUp} custom={0.2} initial="hidden" animate="visible"
              className="mb-8">
              <p className="text-base text-[#7070A0] mb-1.5 font-medium">{car.variant}</p>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-[#3A3A5A]">
                {car.year         && <span>{car.year} Model</span>}
                {car.year         && <span>·</span>}
                {(car.bodyType || car.category) && (
                  <span className="capitalize">{car.bodyType || car.category}</span>
                )}
                {car.seating && <><span>·</span><span>{car.seating} Seats</span></>}
                {car.specs?.driveType && <><span>·</span><span>{car.specs.driveType}</span></>}
              </div>
            </motion.div>

            {/* Quick-stat chips */}
            <motion.div variants={fadeUp} custom={0.25} initial="hidden" animate="visible"
              className="flex flex-wrap gap-2 mb-10">
              {quickStats.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/6 border border-white/10 text-sm text-[#B0B0C8] backdrop-blur-sm"
                >
                  <span style={{ color: accentColor }} aria-hidden>{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp} custom={0.3}
              initial="hidden" animate="visible"
              className="flex flex-wrap gap-3"
            >
              <PrimaryButton
                variant={saved ? 'amber' : 'teal'}
                size="lg"
                icon={<Heart size={17} fill={saved ? 'currentColor' : 'none'} />}
                onClick={() => toggleSaved(car.id)}
                glow
              >
                {saved ? 'Saved' : 'Save Car'}
              </PrimaryButton>

              <SecondaryButton
                variant={inComp ? 'outline-teal' : 'outline'}
                size="lg"
                icon={<BarChart3 size={17} />}
                active={inComp}
                onClick={() => addToComparison(car.id)}
              >
                {inComp ? 'In Compare' : 'Compare'}
              </SecondaryButton>

              <SecondaryButton
                variant="ghost"
                size="lg"
                icon={<Search size={17} />}
                onClick={() => navigate(`/discover?category=${car.category}`)}
              >
                Similar Cars
              </SecondaryButton>
            </motion.div>
          </div>

          {/* ── Right: Price card ── */}
          <motion.div
            variants={fadeUp} custom={0.25}
            initial="hidden" animate="visible"
          >
            <GlassCard variant="elevated" padding="none" accent="teal" glow className="overflow-hidden">
              {/* Accent stripe */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}55)` }}
                aria-hidden
              />

              <div className="p-7">
                {/* Price */}
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3A3A5A] mb-2">
                  Starting from
                </p>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="font-body text-sm text-[#505070] mb-3.5">₹</span>
                  <span
                    className="font-display font-black text-5xl xl:text-6xl leading-none"
                    style={{ color: accentColor }}
                  >
                    {car.price?.min?.toFixed(2) ?? '—'}
                  </span>
                  <span className="font-body text-base text-[#4A4A6A] mb-1.5">Lakh</span>
                </div>

                {car.price?.max && (
                  <p className="text-xs text-[#3A3A5A] mb-5">
                    Up to <strong className="text-[#606080]">₹{car.price.max.toFixed(2)} Lakh</strong> (top variant)
                  </p>
                )}

                {/* Price range bar */}
                {car.price?.min && car.price?.max && (
                  <div className="mb-6">
                    <div className="relative h-2 bg-[#131320] rounded-full overflow-hidden">
                      <motion.div
                         className="absolute left-0 top-0 h-full rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 1,
                            delay: 0.6,
                            ease: 'easeOut',
                          }}
                          style={{
                            transformOrigin: 'left',
                            background: `linear-gradient(90deg, ${accentColor}55, ${accentColor})`,
                            width: `${Math.min(
                              100,
                              ((car.price.max - car.price.min) / car.price.max) * 100 + 30
                            )}%`,
                          }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#2E2E4A] mt-1.5">
                      <span>₹{car.price.min}L Base</span>
                      <span>₹{car.price.max}L Top Trim</span>
                    </div>
                  </div>
                )}

                <div className="h-px bg-white/6 mb-5" />

                {/* NCAP stars */}
                {car.safetyRating?.gncap && (
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A] mb-2">
                      Global NCAP
                    </p>
                    <div className="flex items-center gap-1" aria-label={`${car.safetyRating.gncap} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.7 + i * 0.07, type: 'spring', stiffness: 400 }}
                        >
                          <Star
                            size={18}
                            fill={i < car.safetyRating.gncap ? '#FFB800' : 'none'}
                            className={i < car.safetyRating.gncap ? 'text-[#FFB800]' : 'text-[#2A2A3A]'}
                            aria-hidden
                          />
                        </motion.div>
                      ))}
                      <span className="font-display font-bold text-[#FFB800] text-base ml-1.5">
                        {car.safetyRating.gncap}/5
                      </span>
                    </div>
                  </div>
                )}

                {/* Ownership cost teaser */}
                {car.ownership?.averageAnnualServiceCost && (
                  <div className="flex items-center justify-between py-3 border-t border-white/6">
                    <span className="text-xs text-[#4A4A6A]">Est. Annual Service</span>
                    <span className="text-sm font-semibold" style={{ color: accentColor }}>
                      ₹{(car.ownership.averageAnnualServiceCost / 1000).toFixed(0)}K/yr
                    </span>
                  </div>
                )}

                {/* Insurance teaser */}
                {car.ownership?.insuranceCostEstimate && (
                  <div className="flex items-center justify-between py-3 border-t border-white/6">
                    <span className="text-xs text-[#4A4A6A]">Insurance (approx.)</span>
                    <span className="text-xs font-medium text-[#686888]">
                      {car.ownership.insuranceCostEstimate}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/12 flex items-start justify-center pt-1.5 mx-auto"
        >
          <div className="w-1 h-2.5 rounded-full" style={{ background: accentColor }} />
        </motion.div>
      </motion.div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — QUICK SPECS GRID
// ══════════════════════════════════════════════════════════════════════════════
function QuickSpecsSection({ car, accentColor }) {
  const isEV = car.fuelType === 'electric' || car.category === 'ev'
  const { specs, safetyRating, seating } = car

  const specItems = [
    {
      icon: <Gauge size={20} />,
      label: isEV ? 'Range' : 'ARAI Mileage',
      value: isEV ? (specs?.range || '—') : (specs?.mileage || '—'),
      unit: isEV ? 'km' : 'kmpl',
    },
    {
      icon: <Zap size={20} />,
      label: 'Max Power',
      value: specs?.power?.split('@')[0]?.trim() || '—',
    },
    {
      icon: <Settings size={20} />,
      label: 'Peak Torque',
      value: specs?.torque?.split('@')[0]?.trim() || '—',
    },
    specs?.topSpeed && {
      icon: <Wind size={20} />,
      label: 'Top Speed',
      value: specs.topSpeed,
    },
    specs?.acceleration && {
      icon: <Route size={20} />,
      label: '0–100 km/h',
      value: specs.acceleration,
    },
    {
      icon: <SlidersHorizontal size={20} />,
      label: 'Transmission',
      value: specs?.transmission || car.transmission || '—',
    },
    {
      icon: <Navigation2 size={20} />,
      label: 'Drive System',
      value: specs?.driveType || car.drivetrain || '—',
    },
    {
      icon: <Users size={20} />,
      label: 'Seating',
      value: seating || specs?.seating || '—',
      unit: 'seats',
    },
    {
      icon: <Package size={20} />,
      label: 'Boot Space',
      value: specs?.bootSpace || '—',
      unit: typeof specs?.bootSpace === 'number' ? 'L' : '',
    },
    {
      icon: <Layers size={20} />,
      label: 'Ground Clearance',
      value: specs?.groundClearance || '—',
      unit: typeof specs?.groundClearance === 'number' ? 'mm' : '',
    },
    specs?.fuelTankCapacity && {
      icon: isEV ? <BatteryCharging size={20} /> : <Fuel size={20} />,
      label: isEV ? 'Battery' : 'Fuel Tank',
      value: specs.fuelTankCapacity,
      unit: isEV ? 'kWh' : 'L',
    },
    specs?.tyres && {
      icon: <Car size={20} />,
      label: 'Tyre Size',
      value: specs.tyres,
    },
    specs?.kerbWeight && {
      icon: <Layers size={20} />,
      label: 'Kerb Weight',
      value: specs.kerbWeight,
    },
    specs?.wheelbase && {
      icon: <Repeat2 size={20} />,
      label: 'Wheelbase',
      value: specs.wheelbase,
      unit: 'mm',
    },
  ].filter(Boolean)

  return (
    <SectionWrapper id="specs" alt>
      <GridBg opacity={0.02} />
      <Container>
        <div className="mb-12">
          <SectionTitle
            eyebrow="Technical Specifications"
            title="Under the hood."
            subtitle="Every measurement that shapes the real driving experience."
            accent="teal"
            size="md"
          />
        </div>

        {/* Engine callout */}
        {specs?.engine && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <GlassCard variant="elevated" padding="md" accent="teal" className="inline-flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${accentColor}18` }}
              >
                <Settings size={18} style={{ color: accentColor }} aria-hidden />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A]">Engine</p>
                <p className="font-display font-bold text-[#E8E8F0] text-lg">{specs.engine}</p>
                {specs.displacement && (
                  <p className="text-xs text-[#4A4A6A]">{specs.displacement}</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {specItems.map((item, i) => (
            <SpecTile
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              unit={item.unit}
              accentColor={accentColor}
              delay={i * 0.05}
            />
          ))}
        </div>

        {/* Dimensions row */}
        {(specs?.length || specs?.width || specs?.height) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <GlassCard padding="md" className="grid grid-cols-3 divide-x divide-white/8">
              {[
                { label: 'Length', val: specs.length, unit: 'mm' },
                { label: 'Width',  val: specs.width,  unit: 'mm' },
                { label: 'Height', val: specs.height, unit: 'mm' },
              ].map((d) => d.val && (
                <div key={d.label} className="text-center px-4 py-2">
                  <div className="font-display font-bold text-[#E8E8F0] text-xl">{d.val}</div>
                  <div className="text-[10px] text-[#3A3A5A] uppercase tracking-wider">{d.label} ({d.unit})</div>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        )}
      </Container>
    </SectionWrapper>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — SAFETY BREAKDOWN
// ══════════════════════════════════════════════════════════════════════════════
function SafetySection({ car, accentColor }) {
  const { safetyRating, ratings } = car
  if (!safetyRating) return null

  const features = [
    { label: 'Anti-Lock Braking System (ABS)',          value: safetyRating.abs              },
    { label: 'Electronic Stability Programme (ESP)',     value: safetyRating.esp              },
    { label: 'Hill-Start Assist',                        value: safetyRating.hillAssist       },
    { label: 'Rear-View Camera',                         value: safetyRating.rearCamera       },
    { label: 'Blind-Spot Monitor (BSM)',                 value: safetyRating.blindSpotMonitor },
  ].filter((f) => f.value !== undefined)

  return (
    <SectionWrapper id="safety">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* Left: NCAP + safety score */}
          <div>
            <div className="mb-10">
              <SectionTitle
                eyebrow="Safety Analysis"
                title={
                  <>
                    Built to{' '}
                    <span style={{
                      background: 'linear-gradient(135deg,#00E096,#00A86B)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      protect.
                    </span>
                  </>
                }
                accent="green"
                size="md"
              />
            </div>

            {/* NCAP hero */}
            {safetyRating.gncap && (
              <GlassCard variant="elevated" padding="lg" className="mb-6" accent="green" glow>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#3A3A5A] mb-3">
                  Global NCAP Adult Protection
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 350 }}
                    >
                      <Star
                        size={28}
                        fill={i < safetyRating.gncap ? '#FFB800' : 'none'}
                        className={i < safetyRating.gncap ? 'text-[#FFB800]' : 'text-[#1E1E2E]'}
                        aria-hidden
                      />
                    </motion.div>
                  ))}
                  <span className="font-display font-black text-3xl text-[#FFB800] ml-1">
                    {safetyRating.gncap}/5
                  </span>
                </div>

                <p className="text-xs text-[#505070] leading-relaxed">
                  {safetyRating.gncap === 5
                    ? 'Maximum 5-star rating — among the safest vehicles crash-tested in its category.'
                    : safetyRating.gncap >= 4
                    ? 'Strong safety result — offers robust protection in most collision scenarios.'
                    : safetyRating.gncap >= 3
                    ? 'Acceptable safety standard — meets minimum crash protection benchmarks.'
                    : 'Below average crash protection — consider safety upgrades or alternative models.'}
                </p>
              </GlassCard>
            )}

            {/* Airbags */}
            <GlassCard padding="md" className="flex items-center gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${accentColor}15` }}
              >
                <Shield size={24} style={{ color: accentColor }} aria-hidden />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A] mb-0.5">Airbags</p>
                <p className="font-display font-black text-4xl leading-none" style={{ color: accentColor }}>
                  {safetyRating.airbags}
                </p>
                <p className="text-xs text-[#505070] mt-0.5">Standard airbag count</p>
              </div>
            </GlassCard>

            {/* Safety rating bar */}
            {ratings?.safety && (
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A] mb-3">Overall Safety Score</p>
                <RatingBar
                  label="Safety Rating"
                  value={ratings.safety}
                  accentColor={accentColor}
                  size="md"
                />
              </div>
            )}
          </div>

          {/* Right: Safety features */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A] mb-5">Safety Features</p>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-2.5"
            >
              {features.map((f) => (
                <SafetyFeatureRow key={f.label} label={f.label} value={f.value} />
              ))}
            </motion.div>

            {/* ADAS note */}
            {safetyRating.blindSpotMonitor || safetyRating.abs ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 rounded-xl bg-[#00C8FF]/5 border border-[#00C8FF]/12"
              >
                <div className="flex gap-2.5">
                  <Info size={14} className="text-[#00C8FF] shrink-0 mt-0.5" aria-hidden />
                  <p className="text-xs text-[#686888] leading-relaxed">
                    Availability of safety features varies by variant. Verify with the dealer which
                    safety systems are standard vs. optional on your chosen trim level.
                  </p>
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — REAL OWNERSHIP INSIGHTS
// ══════════════════════════════════════════════════════════════════════════════
function OwnershipSection({ car, accentColor }) {
  const { ownership } = car
  if (!ownership) return null

  const maintenanceTier = {
    low:    { color: '#00E096', label: 'Low Cost',    bg: '#00E096' },
    medium: { color: '#FF8C35', label: 'Moderate',    bg: '#FF8C35' },
    high:   { color: '#EF4444', label: 'Higher Cost', bg: '#EF4444' },
  }
  const tier = maintenanceTier[ownership.maintenanceCost] ?? maintenanceTier.medium

  const resaleMap = {
    excellent: { color: '#00E096', pct: 90 },
    good:      { color: '#00C8FF', pct: 70 },
    average:   { color: '#FF8C35', pct: 50 },
    poor:      { color: '#EF4444', pct: 25 },
  }
  const resale = resaleMap[ownership.resaleStrength] ?? resaleMap.average

  return (
    <SectionWrapper id="ownership" alt>
      <GridBg opacity={0.018} />
      <Container>
        <div className="mb-14">
          <SectionTitle
            eyebrow="Ownership Intelligence"
            title={
              <>
                The full{' '}
                <span style={{
                  background: 'linear-gradient(135deg,#FF8C35,#FF5500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  financial picture.
                </span>
              </>
            }
            subtitle="What you'll actually spend after driving out of the showroom."
            accent="amber"
            size="md"
          />
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {ownership.averageAnnualServiceCost && (
            <StatCard
              label="Annual Service Cost"
              prefix="₹"
              value={ownership.averageAnnualServiceCost.toLocaleString('en-IN')}
              unit="/yr"
              accent="amber"
              icon={<Wrench size={20} />}
              description="Typical scheduled service cost per year"
              animateCount={false}
            />
          )}
          {ownership.depreciationIn5Years && (
            <StatCard
              label="5-Year Depreciation"
              value={ownership.depreciationIn5Years}
              accent="purple"
              icon={<TrendingDown size={20} />}
              description="Typical value loss over five years of ownership"
            />
          )}
          {ownership.warrantyYears && (
            <StatCard
              label="Warranty"
              value={ownership.warrantyYears}
              unit="years"
              accent="teal"
              icon={<Shield size={20} />}
              description={ownership.warrantyKm ? `Or ${ownership.warrantyKm}` : ''}
              animateCount
            />
          )}
          {ownership.expectedResaleAt5Years && (
            <StatCard
              label="Est. Resale @ 5 Years"
              value={ownership.expectedResaleAt5Years}
              accent="green"
              icon={<IndianRupee size={20} />}
              description="Market estimate for well-maintained units"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Maintenance + resale */}
          <GlassCard padding="lg">
            {/* Maintenance cost tier */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A]">Maintenance Tier</p>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: `${tier.bg}18`, color: tier.color, border: `1px solid ${tier.bg}30` }}
              >
                {tier.label}
              </span>
            </div>

            {/* Service interval */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {ownership.serviceIntervalKm && (
                <div className="p-3 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-[10px] text-[#3A3A5A] mb-1 uppercase tracking-wider">Service Interval</p>
                  <p className="font-display font-bold text-[#E8E8F0] text-sm">{ownership.serviceIntervalKm}</p>
                </div>
              )}
              {ownership.firstServiceKm && (
                <div className="p-3 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-[10px] text-[#3A3A5A] mb-1 uppercase tracking-wider">First Service</p>
                  <p className="font-display font-bold text-[#E8E8F0] text-sm">{ownership.firstServiceKm}</p>
                </div>
              )}
            </div>

            {/* Resale strength bar */}
            <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A] mb-3">Resale Strength</p>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex-1 h-2.5 bg-[#131320] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${resale.color}55, ${resale.color})` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${resale.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
              <span className="text-sm font-display font-bold capitalize" style={{ color: resale.color }}>
                {ownership.resaleStrength}
              </span>
            </div>

            {/* Service availability */}
            {ownership.serviceCentersAvailability && (
              <div className="mt-5 pt-5 border-t border-white/6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#606080]">Service Network</span>
                  <span className="font-semibold capitalize text-[#A0A0C0]">
                    {ownership.serviceCentersAvailability}
                  </span>
                </div>
              </div>
            )}
            {ownership.sparePartsAvailability && (
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-[#606080]">Spare Parts</span>
                <span className="font-semibold capitalize text-[#A0A0C0]">
                  {ownership.sparePartsAvailability}
                </span>
              </div>
            )}
          </GlassCard>

          {/* Common issues */}
          {ownership.commonIssues?.length > 0 && (
            <GlassCard padding="lg">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#FF8C35]/12 flex items-center justify-center">
                  <AlertTriangle size={15} className="text-[#FF8C35]" aria-hidden />
                </div>
                <p className="text-sm font-semibold text-[#D0D0E8]">Known Owner-Reported Issues</p>
              </div>
              <ul className="space-y-3">
                {ownership.commonIssues.map((issue, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 text-sm text-[#7070A0] leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C35]/60 shrink-0 mt-2" />
                    {issue}
                  </motion.li>
                ))}
              </ul>

              {/* Insurance note */}
              {ownership.insuranceCostEstimate && (
                <div className="mt-5 pt-5 border-t border-white/6 flex items-start gap-2.5">
                  <IndianRupee size={14} className="text-[#00C8FF] shrink-0 mt-0.5" aria-hidden />
                  <p className="text-xs text-[#505070] leading-relaxed">
                    <strong className="text-[#7070A0] font-semibold">Insurance:</strong>{' '}
                    {ownership.insuranceCostEstimate}
                  </p>
                </div>
              )}
            </GlassCard>
          )}
        </div>
      </Container>
    </SectionWrapper>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — DRIVING EXPERIENCE
// ══════════════════════════════════════════════════════════════════════════════
function DrivingSection({ car, accentColor }) {
  const { drivingFeel } = car
  if (!drivingFeel) return null

  const cards = [
    {
      icon: <Building2 size={18} />,
      title: 'City Comfort',
      content: drivingFeel.cityComfort,
    },
    {
      icon: <Route size={18} />,
      title: 'Highway Stability',
      content: drivingFeel.highwayStability,
    },
    {
      icon: <Navigation2 size={18} />,
      title: 'Steering Feedback',
      content: drivingFeel.steeringFeedback,
    },
    {
      icon: <Gauge size={18} />,
      title: 'Ride Quality',
      content: drivingFeel.rideQuality,
    },
    {
      icon: <Volume2 size={18} />,
      title: 'Noise & Refinement',
      content: drivingFeel.noiseLevels,
    },
  ].filter((c) => c.content)

  // Ratings relevant to driving
  const { ratings } = car
  const drivingRatings = [
    { label: 'City Driving',     value: ratings?.cityDriving     },
    { label: 'Highway Driving',  value: ratings?.highwayDriving  },
    { label: 'Performance',      value: ratings?.performance     },
    { label: 'Comfort',          value: ratings?.comfort         },
    { label: 'Reliability',      value: ratings?.reliability     },
  ].filter((r) => r.value !== undefined)

  return (
    <SectionWrapper id="driving">
      <Container>
        <div className="mb-14">
          <SectionTitle
            eyebrow="Driving Experience"
            title="How it actually feels."
            subtitle="Insights from real road experience — not manufacturer descriptions."
            accent="teal"
            size="md"
          />
        </div>

        {/* Driving rating bars */}
        {drivingRatings.length > 0 && (
          <div className="mb-12">
            <GlassCard padding="lg" className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A] mb-5">
                Driving Performance Ratings
              </p>
              <div className="space-y-4">
                {drivingRatings.map((r, i) => (
                  <RatingBar
                    key={r.label}
                    label={r.label}
                    value={r.value}
                    accentColor={accentColor}
                    delay={i * 0.1}
                  />
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Driving feel cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <DrivingCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              content={card.content}
              accentColor={accentColor}
              delay={i * 0.1}
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — PROS & CONS
// ══════════════════════════════════════════════════════════════════════════════
function ProsConsSection({ car }) {
  const { pros = [], cons = [] } = car

  return (
    <SectionWrapper id="pros-cons" alt>
      <Container>
        <div className="mb-14">
          <SectionTitle
            eyebrow="Strengths & Weaknesses"
            title="The real ownership truth."
            subtitle="Honest, practical analysis — not marketing language."
            accent="teal"
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pros */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#00E096]/12 flex items-center justify-center">
                <Award size={15} className="text-[#00E096]" aria-hidden />
              </div>
              <h2 className="font-display font-bold text-[#E8E8F0] text-xl">
                Why it works
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00E096]/12 text-[#00E096]">
                {pros.length} strengths
              </span>
            </div>
            <ul className="space-y-3">
              {pros.map((pro, i) => (
                <ProConItem key={i} text={pro} index={i} type="pro" delay={i * 0.07} />
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#FF8C35]/12 flex items-center justify-center">
                <AlertTriangle size={15} className="text-[#FF8C35]" aria-hidden />
              </div>
              <h2 className="font-display font-bold text-[#E8E8F0] text-xl">
                Where it falls short
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FF8C35]/12 text-[#FF8C35]">
                {cons.length} caveats
              </span>
            </div>
            <ul className="space-y-3">
              {cons.map((con, i) => (
                <ProConItem key={i} text={con} index={i} type="con" delay={i * 0.07} />
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — WHO SHOULD BUY
// ══════════════════════════════════════════════════════════════════════════════
function BuyerSection({ car }) {
  const { idealFor = [], avoidIf = [] } = car

  return (
    <SectionWrapper id="buyer">
      <Container>
        <div className="mb-14">
          <SectionTitle
            eyebrow="Buyer Intelligence"
            title="Who should — and shouldn't — buy this."
            subtitle="Based on lifestyle, usage patterns, and realistic ownership expectations."
            accent="amber"
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ideal for */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#00E096]/12 flex items-center justify-center">
                <Users size={15} className="text-[#00E096]" aria-hidden />
              </div>
              <h2 className="font-display font-bold text-[#E8E8F0] text-xl">Perfect for</h2>
            </div>
            <div className="space-y-3">
              {idealFor.map((item, i) => (
                <BuyerCard key={i} text={item} type="ideal" delay={i * 0.08} />
              ))}
            </div>
          </div>

          {/* Avoid if */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#FF8C35]/12 flex items-center justify-center">
                <XCircle size={15} className="text-[#FF8C35]" aria-hidden />
              </div>
              <h2 className="font-display font-bold text-[#E8E8F0] text-xl">Avoid if</h2>
            </div>
            <div className="space-y-3">
              {avoidIf.map((item, i) => (
                <BuyerCard key={i} text={item} type="avoid" delay={i * 0.08} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — ALL RATINGS + RECOMMENDATION SCORES
// ══════════════════════════════════════════════════════════════════════════════
function ScoresSection({ car, accentColor }) {
  const { ratings, recommendationScores } = car
  if (!ratings && !recommendationScores) return null

  const ratingItems = [
    { label: 'Overall Rating',       value: ratings?.overall         },
    { label: 'Performance',          value: ratings?.performance     },
    { label: 'Comfort',              value: ratings?.comfort         },
    { label: 'Safety',               value: ratings?.safety          },
    { label: 'Fuel Efficiency',      value: ratings?.fuelEfficiency  },
    { label: 'Maintenance Cost',     value: ratings?.maintenance     },
    { label: 'Resale Value',         value: ratings?.resaleValue     },
    { label: 'City Driving',         value: ratings?.cityDriving     },
    { label: 'Highway Driving',      value: ratings?.highwayDriving  },
    { label: 'Family Friendliness',  value: ratings?.familyFriendliness },
    { label: 'Reliability',          value: ratings?.reliability     },
    { label: 'Value for Money',      value: ratings?.valueForMoney   },
  ].filter((r) => r.value !== undefined)

  const scoreItems = [
    { label: 'City Commuter',      value: recommendationScores?.cityCommuter,    icon: <Building2 size={15} />   },
    { label: 'Family Vehicle',     value: recommendationScores?.familyVehicle,   icon: <Users size={15} />       },
    { label: 'Long Distance',      value: recommendationScores?.longDistance,    icon: <Route size={15} />       },
    { label: 'First-Time Buyer',   value: recommendationScores?.firstTimeBuyer,  icon: <Star size={15} />        },
    { label: 'Performance Seeker', value: recommendationScores?.performanceSeeker, icon: <Zap size={15} />      },
    { label: 'Budget Conscious',   value: recommendationScores?.budgetConscious,  icon: <IndianRupee size={15} /> },
  ].filter((s) => s.value !== undefined)

  // Overall score (average of all ratings)
  const avgRating = ratings
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
    : null

  return (
    <SectionWrapper id="scores" alt>
      <GridBg opacity={0.018} />
      <Container>
        <div className="mb-14">
          <SectionTitle
            eyebrow="AI Compatibility Scores"
            title="How well does it fit your life?"
            subtitle="REVORA's scoring model evaluates each use-case against real-world ownership data."
            accent="purple"
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ratings panel */}
          {ratingItems.length > 0 && (
            <GlassCard variant="elevated" padding="lg">
              {/* Overall score hero */}
              {avgRating && (
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A] mb-1">
                      Overall REVORA Rating
                    </p>
                    <p className="text-xs text-[#4A4A6A]">Composite across 12 categories</p>
                  </div>
                  <div className="text-right">
                    <span
                      className="font-display font-black text-5xl leading-none"
                      style={{ color: accentColor }}
                    >
                      {avgRating}
                    </span>
                    <span className="text-sm text-[#3A3A5A] font-body">/10</span>
                  </div>
                </div>
              )}

              <div className="space-y-3.5">
                {ratingItems.map((r, i) => (
                  <RatingBar
                    key={r.label}
                    label={r.label}
                    value={r.value}
                    accentColor={accentColor}
                    delay={i * 0.06}
                  />
                ))}
              </div>
            </GlassCard>
          )}

          {/* Recommendation scores */}
          {scoreItems.length > 0 && (
            <GlassCard variant="elevated" padding="lg">
              <p className="text-[10px] uppercase tracking-widest text-[#3A3A5A] mb-6">
                Lifestyle Match Scores
              </p>
              <div className="space-y-6">
                {scoreItems.map((s, i) => (
                  <ScoreBar
                    key={s.label}
                    label={s.label}
                    value={s.value}
                    icon={s.icon}
                    delay={i * 0.12}
                    accentColor={accentColor}
                  />
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </Container>
    </SectionWrapper>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — RELATED CARS
// ══════════════════════════════════════════════════════════════════════════════
function RelatedSection({ car, accentColor }) {
  const related = CARS.filter((c) => {
    if (c.id === car.id) return false
    const sameCategory = c.category === car.category || c.bodyType === car.bodyType
    const similarPrice = Math.abs((c.price?.min ?? 0) - (car.price?.min ?? 0)) <= 5
    return sameCategory || similarPrice
  }).slice(0, 4)

  if (related.length === 0) return null

  return (
    <SectionWrapper id="related">
      <Container>
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <SectionTitle
            eyebrow="Similar Vehicles"
            title="You might also consider."
            subtitle={`Other ${car.category || car.bodyType}s in a similar price range.`}
            accent="teal"
            size="md"
          />
          <SecondaryButton
            variant="outline"
            size="sm"
            iconRight={<ChevronRight size={14} />}
            onClick={() => {}}
          >
            <Link to={`/discover?category=${car.category}`}>All Similar</Link>
          </SecondaryButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {related.map((relCar, i) => (
            <motion.div
              key={relCar.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              <RelatedCarCard car={relCar} accentColor={accentColor} />
            </motion.div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}

// ── Mini related car card (local to this page) ─────────────────────────────
function RelatedCarCard({ car }) {
  const navigate = useNavigate()
  const { toggleSaved, isSaved } = useApp()
  const saved = isSaved(car.id)

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-white/7 overflow-hidden bg-[#0D0D16]/80 cursor-pointer hover:border-white/15 transition-colors duration-200 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
      onClick={() => navigate(`/car/${car.id}`)}
      role="article"
      aria-label={`View ${car.name || car.model}`}
    >
      {/* Art area */}
      <div
        className={clsx('h-36 relative flex items-center justify-center bg-gradient-to-br', car.gradient)}
      >
        <Car
          size={52}
          className="opacity-10"
          style={{ color: car.accentColor || '#00C8FF' }}
          aria-hidden
        />
        {/* Price pill */}
        <span className="absolute bottom-2 left-3 text-[10px] font-bold px-2 py-0.5 rounded bg-black/55 backdrop-blur-sm text-[#E8E8F0]">
          ₹{car.price?.min}L+
        </span>
        {/* Save button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleSaved(car.id) }}
          aria-label={saved ? 'Remove from saved' : 'Save car'}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/55 backdrop-blur-sm flex items-center justify-center text-[#606080] hover:text-[#FF8C35] transition-colors duration-150"
        >
          <Heart size={14} fill={saved ? '#FF8C35' : 'none'} className={saved ? 'text-[#FF8C35]' : ''} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] text-[#3A3A5A] uppercase tracking-wider mb-0.5">{car.brand}</p>
        <h3 className="font-display font-bold text-[#EEE8F8] text-lg leading-tight mb-3">
          {car.model || car.name}
        </h3>
        <div className="flex items-center justify-between">
          <StatusBadge preset={car.fuelType} size="xs" />
          <span className="text-[10px] text-[#3A3A5A]">{car.seating} seats</span>
        </div>
      </div>
    </motion.article>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// STICKY SECTION NAV
// ══════════════════════════════════════════════════════════════════════════════
function SectionNav({ activeId, visible, accentColor }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          aria-label="Page sections"
          className="fixed top-16 left-0 right-0 z-40 bg-[#06060C]/93 backdrop-blur-2xl border-b border-white/7 shadow-[0_4px_28px_rgba(0,0,0,0.35)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div
              className="flex items-center gap-0.5 overflow-x-auto py-2 scrollbar-hide"
              role="list"
            >
              {SECTION_NAV.map(({ id, label }) => {
                const isActive = activeId === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="listitem"
                    onClick={() => scrollTo(id)}
                    className={clsx(
                      'flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 outline-none',
                      'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060C]',
                      isActive
                        ? 'font-semibold'
                        : 'text-[#3E3E5E] hover:text-[#8080A0] hover:bg-white/5',
                    )}
                    style={
                      isActive
                        ? {
                            background: `${accentColor}18`,
                            color: accentColor,
                            boxShadow: `0 0 0 1px ${accentColor}30`,
                          }
                        : {}
                    }
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// CAR NOT FOUND
// ══════════════════════════════════════════════════════════════════════════════
function CarNotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06060C] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div
          className="w-20 h-20 rounded-3xl bg-[#0D0D16] border border-white/8 flex items-center justify-center mx-auto mb-8"
        >
          <Car size={36} className="text-[#2E2E4A]" aria-hidden />
        </div>
        <h1 className="font-display font-bold text-4xl text-[#F0F0F8] mb-3">
          Car Not Found
        </h1>
        <p className="text-[#505070] text-base leading-relaxed mb-8">
          We couldn't find this vehicle. The link may be outdated, or the car has been removed from our database.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <PrimaryButton
            variant="teal"
            size="lg"
            icon={<Search size={17} />}
            onClick={() => navigate('/discover')}
          >
            Browse All Cars
          </PrimaryButton>
          <SecondaryButton
            variant="outline"
            size="lg"
            icon={<ArrowLeft size={17} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </SecondaryButton>
        </div>
      </motion.div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE EXPORT
// ══════════════════════════════════════════════════════════════════════════════
export default function CarDetails() {
  const { id }               = useParams()
  const [activeId, setActiveId] = useState('overview')
  const [navVisible, setNavVisible] = useState(false)

  // Resolve car from id
  const car = CARS.find((c) => c.id === id)
  const accentColor = car?.accentColor || '#00C8FF'

  // ── Track active section via IntersectionObserver ──────────────────────────
  useEffect(() => {
    const ids = SECTION_NAV.map((s) => s.id)
    const observers = []

    ids.forEach((sectionId) => {
      const el = document.getElementById(sectionId)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(sectionId)
        },
        { threshold: 0.25, rootMargin: '-80px 0px -55% 0px' },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [id])

  // ── Show sticky nav after hero scrolls away ────────────────────────────────
  useEffect(() => {
    const onScroll = () => setNavVisible(window.scrollY > window.innerHeight * 0.55)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Set document title ─────────────────────────────────────────────────────
  useEffect(() => {
    if (car) {
      document.title = `${car.brand} ${car.model || car.name} — REVORA`
    } else {
      document.title = 'Car Not Found — REVORA'
    }
    return () => { document.title = 'REVORA — Automotive Intelligence' }
  }, [car])

  if (!car) return <CarNotFound />

  return (
    <>
      {/* Sticky section nav */}
      <SectionNav
        activeId={activeId}
        visible={navVisible}
        accentColor={accentColor}
      />

      <main>
        <HeroSection    car={car} accentColor={accentColor} />
        <QuickSpecsSection car={car} accentColor={accentColor} />
        <SafetySection  car={car} accentColor={accentColor} />
        <OwnershipSection car={car} accentColor={accentColor} />
        <DrivingSection car={car} accentColor={accentColor} />
        <ProsConsSection car={car} />
        <BuyerSection   car={car} />
        <ScoresSection  car={car} accentColor={accentColor} />
        <RelatedSection car={car} accentColor={accentColor} />
      </main>
    </>
  )
}