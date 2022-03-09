import { useState, useEffect } from 'react'

export const getLocalStorageValue = (key, defaultValue) => {
	const persistentValue = window.localStorage.getItem(key);
	return persistentValue !== null ? JSON.parse(persistentValue) : defaultValue;
}

export const usePersistentState = (key, defaultValue) => {
	const [ value, setValue ] = useState(() => {
		return getLocalStorageValue(key, defaultValue)
	});

	useEffect(() => {
		if (value == null)
		{
			window.localStorage.removeItem(key)
		}
		else
		{
			window.localStorage.setItem(key, JSON.stringify(value));
		}
	}, [key, value]);

	return [value, setValue];
}

export const usePersistentValue = key => {
	const [ value ] = useState(() => {
		return getLocalStorageValue(key, null)
	});

	return value;
}

