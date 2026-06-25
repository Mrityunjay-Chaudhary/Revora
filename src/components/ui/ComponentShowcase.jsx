/**
 * ComponentShowcase.jsx
 *
 * Live preview of every REVORA UI component.
 * Route this at /showcase during development.
 *
 * Add to App.jsx:
 *   import ComponentShowcase from './components/ui/ComponentShowcase'
 *   <Route path="/showcase" element={<ComponentShowcase />} />
 */

import { useState } from 'react'
import {
  Search, Heart, ArrowRight, Plus, Zap, Shield, Gauge,
  Fuel, Users, TrendingUp, BarChart2, Star, Wrench,
  SlidersHorizontal, MapPin, ChevronRight,
} from 'lucide-react'

import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import GlassCard from './GlassCard'
import SearchInput from './SearchInput'
import FilterDropdown from './FilterDropdown'
import PriceSlider from './PriceSlider'
import StatusBadge from './StatusBadge'
import { SkeletonCarGrid, SkeletonDetailPage, SkeletonStatRow } from './LoadingSkeleton'
import SectionTitle from './SectionTitle'
import StatCard from './StatCard'

// ── Demo options ──────────────────────────────────────────────
const BODY_TYPES = [
  { id: 'hatchback', label: 'Hatchback', count: 3 },
  { id: 'sedan', label: 'Sedan', count: 5 },
  { id: 'suv', label: 'SUV', count: 12 },
  { id: 'ev', label: 'Electric', count: 4 },
  { id: 'mpv', label: 'MPV', count: 2 },
]

const FUEL_TYPES = [
  { id: 'petrol', label: 'Petrol', count: 14 },
  { id: 'diesel', label: 'Diesel', count: 9 },
  { id: 'electric', label: 'Electric', count: 4 },
  { id: 'hybrid', label: 'Hybrid', count: 3 },
]

const SUGGESTIONS = [
  'Tata Nexon', 'Hyundai Creta', 'Maruti Swift',
  'Honda City', 'Mahindra XUV700', 'Kia Seltos',
]

const RECENT = ['Swift AMT', 'Creta Diesel', 'Fortuner 4x4']

function Section({ title, children }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl font-bold text-[#F0F0F8]">{title}</h2>
        <div className="flex-1 h-px bg-white/8" />
      </div>
      {children}
    </section>
  )
}

