import React from "react"
import { Transaction } from "./components"
import { useHistory } from "./hooks/useHistory"
import { Transaction as DFTx } from "defi-sdk"

type HistoryProps = {
	address?: string
	filterAddresses: string[]
}

export const TxHistoryContext = React.createContext<DFTx[]>([])

export const TxHistoryProvider: React.FC<HistoryProps> = ({ address, filterAddresses, children }) =>
{
	const txs = useHistory(address)

	if (!txs.value)
		return <div>Loading...</div>

	let ftxs = filterAddresses?.length
		? txs.value.filter(tx => filterAddresses.includes(tx.address_from!) || filterAddresses.includes(tx.address_to!))
		: txs.value

	return (
		<TxHistoryContext.Provider value={ftxs}>
			{children}
		</TxHistoryContext.Provider>
	)
}

export const FlatTxList: React.FC = () =>
{
	let txs = React.useContext(TxHistoryContext)

	return (
		<>
			{(txs.length)? (txs.map(tx => (
				<Transaction key={tx.hash} transaction={tx} />
			))) : (<div>
				There's no transaction yet...
			</div>)}
		</>
	)
}
