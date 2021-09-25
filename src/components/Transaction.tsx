import React from "react"
import { Transaction as HistoryTransaction, TransactionChange } from "defi-sdk"
import styles from "./Transaction.module.css"
import { capitalize, shortDateFormatter } from "../utils"
import BigNumber from "bignumber.js"

type TransactionProps = {
	transaction: HistoryTransaction
}

export function getOutcomeData(transaction: HistoryTransaction)
{
	let changes = (transaction.changes || []) as unknown as TransactionChange[]
	let numberOfIncomeAssets = changes.reduce((acc, item) => acc + (item.direction === "in" ? 1 : 0), 0)
	let numberOfOutcomeAssets = changes.reduce((acc, item) => acc + (item.direction === "out" ? 1 : 0), 0)

	if (numberOfIncomeAssets > 1)
		return `+${numberOfIncomeAssets} ASSETS`

	if (numberOfIncomeAssets === 1)
	{
		let incomeAsset = changes.find(asset => asset.direction === "in")
		if (!incomeAsset)
			return ""
			
		let quantityBN = new BigNumber(incomeAsset.value)
		let normalizedQuantity = quantityBN.shiftedBy(0 - incomeAsset.asset.decimals).toFixed(2)
		return `+${normalizedQuantity} ${incomeAsset.asset.symbol}`
	}

	if (numberOfOutcomeAssets === 1)
	{
		let outcomeAsset = changes.find(asset => asset.direction === "out")
		if (!outcomeAsset)
			return ""
			
		let quantityBN = new BigNumber(outcomeAsset.value)
		let normalizedQuantity = quantityBN.shiftedBy(0 - outcomeAsset.asset.decimals).toFixed(2)
		return `-${normalizedQuantity} ${outcomeAsset.asset.symbol}`
	}

	if (numberOfOutcomeAssets > 1)
		return `-${numberOfOutcomeAssets} ASSETS`

	return ""
}

export const Transaction = ({ transaction }: TransactionProps) =>
{
	return (
		<div className={styles.transaction}>
			<div>
				<div className={styles.type}>{capitalize(transaction.type)}</div>
				<div className={styles.date}>
					{shortDateFormatter.format(Number(transaction.mined_at) * 1000)}
				</div>
			</div>
			<div className={styles.value}>{getOutcomeData(transaction)}</div>
		</div>
	)
}
