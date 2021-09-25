import React from "react"
import useSwr from "swr"
import axios from "axios"

import { LodefiJson, LodefiJsonRepository } from "./lodefi-types"

export type RepositoryContext = {
	programs?: LodefiJson[] | undefined
	loading: boolean
	error: any
}

export const RepositoryContext = React.createContext<RepositoryContext>({
	loading: false,
	error: undefined,
})

const REPOSITORY_URLS = [
	`https://lodefi.github.io/repository/list.json`
]

const filterFalsy = <T extends any>(arr: T[]) =>
	arr.filter(x => !!x) as (Exclude<T, undefined | null | "" | false | 0>)[]


const maybeJson = <T extends any>(obj: T | string): T =>
{
	if (typeof obj == "string")
		return JSON.parse(obj) as T

	return obj
}
const fetchPrograms = async (repoUrls: string[]) =>
{
	let repos = await Promise.allSettled(repoUrls.map(x => axios.get(x).then(x => maybeJson<LodefiJsonRepository>(x.data))))
	// console.log(`repos: `, repos)
	let programUrls = repos.map(x => (x.status == "fulfilled") ? x.value.list : []).flat()
	// console.log(`programUrls: `, programUrls)
	let programs = await Promise.allSettled(programUrls.map(x => axios.get(x).then(x => maybeJson<LodefiJson>(x.data))))
	// console.log(`programs: `, programs)
	let jsons = filterFalsy(programs.map(x => (x.status == "fulfilled") ? x.value : undefined))
	// console.log(`jsons: `, jsons)
	return jsons
}

const usePrograms = (urls: string[]): RepositoryContext =>
{
	const { data, error } = useSwr(urls.join(';'), () => fetchPrograms(urls))

	return {
		programs: data,
		loading: !error && !data,
		error,
	}
}

export const RepositoryProvider: React.FC = props =>
{
	let data = usePrograms(REPOSITORY_URLS)

	return (
		<RepositoryContext.Provider value={data}>
			{props.children}
		</RepositoryContext.Provider>
	)
}
