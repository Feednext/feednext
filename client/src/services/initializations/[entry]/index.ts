// Local files
import { TitleResponseData, EntryResponseData } from '@/@types/api'
import { fetchEntryByEntryId, fetchTitle, fetchOneCategory, getAverageTitleRate } from '@/services/api'
import { EntryPageInitials } from '@/@types/initializations'

export const getEntryPageInitialValues = async (entryId: string): Promise<EntryPageInitials> => {
    let title: TitleResponseData
	let categoryName: string
	let averageTitleRate: number
	let entryData: EntryResponseData

	await fetchEntryByEntryId(entryId)
		.then(async fRes => {
			entryData = fRes.data
			// Fetch title Data
			await fetchTitle(fRes.data.attributes.title_id, 'id')
				.then(async sRes => {
					title = sRes.data
					// Get category
					await fetchOneCategory(sRes.data.attributes.category_id).then(({ data }) => {
						categoryName = data.attributes.name
					})
					// Fetch average rate of title
					await getAverageTitleRate(sRes.data.attributes.id)
						.then(trRes => averageTitleRate = trRes.data.attributes.rate || 0)
						.catch(error => {})
				})
				.catch(error => {})
		})
		.catch(error => {})

	return {
		title,
		categoryName,
		averageTitleRate,
		entryData
	}
}