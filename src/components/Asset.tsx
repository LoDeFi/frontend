import React from "react"
import { AddressAsset } from "defi-sdk"
import styles from "./Asset.module.css"
import BigNumber from "bignumber.js"

type AssetProps = {
	addressAsset: AddressAsset
}

export const getAssetValue = ({ quantity, asset }: AddressAsset) =>
	new BigNumber(quantity).shiftedBy(0 - asset.decimals)

export const getAssetPrice = ({ quantity, asset }: AddressAsset) =>
{
	if (asset.price?.value)
	{
		return getAssetValue({ quantity, asset }).times(asset.price?.value)
	}
	return new BigNumber(0)
}

export const get24hDiff = ({ quantity, asset }: AddressAsset) =>
{
	if (asset.price?.relative_change_24h)
	{
		return getAssetPrice({ quantity, asset }).times(
			asset.price?.relative_change_24h / 100,
		)
	}
	return 0
}

export const AssetValue: React.FC<{ value: number | BigNumber, diff: number | BigNumber }> = ({ value: price, diff }) => (
	<div className={styles.value}>
		<div className={styles.number}>{`${price.toFixed(
			2,
		)}$`}</div>
		<div
			className={styles.number}
			style={{
				color: (+diff) < 0 ? "#ff4a4a" : "#01a643",
			}}
		>{`${diff.toFixed(2)}$`}</div>
	</div>
)

export const Asset = ({ addressAsset }: AssetProps) =>
{
	const { asset } = addressAsset
	return (
		<div className={styles.asset}>
			<img
				className={styles.icon}
				src={asset.icon_url || ""}
				alt={asset.symbol?.slice(0, 3).toUpperCase() || 'TOK'}
			/>
			<span className={styles.title}>{asset.name}</span>
			<span className={styles.number}>{`${getAssetValue(addressAsset).toFixed(
				2,
			)}${asset.symbol}`}</span>
			<AssetValue
				value={getAssetPrice(addressAsset)}
				diff={get24hDiff(addressAsset)}
			/>
		</div>
	)
}
