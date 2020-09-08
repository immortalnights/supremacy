
export const YEAR_LENGTH = 64

export const format = date => {
	return `${date.d} / ${date.y}`
}

export const next = date => {
	const next = { ...date }

	if (date.d === 64)
	{
		next.y = next.y + 1
		next.d = 1
	}
	else
	{
		next.d = next.d + 1
	}

	return next
}

export const fromDays = days => {
	return {
		d: days % YEAR_LENGTH,
		y: Math.floor(days / YEAR_LENGTH)
	}
}

export const equal = (a, b) => {
	return a.d === b.d && a.y === b.y
}

export const lessThen = (a, b) => {
	return a.y < b.y || (a.y === b.y && a.d < b.d)
}

export const add = (a, b) => {
	const days = a.d + b.d
	return {
		d: (days % YEAR_LENGTH),
		y: (a.y + b.y + Math.floor(days / YEAR_LENGTH))
	}
}

// Return number of days between two dates
export const diff = (a, b) => {
	return ((a.y - b.y) * YEAR_LENGTH) + (a.d - b.d)
}

export default {
	YEAR_LENGTH,
	format,
	next,
	fromDays,
	equal,
	lessThen,
	add,
	diff
}