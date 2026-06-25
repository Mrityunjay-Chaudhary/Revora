import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, SlidersHorizontal } from 'lucide-react'
import clsx from 'clsx'

/**
 * FilterDropdown
 *
 * Props:
 *   label       — string  (trigger label)
 *   options     — { id: string; label: string; count?: number }[]
 *   value       — string | string[]  (selected id(s))
 *   onChange    — (value: string | string[]) => void
 *   multi       — boolean (multi-select mode)     default: false
 *   placeholder — string                          default: 'Select…'
 *   icon        — ReactNode (optional left icon)
 *   accent      — 'teal' | 'amber'               default: 'teal'
 *   size        — 'sm' | 'md'                    default: 'md'
 *   align       — 'left' | 'right'               default: 'left'
 *   className   — string
 *
 * Usage:
 *   <FilterDropdown
 *     label="Fuel Type"
 *     options={[{ id: 'petrol', label: 'Petrol', count: 12 }]}
 *     value={fuelType}
 *     onChange={setFuelType}
 *   />
 *
 *   <FilterDropdown
 *     label="Body Type"
 *     options={bodyTypes}
 *     value={selectedTypes}
 *     onChange={setSelectedTypes}
 *     multi
 *   />
 */

const ACCENTS = {
  teal: {
    ring: 'border-[#00C8FF]/50',
    check: 'text-[#00C8FF]',
    checkBg: 'bg-[#00C8FF]/12',
    dot: 'bg-[#00C8FF]',
    hoverRow: 'hover:bg-[#00C8FF]/6',
    activeRow: 'bg-[#00C8FF]/10',
  },
  amber: {
    ring: 'border-[#FF8C35]/50',
    check: 'text-[#FF8C35]',
    checkBg: 'bg-[#FF8C35]/12',
    dot: 'bg-[#FF8C35]',
    hoverRow: 'hover:bg-[#FF8C35]/6',
    activeRow: 'bg-[#FF8C35]/10',
  },
}

const SIZES = {
  sm: 'h-8 px-3 text-xs rounded-xl gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
}

const panelVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.14 } },
}

export default function FilterDropdown({
  label,
  options = [],
  value,
  onChange,
  multi = false,
  placeholder = 'Select…',
  icon,
  accent = 'teal',
  size = 'md',
  align = 'left',
  className,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const ac = ACCENTS[accent] ?? ACCENTS.teal

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Helpers ────────────────────────────────────────────────
  const isSelected = (id) =>
    multi ? (Array.isArray(value) ? value.includes(id) : false) : value === id

  const selectedCount = multi
    ? Array.isArray(value) ? value.length : 0
    : value ? 1 : 0

  const displayLabel = () => {
    if (!selectedCount) return placeholder
    if (multi) {
      if (selectedCount === 1) return options.find((o) => isSelected(o.id))?.label ?? placeholder
      return `${selectedCount} selected`
    }
    return options.find((o) => o.id === value)?.label ?? placeholder
  }

  const handleSelect = (id) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : []
      const next = arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id]
      onChange?.(next)
    } else {
      onChange?.(value === id ? '' : id)
      setOpen(false)
    }
  }

  const clearAll = (e) => {
    e.stopPropagation()
    onChange?.(multi ? [] : '')
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div ref={ref} className={clsx('relative inline-block', className)}>

      {/* Trigger */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          'flex items-center font-body font-medium select-none outline-none',
          'bg-[#0D0D16]/80 backdrop-blur-xl border transition-all duration-200',
          open ? [ac.ring, 'border-opacity-100'] : 'border-white/10 hover:border-white/20',
          SIZES[size],
          selectedCount > 0 ? 'text-[#F0F0F8]' : 'text-[#7070A0]',
          'focus-visible:ring-2 focus-visible:ring-[#00C8FF]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060C]'
        )}
      >
        {/* Left icon */}
        {icon && (
          <span className={clsx('shrink-0', selectedCount ? 'text-inherit' : 'text-[#4A4A6A]')} aria-hidden>
            {icon}
          </span>
        )}

        {/* Label */}
        <span className="flex-1 text-left truncate max-w-[140px]">{displayLabel()}</span>

        {/* Active count badge */}
        {selectedCount > 0 && (
          <motion.button
            type="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={clearAll}
            aria-label="Clear filter"
            className={clsx(
              'shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
              'text-[9px] font-bold',
              ac.checkBg, ac.check,
              'hover:opacity-70 transition-opacity'
            )}
          >
            ×
          </motion.button>
        )}

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[#4A4A6A]"
          aria-hidden
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
            aria-multiselectable={multi}
            className={clsx(
              'absolute z-50 top-full mt-2 min-w-[180px] w-max max-w-[240px]',
              align === 'right' ? 'right-0' : 'left-0',
              'bg-[#0C0C18]/96 backdrop-blur-2xl',
              'border border-white/10 rounded-2xl',
              'shadow-[0_16px_48px_rgba(0,0,0,0.65)]',
              'overflow-hidden'
            )}
          >
            {/* Header */}
            {label && (
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6">
                <SlidersHorizontal size={12} className={ac.check} aria-hidden />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4A4A6A]">
                  {label}
                </span>
              </div>
            )}

            {/* Options */}
            <ul className="py-1.5 max-h-60 overflow-y-auto">
              {options.map((opt) => {
                const sel = isSelected(opt.id)
                return (
                  <li key={opt.id} role="option" aria-selected={sel}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.id)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-2.5',
                        'text-sm text-left transition-colors duration-100 outline-none',
                        sel
                          ? [ac.activeRow, ac.check, 'font-medium']
                          : ['text-[#8888AA]', ac.hoverRow, 'hover:text-[#F0F0F8]'],
                        'focus-visible:bg-white/5'
                      )}
                    >
                      {/* Checkbox */}
                      <span
                        className={clsx(
                          'shrink-0 w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all duration-150',
                          sel
                            ? [ac.checkBg, 'border-transparent']
                            : 'border-white/15 bg-transparent'
                        )}
                        aria-hidden
                      >
                        {sel && <Check size={10} strokeWidth={3} className={ac.check} />}
                      </span>

                      {/* Label */}
                      <span className="flex-1 truncate">{opt.label}</span>

                      {/* Count badge */}
                      {opt.count !== undefined && (
                        <span className={clsx(
                          'text-[10px] font-mono px-1.5 py-0.5 rounded-md',
                          sel ? [ac.checkBg, ac.check] : 'bg-white/5 text-[#4A4A6A]'
                        )}>
                          {opt.count}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Footer for multi */}
            {multi && selectedCount > 0 && (
              <div className="border-t border-white/6 px-4 py-2 flex justify-between items-center">
                <span className={clsx('text-xs font-medium', ac.check)}>
                  {selectedCount} selected
                </span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-[#4A4A6A] hover:text-[#F0F0F8] transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}