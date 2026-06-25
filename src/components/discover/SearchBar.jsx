import { Search } from 'lucide-react'

export default function SearchBar({
  value,
  onChange,
}) {
  return (
    <div className="relative flex-1">
      
      <Search
        size={18}
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          text-[#7070A0]
        "
      />

      <input
        type="text"
        placeholder="Search cars, brands, body types..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-14 pl-12 pr-4
          rounded-2xl
          bg-white/[0.03]
          border border-white/[0.08]
          text-white
          placeholder:text-[#606080]
          outline-none
          transition-all duration-200
          focus:border-[#00C8FF]
          focus:bg-white/[0.05]
        "
      />
    </div>
  )
}