export function filterCars(cars, filters) {
  return cars.filter((car) => {

    // Search
    const matchesSearch =
      !filters.search ||
      `${car.brand} ${car.name}`
        .toLowerCase()
        .includes(filters.search.toLowerCase())

    // Fuel
    const matchesFuel =
      !filters.fuelType ||
      car.fuelType === filters.fuelType

    // Price
    const matchesPrice =
      car.price >= filters.priceRange[0] &&
      car.price <= filters.priceRange[1]

    return (
      matchesSearch &&
      matchesFuel &&
      matchesPrice
    )
  })
}