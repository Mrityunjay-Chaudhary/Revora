import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Heart,
  Gauge,
  Fuel,
  Shield,
  Users,
  ArrowRight,
} from 'lucide-react'

import GlassCard from '../ui/GlassCard'
import StatusBadge from '../ui/StatusBadge'
import SecondaryButton from '../ui/SecondaryButton'

import { useApp } from '../../contexts/AppContext'

export default function CarCard({ car, index = 0 }) {
  const {
    toggleSaved,
    isSaved,
  } = useApp()

  const saved = isSaved(car.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
      }}
    >
      <GlassCard
        className="overflow-hidden group"
        hoverable
        padding="none"
      >

        {/* Top Gradient Area */}
        <div
          className={`relative h-48 bg-gradient-to-br ${car.gradient}`}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Save button */}
          <button
            onClick={() => toggleSaved(car.id)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center transition hover:scale-105"
          >
            <Heart
              size={18}
              className={
                saved
                  ? 'fill-[#FF8C35] text-[#FF8C35]'
                  : 'text-white'
              }
            />
          </button>

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <StatusBadge
              color="teal"
              variant="pill"
            >
              {car.badge}
            </StatusBadge>
          </div>

          {/* Car name */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">
              {car.brand}
            </p>

            <h3 className="font-display text-2xl text-white font-bold">
              {car.model}
            </h3>

            <p className="text-sm text-white/70 mt-1">
              {car.variant}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#5A5A78] mb-1">
                Starting Price
              </p>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  ₹{car.price?.min || '--'}
                </span>

                <span className="text-sm text-[#7070A0]">
                  lakh
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-[#7070A0]">
                Up to
              </p>

              <p className="text-sm text-white font-medium">
                ₹{car.price?.max || '--'}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3">
              <div className="flex items-center gap-2 mb-1">
                <Gauge size={14} className="text-[#00C8FF]" />
                <span className="text-xs text-[#7070A0]">
                  Mileage
                </span>
              </div>

              <p className="text-sm font-semibold text-white">
                {car.specs?.mileage || 'N/A'}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3">
              <div className="flex items-center gap-2 mb-1">
                <Fuel size={14} className="text-[#FF8C35]" />
                <span className="text-xs text-[#7070A0]">
                  Fuel
                </span>
              </div>

              <p className="text-sm font-semibold text-white capitalize">
                {car.fuelType}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-[#00E096]" />
                <span className="text-xs text-[#7070A0]">
                  Safety
                </span>
              </div>

              <p className="text-sm font-semibold text-white">
                {car.safetyRating.gncap || 'N/A'} ★
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users size={14} className="text-[#A78BFA]" />
                <span className="text-xs text-[#7070A0]">
                  Seating
                </span>
              </div>

              <p className="text-sm font-semibold text-white">
                {car.seating} Seater
              </p>
            </div>

          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(car.tags || []).slice(0, 3).map((tag) => (
              <StatusBadge
                key={tag}
                variant="subtle"
                color="purple"
                size="xs"
              >
                {tag.replace(/-/g, ' ')}
              </StatusBadge>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <SecondaryButton
              variant="outline"
              className="flex-1"
            >
              Compare
            </SecondaryButton>

            <Link
              to={`/car/${car.id}`}
              className="flex-1"
            >
              <button
                className="
                  w-full h-full
                  rounded-2xl
                  bg-[#00C8FF]
                  text-[#02060A]
                  font-semibold
                  py-3
                  flex items-center justify-center gap-2
                  transition-all duration-200
                  hover:brightness-110
                "
              >
                Details
                <ArrowRight size={15} />
              </button>
            </Link>

          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}