export default function ComponentShowcase() {
  const [search, setSearch] = useState('')
  const [bodyType, setBodyType] = useState([])
  const [fuelType, setFuelType] = useState('')
  const [price, setPrice] = useState([8, 25])
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [loading, setLoading] = useState(false)

  const simulateLoad = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#06060C] px-6 py-24 space-y-20 max-w-6xl mx-auto">

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00C8FF]">
          Design System
        </span>
        <h1 className="font-display text-6xl font-bold text-[#F0F0F8] tracking-tight">
          REVORA Components
        </h1>
        <p className="text-[#7070A0] text-lg">
          All 10 reusable UI components — dark automotive theme
        </p>
      </div>

      {/* ─── 1. PrimaryButton ──────────────────────────────── */}
      <Section title="1 · PrimaryButton">
        <div className="flex flex-wrap gap-4 items-center">
          <PrimaryButton variant="teal" icon={<Search size={15} />}>
            Discover Cars
          </PrimaryButton>
          <PrimaryButton variant="amber" icon={<Zap size={15} />}>
            Get Recommendations
          </PrimaryButton>
          <PrimaryButton variant="white" iconRight={<ArrowRight size={15} />}>
            Learn More
          </PrimaryButton>
          <PrimaryButton variant="danger">Remove Car</PrimaryButton>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <PrimaryButton variant="teal" size="sm">Small</PrimaryButton>
          <PrimaryButton variant="teal" size="md">Medium</PrimaryButton>
          <PrimaryButton variant="teal" size="lg">Large</PrimaryButton>
          <PrimaryButton variant="teal" size="xl">X-Large</PrimaryButton>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <PrimaryButton variant="teal" loading>Loading…</PrimaryButton>
          <PrimaryButton variant="teal" disabled>Disabled</PrimaryButton>
          <PrimaryButton variant="teal" glow={false}>No Glow</PrimaryButton>
        </div>

        <PrimaryButton variant="teal" fullWidth icon={<Search size={16} />} size="lg">
          Full Width Search
        </PrimaryButton>
      </Section>

      {/* ─── 2. SecondaryButton ────────────────────────────── */}
      <Section title="2 · SecondaryButton">
        <div className="flex flex-wrap gap-4 items-center">
          <SecondaryButton variant="outline" icon={<Heart size={14} />}>Save Car</SecondaryButton>
          <SecondaryButton variant="ghost">Cancel</SecondaryButton>
          <SecondaryButton variant="outline-teal" icon={<BarChart2 size={14} />}>Compare</SecondaryButton>
          <SecondaryButton variant="outline-amber" icon={<Star size={14} />}>Favourite</SecondaryButton>
          <SecondaryButton variant="subtle">View Details</SecondaryButton>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <SecondaryButton variant="outline" size="sm">Small</SecondaryButton>
          <SecondaryButton variant="outline" active>Active State</SecondaryButton>
          <SecondaryButton variant="outline" loading>Loading</SecondaryButton>
          <SecondaryButton variant="outline" iconRight={<ChevronRight size={14} />}>
            Next Step
          </SecondaryButton>
        </div>
      </Section>

      {/* ─── 3. GlassCard ──────────────────────────────────── */}
      <Section title="3 · GlassCard">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <GlassCard padding="lg" animate delay={0}>
            <p className="text-sm text-[#8888A8] mb-2">Default variant</p>
            <p className="font-display text-xl text-white">Glass Card</p>
          </GlassCard>

          <GlassCard variant="elevated" accent="teal" padding="lg" animate delay={0.1}>
            <p className="text-sm text-[#8888A8] mb-2">Elevated + teal accent</p>
            <p className="font-display text-xl text-[#00C8FF]">Teal Accent</p>
          </GlassCard>

          <GlassCard variant="default" accent="amber" accentSide="left" padding="lg" animate delay={0.2}>
            <p className="text-sm text-[#8888A8] mb-2">Left accent bar</p>
            <p className="font-display text-xl text-[#FF8C35]">Amber Left</p>
          </GlassCard>
        </div>
      </Section>

      {/* ─── 4. SearchInput ────────────────────────────────── */}
      <Section title="4 · SearchInput">
        <div className="space-y-4 max-w-xl">
          <SearchInput
            value={search}
            onChange={setSearch}
            onSearch={(v) => console.log('search:', v)}
            suggestions={search ? SUGGESTIONS.filter(s =>
              s.toLowerCase().includes(search.toLowerCase())
            ) : []}
            recentSearches={RECENT}
            placeholder="Search cars, brands, body types…"
            size="lg"
          />
        </div>
      </Section>

      {/* ─── 5. FilterDropdown ─────────────────────────────── */}
      <Section title="5 · FilterDropdown">
        <div className="flex flex-wrap gap-4 items-start">
          <FilterDropdown
            label="Body Type"
            options={BODY_TYPES}
            value={bodyType}
            onChange={setBodyType}
            multi
            icon={<SlidersHorizontal size={14} />}
          />

          <FilterDropdown
            label="Fuel Type"
            options={FUEL_TYPES}
            value={fuelType}
            onChange={setFuelType}
            icon={<Fuel size={14} />}
            accent="amber"
          />
        </div>
      </Section>

      {/* ─── 6. PriceSlider ────────────────────────────────── */}
      <Section title="6 · PriceSlider">
        <GlassCard padding="lg">
          <PriceSlider
            value={price}
            onChange={setPrice}
            min={5}
            max={60}
            accent="teal"
            label="Budget Range"
          />
        </GlassCard>
      </Section>

      {/* ─── 7. StatusBadge ────────────────────────────────── */}
      <Section title="7 · StatusBadge">
        <div className="flex flex-wrap gap-2">
          {['ev', 'petrol', 'diesel', 'hybrid', 'safe', 'best-value'].map(p => (
            <StatusBadge key={p} preset={p} />
          ))}
        </div>
      </Section>

      {/* ─── 8. LoadingSkeleton ────────────────────────────── */}
      <Section title="8 · LoadingSkeleton">
        {showSkeleton ? (
          <SkeletonCarGrid count={3} />
        ) : (
          <SecondaryButton
            variant="outline"
            onClick={() => setShowSkeleton(true)}
          >
            Show Skeleton
          </SecondaryButton>
        )}
      </Section>

      {/* ─── 9. SectionTitle ───────────────────────────────── */}
      <Section title="9 · SectionTitle">
        <SectionTitle
          eyebrow="AI-Powered"
          title="Find the Car That Fits Your Life"
          subtitle="Not just specs — real ownership insights."
          accent="teal"
          size="lg"
        />
      </Section>

      {/* ─── 10. StatCard ──────────────────────────────────── */}
      <Section title="10 · StatCard">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Fuel Economy"
            value={21.5}
            unit="kmpl"
            accent="green"
            trend={12}
            trendLabel="vs segment avg"
            icon={<Gauge size={20} />}
            highlight
          />

          <StatCard
            label="Engine Power"
            value={185}
            unit="bhp"
            accent="amber"
            icon={<Zap size={20} />}
          />

          <StatCard
            label="Safety Rating"
            value="5 ★"
            accent="teal"
            icon={<Shield size={20} />}
            highlight
          />

          <StatCard
            label="Annual Service"
            prefix="₹"
            value="18,000"
            unit="/yr"
            accent="purple"
            icon={<Wrench size={20} />}
          />
        </div>
      </Section>

    </div>
  )
}