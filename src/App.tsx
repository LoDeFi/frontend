import React, { useState } from "react"
import { client } from "defi-sdk"
import styles from "./App.module.css"
import { AddressInput } from "./components"
import { useAddress } from "./hooks/useAddress"
import { AssetsFlatList, AssetsProvider } from "./Assets"
import { TxHistoryProvider, FlatTxList } from "./History"
import { RepositoryProvider } from "./RepositoryContext"
import { LodefiJson } from "./lodefi-types"
import { LoyaltyProgramCurrentStatus, LoyaltyProgramsFlatList } from "./components/LoyaltyProgramShortInfo"

export const endpoint = "wss://api-staging.zerion.io"
export const API_TOKEN = "Zerion.0JOY6zZTTw6yl5Cvz9sdmXc7d5AhzVMG"

client.configure({
	url: endpoint,
	apiToken: API_TOKEN,
	hooks: {
		willSendRequest: request =>
		{
			(request.payload as any).lol = "lol"
			return request
		},
	},
})
Object.assign(window, { client })

export const OldApp: React.FC = () =>
{
	const [address, setAddress] = useState<string | undefined>("")

	const [selectedProgram, setSelectedProgram] = useState<LodefiJson>()

	return (
		<div className={styles.page}>
			<header>
				<AddressInput onSubmit={setAddress} />
			</header>
			{address ? (
				<AssetsProvider address={address}>
					<section className={styles.grid}>
						<div className={styles.column}>
							<h2>Loyalty Programs</h2>

							<LoyaltyProgramsFlatList
								onSelect={setSelectedProgram}
								selected={selectedProgram}
							/>
							{/* <AssetsFlatList /> */}
						</div>
						{selectedProgram &&
							<div className={styles.column}>
								<h2>Achieved Levels</h2>
								<LoyaltyProgramCurrentStatus program={selectedProgram} />
								<TxHistoryProvider
									address={address}
									filterAddresses={selectedProgram.tokens.map(x => x.asset)}
								>
									<h2>History</h2>
									<FlatTxList />
								</TxHistoryProvider>
							</div>
						}
					</section>
				</AssetsProvider>
			) : (
				<section className={styles.noAddress}>No address to watch 🧐</section>
			)}
		</div>
	)
}

export const App: React.FC = () =>
{
	return (
		<RepositoryProvider>
			<OldApp></OldApp>
		</RepositoryProvider>
	)
}
