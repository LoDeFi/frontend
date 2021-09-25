import React from "react"
import { useAddressAssets } from "defi-sdk"
import { Asset } from "./components"

type AssetsProps = {
	address?: string
}

export const Assets: React.FC<AssetsProps> = ({ address }) =>
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
		<>
			{Object.entries(assets.value).map(([code, asset]) => (
				<Asset key={code} addressAsset={asset} />
			))}
		</>
	)
}
