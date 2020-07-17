
export const addDates = (a, b) => {
	const totalMonths = a.m + b.m
	return {
		m: (totalMonths % 12),
		y: (a.y + b.y + Math.floor(totalMonths / 12))
	}
}