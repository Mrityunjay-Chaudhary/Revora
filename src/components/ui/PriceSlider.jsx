import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IndianRupee } from 'lucide-react'
import clsx from 'clsx'

/**
 * PriceSlider
 *
 * A dual-handle range slider for budget selection, formatted in Indian Rupees (lakhs).
 *
 * Props:
 *   min        — number   minimum value (lakhs)            default: 5
 *   max        — number   maximum value (lakhs)            default: 60
 *   step       — number   step increment                   default: 0.5
 *   value      — [number, number]  [minVal, maxVal]
 *   onChange   — ([min, max]: [number, number]) => void
 *   accent     — 'teal' | 'amber'                         default: 'teal'
 *   showPresets— boolean                                   default: true
 *   label      — string                                    default: 'Budget Range'
 *   className  — string
 *
 * Usage:
 *   const [price, setPrice] = useState([8, 25])
 *   <PriceSlider value={price} onChange={setPrice} min={5} max={60} />
 */

const ACCENTS = {
  teal: {
    track: 'bg-[#00C8FF]',
    thumb: 'border-[#00C8FF] shadow-[0_0_12px_rgba(0,200,255,0.5)]',
    text: 'text-[#00C8FF]',
    tag: 'bg-[#00C8FF]/12 text-[#00C8FF] border-[#00C8FF]/25',
    presetActive: 'bg-[#00C8FF]/15 border-[#00C8FF]/40 text-[#00C8FF]',
    presetHover: 'hover:bg-[#00C8FF]/8 hover:border-[#00C8FF]/25 hover:text-[#00C8FF]',
  },
  amber: {
    track: 'bg-[#FF8C35]',
    thumb: 'border-[#FF8C35] shadow-[0_0_12px_rgba(255,140,53,0.5)]',
    text: 'text-[#FF8C35]',
    tag: 'bg-[#FF8C35]/12 text-[#FF8C35] border-[#FF8C35]/25',
    presetActive: 'bg-[#FF8C35]/15 border-[#FF8C35]/40 text-[#FF8C35]',
    presetHover: 'hover:bg-[#FF8C35]/8 hover:border-[#FF8C35]/25 hover:text-[#FF8C35]',
  },
}

const PRESETS = [
  { label: 'Under ₹10L', range: [5, 10] },
  { label: '₹10–15L', range: [10, 15] },
  { label: '₹15–25L', range: [15, 25] },
  { label: '₹25L+', range: [25, 60] },
]

function formatLakh(val) {
  if (val >= 100) return `${(val / 100).toFixed(1)} Cr`
  return `${val % 1 === 0 ? val : val.toFixed(1)}L`
}

