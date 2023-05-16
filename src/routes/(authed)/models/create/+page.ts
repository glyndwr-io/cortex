import type { PageLoad } from './$types'
import type { DatasetOption } from '$lib/dataset'

export const load: PageLoad = async ({ fetch, url }) => {
    const resp = await fetch('/api/datasets/options.json')
    const datasets: DatasetOption[] = await resp.json()

    return { datasets }
}