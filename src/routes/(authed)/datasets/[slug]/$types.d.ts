import type * as Kit from '@sveltejs/kit';
import type { Dataset } from '$lib/dataset'

interface Params {
    slug: string
}

interface OutputData {
    dataset: Dataset
    slug: string
}

export type PageLoad = Kit.Load<Params, null, null, OutputData>