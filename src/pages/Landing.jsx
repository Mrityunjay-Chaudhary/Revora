import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Zap, Shield, BarChart3, Search,
  TrendingUp, Gauge, Wrench, Users, Star,
  ChevronRight, Play, Check, Leaf, IndianRupee,
  Layers, Brain, SlidersHorizontal, Award, Car,
  Fuel, BatteryCharging, MapPin, Quote,
} from 'lucide-react'
import clsx from 'clsx'

import {
  PrimaryButton, SecondaryButton, GlassCard,
  SearchInput, StatusBadge, SectionTitle, StatCard,
} from '../components/ui'
import { CARS, TESTIMONIALS } from '../data/Cars'
import { useApp } from '../contexts/AppContext'

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function FadeIn({ children, delay = 0, className, once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px 0px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
const HERO_SUGGESTIONS = [
  'Tata Nexon', 'Hyundai Creta', 'Maruti Swift',
  'Honda City e:HEV', 'Mahindra XUV700', 'Kia Seltos',
  'Tata Punch EV', 'Toyota Fortuner', 'Hyundai Verna',
]

const HERO_STATS = [
  { label: 'Vehicles', value: 247, suffix: '+' },
  { label: 'Brands', value: 24 },
  { label: 'Real Reviews', value: '18K', suffix: '+' },
  { label: 'Comparisons', value: '91K', suffix: '+' },
]

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* Teal orb — top-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 900,
          height: 900,
          top: '-30%',
          left: '-20%',
          background: 'radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />

      {/* Amber orb — bottom-right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 800,
          height: 800,
          bottom: '-25%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(255,140,53,0.05) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 2 }}
      />

      {/* Purple orb — center-right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '20%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 4 }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#06060C] to-transparent" />
    </div>
  )
}

function HeroSection() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (val) => {
    if (val.trim()) navigate(`/discover?q=${encodeURIComponent(val.trim())}`)
  }

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#06060C]"
      aria-label="Hero"
    >
      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2.5 mb-8"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00C8FF] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C8FF]" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00C8FF]">
              AI-Powered Automotive Intelligence
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            custom={0.1}
            initial="hidden"
            animate="visible"
            className="font-display font-bold tracking-[-0.025em] leading-[1.02] mb-6"
          >
            <span className="block text-[clamp(3.2rem,8.5vw,7rem)] text-[#F0F0F8]">
              Discover the car
            </span>
            <span className="block text-[clamp(3.2rem,8.5vw,7rem)]">
              <span className="text-[#F0F0F8]">that fits</span>{' '}
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #00C8FF 0%, #00A0D0 40%, #FF8C35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                your life.
              </span>
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            animate="visible"
            className="text-[#7070A0] text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Not just specifications. REVORA analyses real ownership experience,
            maintenance costs, and driving habits to find the car that{' '}
            <em className="text-[#9090B8] not-italic font-medium">actually</em> matches how you live.
          </motion.p>

          {/* Search */}
          <motion.div
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto mb-6"
          >
            <SearchInput
              value={search}
              onChange={setSearch}
              onSearch={handleSearch}
              suggestions={
                search
                  ? HERO_SUGGESTIONS.filter((s) =>
                      s.toLowerCase().includes(search.toLowerCase())
                    )
                  : []
              }
              recentSearches={['Nexon Diesel', 'Creta Turbo', 'XUV700 AWD']}
              placeholder="Search cars, brands, body types…"
              size="lg"
              fullWidth
            />
          </motion.div>

          {/* Popular tags */}
          <motion.div
            variants={fadeUp}
            custom={0.35}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-2 mb-10"
          >
            <span className="text-xs text-[#3A3A5A] mr-1">Popular:</span>
            {['SUV under ₹15L', 'Hybrid Sedan', 'EV City Car', '7-Seater'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/discover?q=${encodeURIComponent(tag)}`)}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-[#6060808] hover:border-[#00C8FF]/30 hover:text-[#00C8FF] hover:bg-[#00C8FF]/5 transition-all duration-150"
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={0.4}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20"
          >
            <PrimaryButton
              variant="teal"
              size="lg"
              icon={<Search size={17} />}
              onClick={() => navigate('/discover')}
            >
              Explore All Cars
            </PrimaryButton>
            <PrimaryButton
              variant="amber"
              size="lg"
              icon={<Zap size={17} />}
              onClick={() => navigate('/recommendations')}
            >
              Match My Lifestyle
            </PrimaryButton>
            <SecondaryButton
              variant="outline"
              size="lg"
              icon={<BarChart3 size={17} />}
              onClick={() => navigate('/compare')}
            >
              Compare Cars
            </SecondaryButton>
          </motion.div>

          {/* Platform stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
          >
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={0.5 + i * 0.07}
              >
                <GlassCard padding="sm" className="text-center py-4">
                  <div className="font-display font-bold text-[#00C8FF] text-2xl sm:text-3xl leading-none mb-1">
                    {stat.value}{stat.suffix ?? ''}
                  </div>
                  <div className="text-[11px] text-[#5050708] font-medium">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#2E2E4A]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[#00C8FF]/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TRUSTED BRANDS STRIP
// ─────────────────────────────────────────────────────────────────────────────
const BRANDS = [
  { name: 'Tata Motors', icon: '◈', color: '#3B82F6' },
  { name: 'Hyundai',     icon: '◆', color: '#818CF8' },
  { name: 'Maruti',      icon: '◇', color: '#F87171' },
  { name: 'Honda',       icon: '○', color: '#22D3EE' },
  { name: 'Mahindra',    icon: '◉', color: '#F59E0B' },
  { name: 'Kia',         icon: '◈', color: '#10B981' },
  { name: 'Toyota',      icon: '◆', color: '#A1A1AA' },
  { name: 'Skoda',       icon: '◇', color: '#34D399' },
  { name: 'Volkswagen',  icon: '○', color: '#60A5FA' },
  { name: 'MG',          icon: '◉', color: '#FB923C' },
]

function BrandsSection() {
  return (
    <section className="relative py-12 overflow-hidden border-y border-white/5 bg-[#08080F]">
      {/* Gradient masks on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#08080F] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#08080F] to-transparent z-10 pointer-events-none" />

      {/* Label */}
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[#2E2E4A] mb-6">
        Comprehensive data across all major Indian automotive brands
      </p>

      {/* Scrolling marquee */}
      <div className="flex gap-0">
        {[0, 1].map((rep) => (
          <motion.div
            key={rep}
            className="flex items-center gap-12 shrink-0 px-6"
            animate={{ x: ['0%', '-100%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'loop',
            }}
          >
            {BRANDS.map((brand) => (
              <div key={`${brand.name}-${rep}`} className="flex items-center gap-2.5 shrink-0 opacity-50 hover:opacity-90 transition-opacity duration-300">
                <span className="text-base" style={{ color: brand.color }}>{brand.icon}</span>
                <span className="font-display font-bold text-[15px] text-[#7070A0] tracking-wide whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. WHY REVORA — FEATURE GRID
// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: 'Lifestyle-Based AI Matching',
    body: 'Answer 5 questions about your daily drive, family needs, and budget. Get recommendations that match how you actually live — not just a spec sheet comparison.',
    accent: 'teal',
    accentColor: '#00C8FF',
    tag: 'AI-Powered',
  },
  {
    icon: IndianRupee,
    title: 'True Ownership Cost Analysis',
    body: 'See the full financial picture: EMI, insurance, fuel, annual service, depreciation, and resale value — calculated for your specific usage pattern.',
    accent: 'amber',
    accentColor: '#FF8C35',
    tag: 'Financial Clarity',
  },
  {
    icon: BarChart3,
    title: 'Deep Comparison Engine',
    body: 'Go beyond horsepower tables. Compare cars across 14 real-world dimensions: city comfort, highway stability, family suitability, maintenance cost, and more.',
    accent: 'purple',
    accentColor: '#8B5CF6',
    tag: 'Side-by-Side',
  },
  {
    icon: Shield,
    title: 'Safety-First Intelligence',
    body: 'NCAP ratings, airbag counts, and ADAS features — but also which cars genuinely feel safe on potholed Indian roads versus which just look good on a spec sheet.',
    accent: 'green',
    accentColor: '#00E096',
    tag: 'Safety Analysis',
  },
  {
    icon: Wrench,
    title: 'Maintenance Reality Check',
    body: "Annual service costs, spare part availability, dealer network density, and common issues after 60,000 km. Know what you're getting into before you sign.",
    accent: 'amber',
    accentColor: '#FF8C35',
    tag: 'Ownership Insights',
  },
  {
    icon: TrendingUp,
    title: 'Resale Value Intelligence',
    body: "India's used car market data on depreciation curves, demand retention, and 5-year resale estimates. Your car is also an investment.",
    accent: 'teal',
    accentColor: '#00C8FF',
    tag: 'Market Data',
  },
]

function WhyRevoraSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#06060C]" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="mb-16">
          <SectionTitle
            eyebrow="Why Revora"
            title={
              <>
                Everything you need to{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #00C8FF, #0090CC)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  decide confidently.
                </span>
              </>
            }
            subtitle="The only automotive research platform built around real ownership — not marketing claims."
            align="center"
            size="lg"
            accent="teal"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon
            return (
              <FadeIn key={feat.title} delay={i * 0.07}>
                <GlassCard
                  variant="default"
                  accent={feat.accent}
                  hoverable
                  padding="lg"
                  className="h-full"
                >
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${feat.accentColor}18` }}
                  >
                    <Icon size={20} style={{ color: feat.accentColor }} aria-hidden />
                  </div>

                  {/* Tag */}
                  <StatusBadge
                    color={
                      feat.accent === 'teal'   ? 'teal'   :
                      feat.accent === 'amber'  ? 'amber'  :
                      feat.accent === 'purple' ? 'purple' : 'green'
                    }
                    size="xs"
                    className="mb-3"
                  >
                    {feat.tag}
                  </StatusBadge>

                  <h3 className="font-display font-bold text-[#E8E8F0] text-xl mb-3 leading-tight">
                    {feat.title}
                  </h3>
                  <p className="text-[#6868888] text-sm leading-relaxed">
                    {feat.body}
                  </p>
                </GlassCard>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FEATURED CARS — HORIZONTAL SCROLL CARDS
// ─────────────────────────────────────────────────────────────────────────────

const FEATURED_IDS = [
  'tata-nexon-2024',
  'hyundai-creta-2024',
  'mahindra-xuv700-2024',
  'honda-city-ehev-2024',
  'kia-seltos-2024',
]

const FUEL_ICONS = {
  petrol:   { icon: Fuel,           color: '#FF8C35', label: 'Petrol'   },
  diesel:   { icon: Fuel,           color: '#60A5FA', label: 'Diesel'   },
  electric: { icon: BatteryCharging,color: '#00E096', label: 'Electric' },
  hybrid:   { icon: Leaf,           color: '#10B981', label: 'Hybrid'   },
}

function CarCardMini({ car }) {
  const navigate = useNavigate()
  const { toggleSaved, isSaved, addToComparison, isInComparison } = useApp()
  const saved = isSaved(car.id)
  const inComp = isInComparison(car.id)
  const fuelCfg = FUEL_ICONS[car.fuelType] ?? FUEL_ICONS.petrol
  const FuelIcon = fuelCfg.icon

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className={clsx(
        'relative flex-shrink-0 w-[300px] sm:w-[320px] rounded-2xl overflow-hidden',
        'border border-white/8 cursor-pointer',
        'bg-gradient-to-b',
        car.gradient,
        'to-[#0A0A14]',
        'hover:border-white/18 transition-colors duration-200',
        'shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
      )}
      onClick={() => navigate(`/car/${car.id}`)}
      role="article"
      aria-label={`${car.name} — from ₹${car.price.min} lakh`}
    >
      {/* Car gradient art area */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden">
        {/* Decorative radial */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 70%, ${car.accentColor}50 0%, transparent 70%)`,
          }}
          aria-hidden
        />
        {/* Car placeholder art */}
        <div className="relative z-10 text-center">
          <Car size={72} className="mx-auto opacity-15 mb-2" style={{ color: car.accentColor }} aria-hidden />
          <StatusBadge color="zinc" variant="solid" size="xs">
            {car.badge}
          </StatusBadge>
        </div>
        {/* Price chip */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold font-display px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[#F0F0F8]">
            ₹{car.price.min}–{car.price.max}L
          </span>
        </div>
        {/* Saved button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleSaved(car.id) }}
          aria-label={saved ? 'Remove from saved' : 'Save car'}
          className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-black/50 backdrop-blur-md flex items-center justify-center text-[#7070A0] hover:text-[#FF8C35] transition-colors duration-150"
        >
          <motion.span whileTap={{ scale: 0.8 }}>
            {saved ? (
              <span style={{ color: '#FF8C35' }}>♥</span>
            ) : '♡'}
          </motion.span>
        </button>
      </div>

      {/* Card content */}
      <div className="p-4 bg-gradient-to-b from-transparent to-[#09090F]/90">
        {/* Fuel + transmission */}
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: fuelCfg.color }}>
            <FuelIcon size={11} aria-hidden />
            {fuelCfg.label}
          </span>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-[10px] text-[#505070] font-medium capitalize">{car.transmission}</span>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-[10px] text-[#505070] font-medium">{car.seating}-seat</span>
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-[#EEE8F8] text-xl leading-tight mb-1">
          {car.name}
        </h3>
        <p className="text-[11px] text-[#505070] mb-4 truncate">{car.variant}</p>

        {/* Key ratings */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Safety', val: car.ratings.safety },
            { label: 'Comfort', val: car.ratings.comfort },
            { label: 'Value', val: car.ratings.valueForMoney },
          ].map((r) => (
            <div key={r.label} className="text-center">
              <div
                className="font-display font-bold text-base leading-none"
                style={{ color: car.accentColor }}
              >
                {r.val}
              </div>
              <div className="text-[9px] text-[#404060] mt-0.5">{r.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate(`/car/${car.id}`) }}
            className="flex-1 h-9 rounded-xl text-xs font-semibold text-[#F0F0F8] border border-white/12 hover:bg-white/8 transition-colors duration-150"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); addToComparison(car.id) }}
            className={clsx(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150',
              inComp
                ? 'bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/30'
                : 'border border-white/12 text-[#5050708] hover:text-[#00C8FF] hover:border-[#00C8FF]/30'
            )}
            aria-label={inComp ? 'In comparison' : 'Add to comparison'}
          >
            <BarChart3 size={14} aria-hidden />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function FeaturedCarsSection() {
  const scrollRef = useRef(null)
  const featuredCars = FEATURED_IDS
    .map((id) => CARS.find((c) => c.id === id))
    .filter(Boolean)

  return (
    <section className="relative py-24 sm:py-32 bg-[#08080F]" id="cars">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <SectionTitle
            eyebrow="Featured Vehicles"
            title="Popular cars this month"
            subtitle="Researched and reviewed for the Indian market."
            size="md"
            accent="amber"
          />
          <SecondaryButton
            variant="outline"
            size="sm"
            iconRight={<ArrowRight size={14} />}
            onClick={() => {}}
          >
            <Link to="/discover">All Cars</Link>
          </SecondaryButton>
        </FadeIn>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          role="list"
          aria-label="Featured cars"
        >
          {featuredCars.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ scrollSnapAlign: 'start' }}
              role="listitem"
            >
              <CarCardMini car={car} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMPARISON PREVIEW SECTION
// ─────────────────────────────────────────────────────────────────────────────
const COMPARE_METRICS = [
  { label: 'Safety Rating',    nexon: 9.5,  creta: 7.5,  winner: 'nexon' },
  { label: 'Fuel Efficiency',  nexon: 8.5,  creta: 7.0,  winner: 'nexon' },
  { label: 'Comfort',          nexon: 7.8,  creta: 9.0,  winner: 'creta' },
  { label: 'Performance',      nexon: 7.5,  creta: 8.5,  winner: 'creta' },
  { label: 'Family Fit',       nexon: 8.5,  creta: 9.0,  winner: 'creta' },
  { label: 'Maintenance Cost', nexon: 7.0,  creta: 6.5,  winner: 'nexon' },
  { label: 'Resale Value',     nexon: 8.0,  creta: 8.5,  winner: 'creta' },
]

function MetricBar({ label, valA, valB, winner, carAKey, carBKey }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="flex items-center gap-3 group">
      {/* A bar */}
      <div className="flex-1 flex justify-end">
        <div className="w-full max-w-[140px] flex items-center gap-2 justify-end">
          {winner === carAKey && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-[#00E096]"
            >
              <Check size={12} />
            </motion.span>
          )}
          <div className="flex-1 h-1.5 rounded-full bg-[#13131F] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${(valA / 10) * 100}%` } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
              className={clsx(
                'h-full rounded-full',
                winner === carAKey ? 'bg-[#3B82F6]' : 'bg-[#1E2A3A]'
              )}
            />
          </div>
          <span className="text-xs font-mono w-6 text-right text-[#5050708]">{valA}</span>
        </div>
      </div>

      {/* Label */}
      <div className="w-32 text-center shrink-0">
        <span className="text-[10px] text-[#4A4A6A] font-medium leading-tight block">{label}</span>
      </div>

      {/* B bar */}
      <div className="flex-1">
        <div className="w-full max-w-[140px] flex items-center gap-2">
          <span className="text-xs font-mono w-6 text-[#5050708]">{valB}</span>
          <div className="flex-1 h-1.5 rounded-full bg-[#13131F] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${(valB / 10) * 100}%` } : {}}
              transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
              className={clsx(
                'h-full rounded-full',
                winner === carBKey ? 'bg-[#818CF8]' : 'bg-[#1E2A3A]'
              )}
            />
          </div>
          {winner === carBKey && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-[#00E096]"
            >
              <Check size={12} />
            </motion.span>
          )}
        </div>
      </div>
    </div>
  )
}

function ComparisonPreviewSection() {
  const navigate = useNavigate()
  const nexon  = CARS.find((c) => c.id === 'tata-nexon-2024')
  const creta  = CARS.find((c) => c.id === 'hyundai-creta-2024')

  return (
    <section className="relative py-24 sm:py-32 bg-[#06060C]" id="compare">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text side */}
          <FadeIn>
            <SectionTitle
              eyebrow="Deep Comparison"
              title={
                <>
                  Side-by-side{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    truth.
                  </span>
                </>
              }
              subtitle="14 real-world dimensions — not just horsepower and torque. Compare what actually matters to you."
              accent="purple"
              size="md"
            />

            <ul className="mt-8 space-y-3">
              {[
                'City & highway driving experience separately rated',
                'Real maintenance cost benchmarks per year',
                '5-year resale strength prediction',
                '"Avoid if" scenarios for each vehicle',
                'Family and long-distance suitability scores',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#7070A0]">
                  <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              <PrimaryButton
                variant="teal"
                size="md"
                icon={<BarChart3 size={16} />}
                onClick={() => navigate('/compare')}
              >
                Start Comparing
              </PrimaryButton>
              <SecondaryButton
                variant="outline"
                size="md"
                iconRight={<ArrowRight size={14} />}
                onClick={() => navigate('/discover')}
              >
                Browse All
              </SecondaryButton>
            </div>
          </FadeIn>

          {/* Comparison card preview */}
          <FadeIn delay={0.2}>
            <GlassCard variant="elevated" padding="lg" accent="purple" glow>
              {/* Car headers */}
              <div className="flex items-center mb-6">
                <div className="flex-1 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center mx-auto mb-2">
                    <Car size={18} className="text-[#3B82F6]" aria-hidden />
                  </div>
                  <div className="font-display font-bold text-[#F0F0F8] text-base">{nexon?.name}</div>
                  <div className="text-[10px] text-[#3B82F6] mt-0.5">₹{nexon?.price.min}–{nexon?.price.max}L</div>
                </div>

                <div className="px-4 text-[11px] font-bold uppercase tracking-widest text-[#2E2E4A] shrink-0">
                  vs
                </div>

                <div className="flex-1 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#818CF8]/15 flex items-center justify-center mx-auto mb-2">
                    <Car size={18} className="text-[#818CF8]" aria-hidden />
                  </div>
                  <div className="font-display font-bold text-[#F0F0F8] text-base">{creta?.name}</div>
                  <div className="text-[10px] text-[#818CF8] mt-0.5">₹{creta?.price.min}–{creta?.price.max}L</div>
                </div>
              </div>

              <div className="h-px bg-white/6 mb-5" />

              {/* Metric bars */}
              <div className="space-y-4">
                {COMPARE_METRICS.map((m) => (
                  <MetricBar
                    key={m.label}
                    label={m.label}
                    valA={m.nexon}
                    valB={m.creta}
                    winner={m.winner}
                    carAKey="nexon"
                    carBKey="creta"
                  />
                ))}
              </div>

              <div className="h-px bg-white/6 mt-5 mb-4" />

              {/* Winner callout */}
              <div className="flex items-center gap-2 text-xs text-[#7070A0]">
                <Award size={13} className="text-[#00E096] shrink-0" aria-hidden />
                <span>
                  <span className="text-[#00E096] font-semibold">Nexon leads on safety & running cost.</span>{' '}
                  Creta leads on comfort & features.
                </span>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. OWNERSHIP COST STATS
// ─────────────────────────────────────────────────────────────────────────────
const OWNERSHIP_STATS = [
  {
    label: 'Avg Annual Service Cost',
    value: 18000,
    prefix: '₹',
    unit: '/yr',
    accent: 'amber',
    trend: -12,
    trendLabel: 'vs industry avg',
    description: 'For a compact petrol automatic with 15,000 km/year.',
    icon: <Wrench size={20} />,
    highlight: false,
  },
  {
    label: 'Fuel Cost (City, 40km/day)',
    value: 42000,
    prefix: '₹',
    unit: '/yr',
    accent: 'teal',
    trend: 0,
    trendLabel: 'market rate',
    description: 'At ₹105/L, 20 kmpl city mileage, 250 working days.',
    icon: <Fuel size={20} />,
    highlight: true,
  },
  {
    label: '5-Year Depreciation',
    value: '35',
    unit: '%',
    accent: 'purple',
    trend: -5,
    trendLabel: 'below segment avg',
    description: 'For strong-resale vehicles like Nexon and Fortuner.',
    icon: <TrendingUp size={20} />,
    highlight: false,
  },
  {
    label: 'EV Running Cost (40km/day)',
    value: 8760,
    prefix: '₹',
    unit: '/yr',
    accent: 'green',
    trend: -79,
    trendLabel: 'vs petrol equivalent',
    description: 'Based on home charging at ₹8/kWh, Punch EV long range.',
    icon: <BatteryCharging size={20} />,
    highlight: false,
  },
]

function OwnershipCostsSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#08080F]" id="costs">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,140,53,1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="mb-16 text-center">
          <SectionTitle
            eyebrow="Ownership Intelligence"
            title={
              <>
                Know the real cost{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #FF8C35, #FF5500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  before you buy.
                </span>
              </>
            }
            subtitle="The sticker price is just the beginning. See the complete financial picture across fuel, service, insurance, and depreciation."
            align="center"
            accent="amber"
            size="lg"
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {OWNERSHIP_STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <StatCard
                label={s.label}
                value={s.value}
                prefix={s.prefix}
                unit={s.unit}
                accent={s.accent}
                trend={s.trend}
                trendLabel={s.trendLabel}
                description={s.description}
                icon={s.icon}
                highlight={s.highlight}
                animateCount
                size="md"
                className="h-full"
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. AI RECOMMENDATION PREVIEW
// ─────────────────────────────────────────────────────────────────────────────
const RECO_PROFILES = [
  {
    profile: 'City commuter, 40 km/day',
    profileIcon: MapPin,
    budget: '₹6–10 lakh',
    recommendation: 'Maruti Swift AMT',
    reason:
      'Best city mileage (24.8 kmpl), tightest turning circle, lowest maintenance cost in India. Made for urban daily driving.',
    fit: 96,
    tags: ['City', 'Petrol', 'Low Upkeep'],
    accent: '#F87171',
    gradient: 'from-red-900/30 to-transparent',
  },
  {
    profile: 'Family of 5, highway trips',
    profileIcon: Users,
    budget: '₹14–20 lakh',
    recommendation: 'Hyundai Creta Turbo DCT',
    reason:
      'Segment-leading rear seat comfort, smooth highway cruiser, ADAS for fatigued motorway drives, and unmatched resale demand.',
    fit: 92,
    tags: ['Family', 'Highway', 'SUV'],
    accent: '#818CF8',
    gradient: 'from-indigo-900/30 to-transparent',
  },
  {
    profile: 'Eco-first, home charging available',
    profileIcon: Leaf,
    budget: '₹10–16 lakh',
    recommendation: 'Tata Punch EV Long Range',
    reason:
      'Running cost of ₹1/km, 5-star safety, zero oil changes. For city-primary owners with a home charging point, this redefines ownership economics.',
    fit: 88,
    tags: ['Electric', 'City', 'Low Cost'],
    accent: '#7C3AED',
    gradient: 'from-violet-900/30 to-transparent',
  },
]

function RecommendationPreviewSection() {
  const navigate = useNavigate()

  return (
    <section className="relative py-24 sm:py-32 bg-[#06060C]" id="recommendations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="mb-16">
          <SectionTitle
            eyebrow="AI Matching"
            title={
              <>
                Your lifestyle.{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #00C8FF, #0096CC)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Your car.
                </span>
              </>
            }
            subtitle="See how REVORA's matching logic surfaces the right car for three very different real-world profiles."
            accent="teal"
            size="lg"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECO_PROFILES.map((reco, i) => {
            const ProfileIcon = reco.profileIcon
            return (
              <FadeIn key={reco.profile} delay={i * 0.12}>
                <GlassCard variant="default" hoverable padding="none" className="h-full overflow-hidden">
                  {/* Top accent bar */}
                  <div
                    className={clsx('h-32 relative flex items-end p-5 bg-gradient-to-b', reco.gradient)}
                    aria-hidden
                  >
                    {/* Profile icon */}
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: `${reco.accent}20`, border: `1px solid ${reco.accent}30` }}
                    >
                      <ProfileIcon size={18} style={{ color: reco.accent }} />
                    </div>

                    {/* Fit score */}
                    <div className="ml-auto text-right">
                      <div className="font-display font-black text-3xl leading-none" style={{ color: reco.accent }}>
                        {reco.fit}%
                      </div>
                      <div className="text-[10px] text-[#404060]">match score</div>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Profile + budget */}
                    <div className="mb-4">
                      <p className="text-[11px] font-semibold text-[#5050708] uppercase tracking-wider mb-0.5">
                        {reco.profile}
                      </p>
                      <p className="text-xs text-[#3A3A5A]">Budget: {reco.budget}</p>
                    </div>

                    {/* Recommendation */}
                    <div className="mb-3">
                      <div className="text-[10px] text-[#3A3A5A] mb-1 uppercase tracking-widest">
                        Best Match
                      </div>
                      <h3 className="font-display font-bold text-[#F0F0F8] text-xl leading-tight">
                        {reco.recommendation}
                      </h3>
                    </div>

                    {/* Reason */}
                    <p className="text-[12px] text-[#5A5A7A] leading-relaxed mb-4">
                      {reco.reason}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {reco.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
                          style={{
                            color: reco.accent,
                            borderColor: `${reco.accent}30`,
                            background: `${reco.accent}0D`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.3} className="mt-10 text-center">
          <PrimaryButton
            variant="teal"
            size="lg"
            icon={<Zap size={17} />}
            onClick={() => navigate('/recommendations')}
          >
            Get My Personalised Match
          </PrimaryButton>
          <p className="text-xs text-[#3A3A5A] mt-3">5 quick questions · No account required</p>
        </FadeIn>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#08080F] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,200,255,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="mb-16 text-center">
          <SectionTitle
            eyebrow="Real Stories"
            title="Used by buyers who research seriously."
            align="center"
            size="md"
            accent="teal"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.1}>
              <GlassCard hoverable padding="lg" className="h-full flex flex-col">
                <Quote size={20} className="text-[#00C8FF]/30 mb-4 shrink-0" aria-hidden />
                <p className="text-sm text-[#7070A0] leading-relaxed flex-1 mb-5">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00C8FF]/20 to-[#8B5CF6]/20 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="font-display font-bold text-sm text-[#C0C0D8]">{t.avatar}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#D0D0E8]">{t.name}</div>
                    <div className="text-[10px] text-[#4A4A6A]">{t.role}</div>
                  </div>
                </div>
                {/* Car bought */}
                <div className="mt-3 pt-3 border-t border-white/6">
                  <StatusBadge color="teal" size="xs" dot>
                    Bought: {t.car}
                  </StatusBadge>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. FINAL CTA SECTION
// ─────────────────────────────────────────────────────────────────────────────
function CtaSection() {
  const navigate = useNavigate()

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#06060C]">
      {/* Background orb */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,200,255,0.05) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <span className="inline-flex items-center gap-2 mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00C8FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF]" aria-hidden />
            Ready to find your car?
          </span>

          <h2 className="font-display font-bold text-[clamp(2.5rem,6vw,4.5rem)] text-[#F0F0F8] leading-[1.05] tracking-[-0.02em] mb-6">
            Stop guessing.
            <br />
            Start{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00C8FF 0%, #FF8C35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              deciding.
            </span>
          </h2>

          <p className="text-[#6868888] text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join thousands of buyers who made confident decisions with REVORA's
            ownership-first automotive intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PrimaryButton
              variant="teal"
              size="xl"
              icon={<Zap size={20} />}
              onClick={() => navigate('/recommendations')}
              glow
            >
              Match My Lifestyle
            </PrimaryButton>
            <SecondaryButton
              variant="outline"
              size="xl"
              icon={<Search size={18} />}
              onClick={() => navigate('/discover')}
            >
              Explore Cars
            </SecondaryButton>
          </div>

          <p className="mt-6 text-xs text-[#2E2E4A]">
            No login required · Free forever · No ads · No dealer kickbacks
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. FOOTER
// ─────────────────────────────────────────────────────────────────────────────
const FOOTER_LINKS = {
  Platform: [
    { label: 'Discover Cars',       href: '/discover' },
    { label: 'Compare Vehicles',    href: '/compare' },
    { label: 'AI Match',            href: '/recommendations' },
    { label: 'Saved Cars',          href: '/saved' },
  ],
  Research: [
    { label: 'SUVs',                href: '/discover?category=suv' },
    { label: 'Sedans',              href: '/discover?category=sedan' },
    { label: 'Hatchbacks',          href: '/discover?category=hatchback' },
    { label: 'Electric Vehicles',   href: '/discover?category=ev' },
  ],
  Company: [
    { label: 'About REVORA',        href: '#' },
    { label: 'Methodology',         href: '#' },
    { label: 'Privacy Policy',      href: '#' },
    { label: 'Contact',             href: '#' },
  ],
}

function Footer() {
  return (
    <footer
      className="relative bg-[#040409] border-t border-white/6"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#00C8FF] to-[#006A99] flex items-center justify-center">
                <span className="font-display font-black text-[#020D12] text-[15px] leading-none">R</span>
              </div>
              <span className="font-display font-bold text-[1.2rem] tracking-tight">
                <span className="text-[#F0F0F8]">REV</span>
                <span className="text-[#00C8FF]">ORA</span>
              </span>
            </div>
            <p className="text-[13px] text-[#3E3E5E] leading-relaxed max-w-[200px]">
              AI-powered automotive intelligence for the Indian market.
            </p>
            {/* Status badge */}
            <div className="mt-5">
              <StatusBadge color="green" dot pulse size="xs">
                Platform operational
              </StatusBadge>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2E2E4A] mb-4">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#4A4A6A] hover:text-[#A0A0C0] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#242436]">
            © {new Date().getFullYear()} REVORA. Built for Indian car buyers. No dealer affiliations.
          </p>
          <div className="flex items-center gap-4">
            {['Twitter / X', 'Instagram', 'LinkedIn'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-[11px] text-[#2A2A3A] hover:text-[#5050708] transition-colors duration-150"
                aria-label={s}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <main>
      <HeroSection />
      <BrandsSection />
      <WhyRevoraSection />
      <FeaturedCarsSection />
      <ComparisonPreviewSection />
      <OwnershipCostsSection />
      <RecommendationPreviewSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}