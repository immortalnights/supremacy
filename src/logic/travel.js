import date from './date'

export const calculateDistance = (origin, destination) => {
	return Math.abs(origin.location.y - destination.location.y)
}

export const calculateDuration = (distance, ship) => {
	const speed = ship.speed
	const days = distance / speed
	return date.fromDays(days)
}

export const calculateFuel = (distance, ship) => {
	// const weight = ship.weight
	const fuel = distance * 1.25
	return fuel
}

export const calculateTravel = (origin, destination, ship) => {
	const distance = calculateDistance(origin, destination)
	return {
		distance,
		duration: calculateDuration(distance, ship),
		fuel: calculateFuel(distance, ship)
	}
}