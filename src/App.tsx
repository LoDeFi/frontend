import React from "react"
import { client } from "defi-sdk"
import styles from "./App.module.css"
import { AddressInput } from "./components"
import { useAddress } from "./hooks/useAddress"
import { Assets } from "./Assets"
import { History } from "./History"

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

export const App: React.FC = () =>
{
	const [address, setAddress] = useAddress()

	return (
		<div className={styles.page}>
			<header>
				<AddressInput onSubmit={setAddress} />
			</header>
			{address ? (
				<section className={styles.grid}>
					<div className={styles.column}>
						<h2>Assets</h2>
						<Assets address={address} />
					</div>
					<div className={styles.column}>
						<h2>History</h2>
						<History address={address} />
					</div>
				</section>
			) : (
				<section className={styles.noAddress}>No address to watch 🧐</section>
			)}
		</div>
	)
}
