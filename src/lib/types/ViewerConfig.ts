import type { SvelteComponentTyped } from "svelte";

export interface ViewerConfig<T> {
    rowComponent: any,
    searchParams: string,
    createURL?: string,
    headerComponent?: any,
    headers?: string[]
    objects: T[]
}
