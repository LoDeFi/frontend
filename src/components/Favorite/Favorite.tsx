import { useContext } from 'react'
import { RepositoryContext } from '../../RepositoryContext'
import './Favorite.css'
const Favorite = () => {
    let repo = useContext(RepositoryContext)

	if (repo.error)
		return <div>Error loading programs!</div>
	
	if (repo.loading || !repo.programs)
		return <div>Loading programs...</div>

        // ищем ассет с наибольшим значениям атрибута (Уровень лояльности мб). 
        // пока что уровня лояльности тут нет, поэтому самую длинную строку беру
    const loDefiAssets = repo.programs[0].tokens;
    let lenghtProper = Math.max.apply(Math, loDefiAssets.map((token) => {
        return token.name.length
    }))
    

    // git remote set-url origin https://niksche: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@github.com/LoDeFi/frontend.git
    git remote add origin https://niksche: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@github.com/niksche/frontend.git

    const el = loDefiAssets.find((Asset) => {
        return Asset.name.length == lenghtProper
    })

    return (<div className="Favorite">
        You favorite loyalty: {el ? el.name : undefined}
        <div>5% cheaper</div>
    </div>)
}

export default Favorite;