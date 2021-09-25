import React from "react"
import { Transaction } from "./components"
import { useHistory } from "./hooks/useHistory"

type HistoryProps = {
	address?: string
}

export const History: React.FC<HistoryProps> = ({ address }) =>
{
	const txs = useHistory(address)

	if (!txs.value)
		return <div>Loading...</div>

	return (
		<>
			{txs.value.map(tx => (
				<Transaction key={tx.hash} transaction={tx} />
			))}
		</>
	)
}
