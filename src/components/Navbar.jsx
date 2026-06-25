import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Search, Heart, BarChart3, Zap, Menu, X,
  ChevronRight, ArrowRight, Gauge, Car,
} from 'lucide-react'
import clsx from 'clsx'
import { PrimaryButton, SecondaryButton } from './ui'
import { useApp } from '../contexts/AppContext'

// ─── Nav link config ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  {
    label: 'Discover',
    href: '/discover',
    icon: Search,
    description: 'Browse all vehicles',
  },
  {
    label: 'Compare',
    href: '/compare',
    icon: BarChart3,
    description: 'Side-by-side analysis',
    hasBadge: true,
    badgeKey: 'comparison',
  },
  {
    label: 'AI Match',
    href: '/recommendations',
    icon: Zap,
    description: 'Personalised picks',
  },
]

// ─── Scroll threshold before glass effect kicks in ───────────────────────────
const SCROLL_THRESHOLD = 40

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ compact = false }) {
  return (
    <Link
      to="/"
      aria-label="REVORA home"
      className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]/40 rounded-xl p-1"
    >
      {/* Icon mark */}
      <motion.div
        whileHover={{ scale: 1.07 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#00C8FF] to-[#006A99] flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(0,200,255,0.35)]"
      >
        <span className="font-display font-black text-[#020D12] text-[15px] leading-none select-none">
          R
        </span>
        {/* Glint */}
        <span className="absolute top-[3px] left-[4px] w-[7px] h-[3px] rounded-full bg-white/35 rotate-[-20deg]" />
      </motion.div>

      {/* Wordmark */}
      {!compact && (
        <span className="font-display font-bold text-[1.35rem] tracking-[-0.01em] leading-none select-none">
          <span className="text-[#F0F0F8]">REV</span>
          <span className="text-[#00C8FF]">ORA</span>
        </span>
      )}
    </Link>
  )
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────
function NavLink({ link, active, comparisonCount, savedCount }) {
  const Icon = link.icon
  const badge =
    link.badgeKey === 'comparison' ? comparisonCount :
    link.badgeKey === 'saved'      ? savedCount       : 0

  return (
    <Link
      to={link.href}
      className={clsx(
        'relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium',
        'transition-all duration-200 outline-none group',
        'focus-visible:ring-2 focus-visible:ring-[#00C8FF]/40',
        active
          ? 'text-[#F0F0F8] bg-white/8'
          : 'text-[#7070A0] hover:text-[#C0C0D8] hover:bg-white/5'
      )}
    >
      <Icon
        size={14}
        className={clsx(
          'transition-colors duration-200',
          active ? 'text-[#00C8FF]' : 'text-inherit'
        )}
        aria-hidden
      />
      {link.label}

      {/* Count badge */}
      {badge > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-0.5 min-w-[18px] h-[18px] rounded-full bg-[#00C8FF] text-[#030308] text-[9px] font-black flex items-center justify-center px-1 leading-none"
        >
          {badge}
        </motion.span>
      )}

      {/* Active dot */}
      {active && (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute inset-x-3 -bottom-1 h-px bg-gradient-to-r from-transparent via-[#00C8FF] to-transparent"
        />
      )}
    </Link>
  )
}

// ─── Saved / compare icon buttons ────────────────────────────────────────────
function IconBadgeButton({ to, icon: Icon, count, label, accentColor = '#00C8FF' }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative p-2 rounded-xl text-[#6060808] hover:text-[#C0C0D8] hover:bg-white/6 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00C8FF]/40 outline-none"
    >
      <Icon size={17} aria-hidden />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full text-[9px] font-black flex items-center justify-center px-1 leading-none"
            style={{ background: accentColor, color: '#030308' }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

// ─── Mobile menu panel ────────────────────────────────────────────────────────
const mobileMenuVariants = {
  closed: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const mobileItemVariants = {
  closed: { opacity: 0, x: -10 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.06 + i * 0.06, duration: 0.25 },
  }),
}

function MobileMenu({ open, onClose, location, comparisonCount, savedCount, navigate }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[64px] z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={clsx(
              'fixed top-[64px] left-0 right-0 z-50',
              'bg-[#0A0A14]/97 backdrop-blur-2xl',
              'border-b border-white/8',
              'shadow-[0_24px_64px_rgba(0,0,0,0.7)]',
            )}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-5 space-y-1">
              {/* Nav links */}
              {NAV_LINKS.map((link, i) => {
                const Icon = link.icon
                const isActive = location.pathname === link.href
                const badge =
                  link.badgeKey === 'comparison' ? comparisonCount :
                  link.badgeKey === 'saved'      ? savedCount       : 0

                return (
                  <motion.div key={link.href} custom={i} variants={mobileItemVariants}>
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className={clsx(
                        'flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-150',
                        isActive
                          ? 'bg-[#00C8FF]/10 text-[#00C8FF]'
                          : 'text-[#9090B0] hover:bg-white/5 hover:text-[#F0F0F8]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={clsx(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                          isActive ? 'bg-[#00C8FF]/15' : 'bg-white/5'
                        )}>
                          <Icon size={16} aria-hidden />
                        </span>
                        <div>
                          <div className="text-sm font-semibold">{link.label}</div>
                          <div className="text-[11px] text-[#505070] mt-0.5">{link.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {badge > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[#00C8FF] text-[#030308] text-[9px] font-black flex items-center justify-center">
                            {badge}
                          </span>
                        )}
                        <ChevronRight size={14} className="text-[#3A3A5A]" aria-hidden />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}

              {/* Saved link */}
              <motion.div custom={NAV_LINKS.length} variants={mobileItemVariants}>
                <Link
                  to="/saved"
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[#9090B0] hover:bg-white/5 hover:text-[#F0F0F8] transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Heart size={16} aria-hidden />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">Saved Cars</div>
                      <div className="text-[11px] text-[#505070] mt-0.5">Your wishlist</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {savedCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#FF8C35] text-[#030308] text-[9px] font-black flex items-center justify-center">
                        {savedCount}
                      </span>
                    )}
                    <ChevronRight size={14} className="text-[#3A3A5A]" aria-hidden />
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              custom={NAV_LINKS.length + 1}
              variants={mobileItemVariants}
              className="px-4 pb-6 pt-2"
            >
              <PrimaryButton
                variant="teal"
                size="lg"
                fullWidth
                icon={<Zap size={16} />}
                onClick={() => { navigate('/recommendations'); onClose() }}
              >
                Match My Lifestyle
              </PrimaryButton>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const location                      = useLocation()
  const navigate                      = useNavigate()
  const { savedCount, comparisonCount } = useApp()

  // Scroll detection
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > SCROLL_THRESHOLD)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isLanding = location.pathname === '/'

  return (
    <>
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50',
          'h-16 flex items-center',
          'transition-all duration-300 ease-out',
          scrolled || !isLanding || mobileOpen
            ? 'bg-[#06060C]/85 backdrop-blur-2xl border-b border-white/7 shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-b border-transparent'
        )}
        role="banner"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Left: Logo */}
          <Logo />

          {/* Center: Nav links (desktop) */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                link={link}
                active={location.pathname === link.href}
                comparisonCount={comparisonCount}
                savedCount={savedCount}
              />
            ))}
          </nav>

          {/* Right: Actions (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <IconBadgeButton
              to="/saved"
              icon={Heart}
              count={savedCount}
              label={`Saved cars (${savedCount})`}
              accentColor="#FF8C35"
            />
            <IconBadgeButton
              to="/compare"
              icon={BarChart3}
              count={comparisonCount}
              label={`Compare list (${comparisonCount})`}
              accentColor="#00C8FF"
            />

            <div className="w-px h-5 bg-white/10 mx-1" aria-hidden />

            <PrimaryButton
              variant="teal"
              size="sm"
              icon={<Zap size={13} />}
              onClick={() => navigate('/recommendations')}
              className="!text-[11px]"
            >
              AI Match
            </PrimaryButton>
          </div>

          {/* Right: Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <IconBadgeButton
              to="/saved"
              icon={Heart}
              count={savedCount}
              label="Saved cars"
              accentColor="#FF8C35"
            />
            <IconBadgeButton
              to="/compare"
              icon={BarChart3}
              count={comparisonCount}
              label="Comparison list"
              accentColor="#00C8FF"
            />
            <motion.button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-xl text-[#7070A0] hover:text-[#F0F0F8] hover:bg-white/8 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]/40"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <MobileMenu
        id="mobile-menu"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        location={location}
        comparisonCount={comparisonCount}
        savedCount={savedCount}
        navigate={navigate}
      />
    </>
  )
}