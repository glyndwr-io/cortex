import type * as Kit from '@sveltejs/kit';

export type ActionData = {
    success: boolean,
    message?: string
}

type OutputProps = {
    datasets: DatasetOption[]
}

export type Actions = Kit.Actions

export type PageLoad = Kit.Load<Params, null, null, OutputProps>