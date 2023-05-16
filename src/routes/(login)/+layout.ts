import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data }) => {
    const { account } = data

    return { account }
}
