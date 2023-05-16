import type { PageLoad } from './$types'
import type { APIKeyListing } from '$lib/types/APIKey'

type OutputProps = {
    models: APIKeyListing[]
    searchParams: string
}

export const load: PageLoad<OutputProps> = async ({ fetch, url }) => {
    const resp = await fetch('/api/api-keys.json')
    const models: APIKeyListing[] = await resp.json()
    const searchParams = url.searchParams.toString()

    return { models, searchParams }
}