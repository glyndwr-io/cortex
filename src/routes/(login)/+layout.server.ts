import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
    const account = locals.account

    if(account !== null)
        throw redirect(302, '/')

    return { account }
}
