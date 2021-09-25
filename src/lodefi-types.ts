export type LodefiJsonToken = {
	name: string
	chain: "eth" | "bsc" | "polygon"
	asset: string
	type: "points" | "level"
	imgAward?: string
}

export type LodefiJson = {
	businessName: string
	iconUrl: string
	tokens: LodefiJsonToken[]
}

export type LodefiJsonRepository = {
	list: string[]
}
