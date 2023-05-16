import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ url, data }) => {
    const { pathname } = url
    const { account } = data

    return { pathname, account }
}
