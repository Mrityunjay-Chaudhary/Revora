import { useState, useRef, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, Clock, TrendingUp } from 'lucide-react'
import clsx from 'clsx'

/**
 * SearchInput
 *
 * Props:
 *   value         — string (controlled)
 *   onChange      — (value: string) => void
 *   onSearch      — (value: string) => void   (triggered on Enter / suggestion click)
 *   onClear       — () => void
 *   placeholder   — string                    default: 'Search cars, brands…'
 *   size          — 'sm' | 'md' | 'lg'       default: 'md'
 *   loading       — boolean                   default: false
 *   suggestions   — string[]                  default: []
 *   recentSearches— string[]                  default: []
 *   autoFocus     — boolean                   default: false
 *   fullWidth     — boolean                   default: true
 *   className     — string
 *
 * Usage:
 *   <SearchInput
 *     value={query}
 *     onChange={setQuery}
 *     onSearch={handleSearch}
 *     suggestions={['Tata Nexon', 'Hyundai Creta']}
 *     recentSearches={['Swift', 'XUV700']}
 *   />
 */

const SIZES = {
  sm: { wrap: 'h-9 rounded-xl text-sm', icon: 14, pad: 'pl-9 pr-8' },
  md: { wrap: 'h-11 rounded-2xl text-sm', icon: 16, pad: 'pl-11 pr-10' },
  lg: { wrap: 'h-14 rounded-2xl text-base', icon: 18, pad: 'pl-12 pr-11' },
}

const ICON_POS = { sm: 'left-2.5', md: 'left-3.5', lg: 'left-4' }
const CLEAR_POS = { sm: 'right-2', md: 'right-2.5', lg: 'right-3' }

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.2 },
  }),
}

const SearchInput = forwardRef(function SearchInput(
  {
    value = '',
    onChange,
    onSearch,
    onClear,
    placeholder = 'Search cars, brands…',
    size = 'md',
    loading = false,
    suggestions = [],
    recentSearches = [],
    autoFocus = false,
    fullWidth = true,
    className,
  },
  ref
) {
  const [focused, setFocused] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(-1)
  const inputRef = useRef(null)
  const wrapRef = useRef(null)
  const sz = SIZES[size]

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showDropdown =
    focused && (suggestions.length > 0 || (recentSearches.length > 0 && !value))

  const allItems = value
    ? suggestions.map((s) => ({ label: s, type: 'suggestion' }))
    : recentSearches.map((s) => ({ label: s, type: 'recent' }))

  const handleKeyDown = (e) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHoveredIdx((i) => Math.min(i + 1, allItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHoveredIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (hoveredIdx >= 0 && allItems[hoveredIdx]) {
        handleSelect(allItems[hoveredIdx].label)
      } else {
        onSearch?.(value)
        setFocused(false)
      }
    } else if (e.key === 'Escape') {
      setFocused(false)
    }
  }

  const handleSelect = (label) => {
    onChange?.(label)
    onSearch?.(label)
    setFocused(false)
    setHoveredIdx(-1)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange?.('')
    onClear?.()
    inputRef.current?.focus()
  }

  return (
    <div
      ref={wrapRef}
      className={clsx('relative', fullWidth ? 'w-full' : 'w-auto', className)}
    >
      {/* Input wrapper */}
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 2px rgba(0,200,255,0.35), 0 0 24px rgba(0,200,255,0.12)'
            : '0 0 0 1px rgba(255,255,255,0.08)',
        }}
        transition={{ duration: 0.2 }}
        className={clsx(
          'relative flex items-center',
          'bg-[#0D0D16]/80 backdrop-blur-xl',
          'border border-white/8 transition-colors duration-200',
          focused && 'border-[#00C8FF]/40 bg-[#0D0D16]/95',
          sz.wrap
        )}
      >
        {/* Search / Loader icon */}
        <span
          className={clsx(
            'absolute top-1/2 -translate-y-1/2 text-[#4A4A6A] transition-colors duration-200 pointer-events-none',
            ICON_POS[size],
            focused && 'text-[#00C8FF]'
          )}
          aria-hidden
        >
          {loading ? (
            <Loader2 size={sz.icon} className="animate-spin" />
          ) : (
            <Search size={sz.icon} />
          )}
        </span>

        {/* Input */}
        <input
          ref={(node) => {
            inputRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => { setFocused(true); setHoveredIdx(-1) }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          aria-label="Search cars"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          className={clsx(
            'w-full h-full bg-transparent font-body text-[#F0F0F8]',
            'placeholder:text-[#3A3A5A] outline-none',
            'transition-colors duration-200',
            sz.pad
          )}
        />

        {/* Clear button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 p-1 rounded-full',
                'text-[#4A4A6A] hover:text-[#F0F0F8] hover:bg-white/10',
                'transition-colors duration-150',
                CLEAR_POS[size]
              )}
            >
              <X size={sz.icon - 2} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && allItems.length > 0 && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
            aria-label="Search suggestions"
            className={clsx(
              'absolute z-50 top-full left-0 right-0 mt-2',
              'bg-[#0D0D16]/95 backdrop-blur-2xl',
              'border border-white/10 rounded-2xl',
              'shadow-[0_16px_48px_rgba(0,0,0,0.6)]',
              'overflow-hidden'
            )}
          >
            {/* Section header */}
            <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
              {value ? (
                <>
                  <TrendingUp size={12} className="text-[#00C8FF]" aria-hidden />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4A4A6A]">
                    Suggestions
                  </span>
                </>
              ) : (
                <>
                  <Clock size={12} className="text-[#FF8C35]" aria-hidden />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4A4A6A]">
                    Recent Searches
                  </span>
                </>
              )}
            </div>

            <ul className="pb-2">
              {allItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  role="option"
                  aria-selected={hoveredIdx === i}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(-1)}
                    onClick={() => handleSelect(item.label)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-2.5',
                      'text-sm text-left transition-colors duration-100',
                      hoveredIdx === i
                        ? 'bg-[#00C8FF]/8 text-[#F0F0F8]'
                        : 'text-[#8080A0] hover:text-[#F0F0F8]'
                    )}
                  >
                    <span
                      className={clsx(
                        'shrink-0',
                        item.type === 'recent' ? 'text-[#FF8C35]/60' : 'text-[#00C8FF]/60'
                      )}
                      aria-hidden
                    >
                      {item.type === 'recent' ? (
                        <Clock size={13} />
                      ) : (
                        <Search size={13} />
                      )}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default SearchInput