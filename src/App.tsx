import React, { useState } from "react";
import { client } from "defi-sdk";
import styles from "./App.module.css";
import { AddressInput } from "./components";
import { useAddress } from "./hooks/useAddress";
import { AssetsFlatList, AssetsProvider } from "./Assets";
import { TxHistoryProvider, FlatTxList } from "./History";
import { RepositoryProvider } from "./RepositoryContext";
import { LodefiJson } from "./lodefi-types";
import { LoyaltyProgramCurrentStatus, LoyaltyProgramsFlatList } from "./components/LoyaltyProgramShortInfo";
import Favorite from "./components/Favorite";

import Web3 from 'web3';
import { useEffect } from "react";

export const endpoint = "wss://api-staging.zerion.io";
export const API_TOKEN = "Zerion.0JOY6zZTTw6yl5Cvz9sdmXc7d5AhzVMG";


const loadBlockchainData = async () => {
	const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
	const accounts = await web3.eth.getAccounts();
	console.log("network", accounts[0])
}


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

	useEffect(() => {
		const accounts = loadBlockchainData();
		setAddress("0x7e5ce10826ee167de897d262fcc9976f609ecd2b");
		// вместо замоканного адреса из доки зериона 
		// можно взять web3.eth.getAccounts()[0]
	}, []);

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
							<div className={styles.row}>

								<h2>Loyalty Programs</h2>

								<LoyaltyProgramsFlatList
									onSelect={setSelectedProgram}
									selected={selectedProgram}
								/>
								{/* <AssetsFlatList /> */}
							</div>

							<div className={styles.row}>

								<h2>Your favorite loyalty</h2>

								<Favorite
									// onSelect={setSelectedProgram}
									// selected={selectedProgram}
								/>
								{/* <AssetsFlatList /> */}
							</div>
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
