import type { PageLoad } from './$types'
import type { ModelListing } from '$lib/types/Model'

type OutputProps = {
    models: ModelListing[]
    searchParams: string
}

export const load: PageLoad<OutputProps> = async ({ fetch, url }) => {
    const resp = await fetch('/api/models.json')
    const models: ModelListing[] = await resp.json()
    const searchParams = url.searchParams.toString()

    return { models, searchParams }
}