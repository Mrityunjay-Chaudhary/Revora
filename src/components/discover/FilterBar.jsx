export default function FilterBar({
  category,
  setCategory,
  fuelType,
  setFuelType,
}) {

  const categories = [
    'all',
    'suv',
    'sedan',
    'hatchback',
    'ev',
  ]

  const fuels = [
    'all',
    'petrol',
    'diesel',
    'electric',
    'hybrid',
  ]

  return (
    <div className="flex flex-wrap gap-4">

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="
          h-12 px-4 rounded-2xl
          bg-[#0F0F18]
          border border-white/[0.08]
          text-white
          outline-none
        "
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Fuel */}
      <select
        value={fuelType}
        onChange={(e) => setFuelType(e.target.value)}
        className="
          h-12 px-4 rounded-2xl
          bg-[#0F0F18]
          border border-white/[0.08]
          text-white
          outline-none
        "
      >
        {fuels.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

    </div>
  )
}