export default function PriceSlider({
  min = 5,
  max = 60,
  step = 0.5,
  value = [8, 25],
  onChange,
  accent = 'teal',
  showPresets = true,
  label = 'Budget Range',
  className,
}) {
  const [localMin, setLocalMin] = useState(value[0])
  const [localMax, setLocalMax] = useState(value[1])
  const [activeThumb, setActiveThumb] = useState(null)
  const trackRef = useRef(null)
  const ac = ACCENTS[accent] ?? ACCENTS.teal

  // Sync external value
  useEffect(() => {
    setLocalMin(value[0])
    setLocalMax(value[1])
  }, [value[0], value[1]])

  const toPercent = (v) => ((v - min) / (max - min)) * 100

  const handleMinChange = (e) => {
    const next = Math.min(Number(e.target.value), localMax - step)
    setLocalMin(next)
    onChange?.([next, localMax])
  }

  const handleMaxChange = (e) => {
    const next = Math.max(Number(e.target.value), localMin + step)
    setLocalMax(next)
    onChange?.([localMin, next])
  }

  const applyPreset = ([pMin, pMax]) => {
    const clampedMin = Math.max(pMin, min)
    const clampedMax = Math.min(pMax, max)
    setLocalMin(clampedMin)
    setLocalMax(clampedMax)
    onChange?.([clampedMin, clampedMax])
  }

  const isPresetActive = ([pMin, pMax]) =>
    Math.abs(localMin - pMin) < 0.5 && Math.abs(localMax - pMax) < 0.5

  const leftPct = toPercent(localMin)
  const rightPct = toPercent(localMax)

  return (
    <div className={clsx('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <IndianRupee size={13} className={ac.text} aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6060808]">
            {label}
          </span>
        </div>
        {/* Selected range display */}
        <div className={clsx('flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg border', ac.tag)}>
          <span>{formatLakh(localMin)}</span>
          <span className="opacity-50">–</span>
          <span>{formatLakh(localMax)}</span>
        </div>
      </div>

      {/* Track + Thumbs */}
      <div className="relative h-8 flex items-center" ref={trackRef}>
        {/* Track background */}
        <div className="absolute inset-x-0 h-1 bg-[#1A1A2E] rounded-full" />

        {/* Active range fill */}
        <motion.div
          className={clsx('absolute h-1 rounded-full', ac.track)}
          style={{
            left: `${leftPct}%`,
            right: `${100 - rightPct}%`,
          }}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Min thumb label */}
        <motion.div
          className={clsx(
            'absolute -top-6 text-[10px] font-mono px-1.5 py-0.5 rounded',
            ac.text,
            activeThumb === 'min' ? 'opacity-100' : 'opacity-0'
          )}
          style={{ left: `calc(${leftPct}% - 14px)` }}
          animate={{ opacity: activeThumb === 'min' ? 1 : 0, y: activeThumb === 'min' ? 0 : 4 }}
        >
          {formatLakh(localMin)}
        </motion.div>

        {/* Max thumb label */}
        <motion.div
          className={clsx(
            'absolute -top-6 text-[10px] font-mono px-1.5 py-0.5 rounded',
            ac.text,
            activeThumb === 'max' ? 'opacity-100' : 'opacity-0'
          )}
          style={{ left: `calc(${rightPct}% - 14px)` }}
          animate={{ opacity: activeThumb === 'max' ? 1 : 0, y: activeThumb === 'max' ? 0 : 4 }}
        >
          {formatLakh(localMax)}
        </motion.div>

        {/* Min range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={handleMinChange}
          onMouseDown={() => setActiveThumb('min')}
          onTouchStart={() => setActiveThumb('min')}
          onMouseUp={() => setActiveThumb(null)}
          onTouchEnd={() => setActiveThumb(null)}
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={localMax}
          aria-valuenow={localMin}
          aria-valuetext={`₹${formatLakh(localMin)}`}
          className={clsx(
            'absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none',
            '[&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2',
            '[&::-webkit-slider-thumb]:bg-[#0D0D16] [&::-webkit-slider-thumb]:cursor-grab',
            '[&::-webkit-slider-thumb:active]:cursor-grabbing',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:transition-shadow',
            ac.thumb.split(' ').map(c => `[&::-webkit-slider-thumb]:${c}`).join(' ')
          )}
          style={{ zIndex: localMin > max - 10 ? 5 : 3 }}
        />

        {/* Max range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={handleMaxChange}
          onMouseDown={() => setActiveThumb('max')}
          onTouchStart={() => setActiveThumb('max')}
          onMouseUp={() => setActiveThumb(null)}
          onTouchEnd={() => setActiveThumb(null)}
          aria-label="Maximum price"
          aria-valuemin={localMin}
          aria-valuemax={max}
          aria-valuenow={localMax}
          aria-valuetext={`₹${formatLakh(localMax)}`}
          className={clsx(
            'absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none',
            '[&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2',
            '[&::-webkit-slider-thumb]:bg-[#0D0D16] [&::-webkit-slider-thumb]:cursor-grab',
            '[&::-webkit-slider-thumb:active]:cursor-grabbing',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:transition-shadow',
            ac.thumb.split(' ').map(c => `[&::-webkit-slider-thumb]:${c}`).join(' ')
          )}
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between mt-2 text-[10px] font-mono text-[#3A3A5A]">
        <span>₹{formatLakh(min)}</span>
        <span>₹{formatLakh(max)}</span>
      </div>

      {/* Presets */}
      {showPresets && (
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {PRESETS.map((preset) => {
            const active = isPresetActive(preset.range)
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.range)}
                className={clsx(
                  'text-[10px] font-medium py-1.5 px-1 rounded-lg border transition-all duration-150',
                  'text-center leading-tight',
                  active
                    ? ac.presetActive
                    : ['border-white/8 text-[#5050708]', ac.presetHover]
                )}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}