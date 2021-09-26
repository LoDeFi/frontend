import BigNumber from "bignumber.js"
import { AddressAsset } from "defi-sdk"
import React, { useContext } from "react"
import { AssetsContext, getHighestAsset, getNextHighestAsset } from "../Assets"
import { LodefiJson } from "../lodefi-types"
import { RepositoryContext } from "../RepositoryContext"
import { AssetValue, get24hDiff, getAssetPrice } from "./Asset"
import styles from "./Asset.module.css"


export const LoyaltyProgramNextLevel: React.FC<{ lvl: ReturnType<typeof getNextHighestAsset> }> = ({ lvl }) =>
{
	switch (lvl.level)
	{
		case "none":
			return null
		case "max":
			return <div>Max level achieved</div>
		case "next":
			return <div>Next level: <b>{lvl.next.name}</b></div>
	}
}

export const LoyaltyProgramCurrentStatus: React.FC<{ program: LodefiJson }> = ({ program }) =>
{
	let assets = React.useContext(AssetsContext)

	if (!program || !assets)
		return <div>{JSON.stringify(program)}<br/>{JSON.stringify(assets)}</div>
	
	let highestAsset = getHighestAsset(program, assets)

	let nextAsset = getNextHighestAsset(program, assets)

	let allAssets = program.tokens
		.map(token => ({ token, asset: assets[token.asset] as AddressAsset | undefined , imgSrc: token.imgAward}))

	// console.log(`LoyaltyProgramCurrentStatus highest asset:`, highestAsset, program)

	return (
		<>	<div className={styles.CurrentStatus}>
				{highestAsset && <div>
				Current level: <b>{highestAsset.name}</b>
				</div>}
				{nextAsset && <div>
					<LoyaltyProgramNextLevel lvl={nextAsset} />
				</div>}
			</div>
			
			{allAssets.map(x => (
				<div key={x.token.asset}>
					<LoyaltyProgramRightInfo name={x.token.name} amount = {x.asset && <span className={styles.Owned}>Owned: {x.asset.quantity}</span>} img = {x.imgSrc}/>
				</div>
			))}
		</>
	)
}

export const LoyaltyProgramRightInfo: React.FC<{name: string, amount: any, img: string | undefined}> = ({ name, amount,img }) =>
{
	return <LoyaltyProgramPure
		title={name}
		icon_url={img}
		icon_alt="{hehe}"
		subtitle={amount}
		value={0}
		diff={0}
	/>
}

export const LoyaltyProgramShortInfo: React.FC<{ program: LodefiJson }> = ({ program }) =>
{
	let assets = React.useContext(AssetsContext)

	if (!program || !assets)
		return <div>{JSON.stringify(program)}<br/>{JSON.stringify(assets)}</div>

	let highestAsset = getHighestAsset(program, assets)

	let myAssets = program.tokens
		.map(x => assets[x.asset])
		.filter(x => !!x)

	console.log(myAssets)

	let totalValue = myAssets
		.map(getAssetPrice)
		.reduce((acc, cur) => acc.plus(cur), new BigNumber(0))
	
	let totalChange = myAssets
		.map(get24hDiff)
		.reduce((acc: BigNumber, cur) => acc.plus(cur), new BigNumber(0))

	return <LoyaltyRight
		title={program.businessName}
		icon_url={program.iconUrl}
		icon_alt={program.businessName}
		subtitle={highestAsset?.name || ""}
		value={totalValue}
		diff={totalChange}
	/>
}


export type LoyaltyProgramPureProps = {
	icon_url?: string
	icon_alt: string
	title: string
	subtitle: string
	value: number | BigNumber
	diff: number | BigNumber
}
export const LoyaltyProgramPure: React.FC<LoyaltyProgramPureProps> = props => (
	<div className={styles.asset}>
		<img
			className={styles.icon}
			src={props.icon_url || ""}
			alt={props.icon_alt}
		/>
		<span className={styles.title}>{props.title}</span>
		<span className={styles.number}>{props.subtitle}</span>
	</div>
)

export const LoyaltyRight: React.FC<LoyaltyProgramPureProps> = props => (
	<div className={styles.asset}>
		<img
			className={styles.icon}
			src={props.icon_url || ""}
			alt={props.icon_alt}
		/>
		<span className={styles.title}>{props.title}</span>
		<span className={styles.number}>{props.subtitle}</span>
		<AssetValue value={props.value} diff={props.diff} />
	</div>
)

export const LoyaltyProgramsFlatList: React.FC<{ onSelect: (program: LodefiJson) => void, selected?: LodefiJson }> = ({ onSelect, selected }) =>
{
	let repo = useContext(RepositoryContext)

	if (repo.error)
		return <div>Error loading programs!</div>
	
	if (repo.loading || !repo.programs)
		return <div>Loading programs...</div>

	console.log(repo)

	return (
		<>
		{
			repo.programs.map(x => 
				<div
					key={x.businessName}
					onClick={e => { e.preventDefault(); onSelect(x) }}
					className={(x.businessName == selected?.businessName) ? styles.assetselected : ''}
				>
					<LoyaltyProgramShortInfo program={x} />
				</div>
			)
		}
		</>
	)
	
}
