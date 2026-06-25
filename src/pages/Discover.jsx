import { useMemo, useState } from 'react'

import CarCard from '../components/car/CarCard'

import SearchBar from '../components/discover/SearchBar'
import FilterBar from '../components/discover/FilterBar'

import { CARS } from '../data/Cars'

export default function Discover() {

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [fuelType, setFuelType] = useState('all')

  // Dynamic filtering
  const filteredCars = useMemo(() => {
    console.log(CARS)

    return CARS.filter((car) => {

      // Search
      const matchesSearch =
      (car.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (car.brand || '').toLowerCase().includes(search.toLowerCase()) ||
      (car.tags || []).join(' ').toLowerCase().includes(search.toLowerCase())

      // Category
      const matchesCategory =
        category === 'all'
          ? true
          : car.category === category

      // Fuel
      const matchesFuel =
        fuelType === 'all'
          ? true
          : car.fuelType === fuelType

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFuel
      )
    })

  }, [search, category, fuelType])

  return (
    <div className="min-h-screen bg-[#06060C] pt-32 px-6 pb-20">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-[#00C8FF] uppercase tracking-[0.25em] text-xs mb-3">
            Explore Vehicles
          </p>

          <h1 className="text-5xl font-display font-bold text-white">
            Discover Cars
          </h1>

          <p className="text-[#7070A0] mt-4 max-w-2xl">
            Explore detailed ownership insights, safety ratings,
            real-world practicality, and AI-powered recommendations.
          </p>

        </div>

        {/* Search + Filters */}
        <div className="flex flex-col xl:flex-row gap-4 mb-10">

          <SearchBar
            value={search}
            onChange={setSearch}
          />

          <FilterBar
            category={category}
            setCategory={setCategory}
            fuelType={fuelType}
            setFuelType={setFuelType}
          />

        </div>

        {/* Result count */}
        <div className="mb-6">
          <p className="text-[#7070A0] text-sm">
            Showing
            <span className="text-white font-semibold mx-1">
              {filteredCars.length}
            </span>
            vehicles
          </p>
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredCars.map((car, index) => (
              <CarCard
                key={car.id}
                car={car}
                index={index}
              />
            ))}

          </div>

        ) : (

          <div
            className="
              h-[300px]
              rounded-3xl
              border border-white/[0.08]
              bg-white/[0.02]
              flex items-center justify-center
            "
          >
            <div className="text-center">
              
              <h3 className="text-2xl font-bold text-white mb-3">
                No cars found
              </h3>

              <p className="text-[#7070A0]">
                Try changing your filters or search.
              </p>

            </div>
          </div>

        )}

      </div>
    </div>
  )
}