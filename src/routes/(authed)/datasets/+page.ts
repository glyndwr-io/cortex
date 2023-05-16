import type { PageLoad } from './$types'
import type { DatasetListing } from '$lib/dataset'

type OutputProps = {
    models: DatasetListing[]
    searchParams: string
}

export const load: PageLoad<OutputProps> = async ({ fetch, url }) => {
    const resp = await fetch('/api/datasets.json')
    const models: DatasetListing[] = await resp.json()
    const searchParams = url.searchParams.toString()

    return { models, searchParams }
}