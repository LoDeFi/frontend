import React from "react"
import { AddressAsset, useAddressAssets } from "defi-sdk"
import { Asset } from "./components"
import { LodefiJson } from "./lodefi-types"

type AssetsProps = {
	address?: string
}

export const AssetsContext = React.createContext<Record<string, AddressAsset>>({})

export const AssetsProvider: React.FC<AssetsProps> = ({ address, children }) =>
{
	let assets = useAddressAssets(
		{
			currency: "USD",
			address: address || "",
		},
		{
			enabled: !!address,
		},
	)

	console.log(assets)

	if (!assets.value)
		return <div>Loading...</div>

	return (
		<AssetsContext.Provider value={assets.value}>
			{children}
		</AssetsContext.Provider>
	)
}

export const AssetsFlatList: React.FC = () =>
{
	let assets = React.useContext(AssetsContext)
	
	return (
		<>
			{Object.entries(assets).map(([code, asset]) => (
				<Asset key={code} addressAsset={asset} />
			))}
		</>
	)
}

export function getHighestAsset(program: LodefiJson, assets: Record<string, AddressAsset>)
{
	let amounts = program.tokens.map(x => assets[x.asset] ? parseFloat(assets[x.asset].quantity) : 0)
	console.log(`amounts: ${amounts}`)
	let highestAssetIdx = amounts.slice().reverse().findIndex(x => x > 0)
	if (highestAssetIdx < 0)
		return undefined
	
	return program.tokens[amounts.length - highestAssetIdx - 1]
}

export function getNextHighestAsset(program: LodefiJson, assets: Record<string, AddressAsset>)
{
	let amounts = program.tokens.map(x => assets[x.asset] ? parseFloat(assets[x.asset].quantity) : 0)
	console.log(`amounts: ${amounts}`)
	let highestAssetIdx = amounts.slice().reverse().findIndex(x => x > 0)
	if (highestAssetIdx < 0)
		return {
			level: "none" as const
		}

	if (highestAssetIdx == 0)
		return {
			level: "max" as const
		}

	return {
		level: "next" as const,
		next: program.tokens[amounts.length - highestAssetIdx]
	}
}
