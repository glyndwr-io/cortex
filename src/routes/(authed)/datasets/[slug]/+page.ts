import type { Dataset } from "$lib/dataset";
import type { PageLoad } from "./$types";

import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch }) => {
    const { slug } = params
    const resp = await fetch(`/api/datasets/${slug}.json`)

    if(resp.status === 404)
        throw error(404, 'Dataset Not Found')

    const dataset = await resp.json() as Dataset

    return { dataset, slug }
}