import { useCallback, useState } from "react"

const LOCAL_STORAGE_ADDRESS_KEY = "ls-address-key"
const setLocalStorageAddress = (address?: string) =>
{
	if (address)
		localStorage[LOCAL_STORAGE_ADDRESS_KEY] = address
}

const getLocalStorageAddress = () => localStorage[LOCAL_STORAGE_ADDRESS_KEY] || undefined

export const useAddress = () =>
{
	const [address, setAddress] = useState(getLocalStorageAddress())

	const setAddressCallback = useCallback((address?: string | null) =>
	{
		setAddress(address || "")
		setLocalStorageAddress(address || "")
	}, [])

	return [address, setAddressCallback]
}
