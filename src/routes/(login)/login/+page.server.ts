import { redirect, invalid } from "@sveltejs/kit"
import { AccountController } from "$lib/account"
import type { Actions } from "./$types"

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const { account, sessionID } = locals
        if(account !== null)
            throw redirect(302, '/')

        const accounts = new AccountController()
        const form = await request.formData()
        const email = form.get('email') as string
        const password = form.get('password') as string
        
        if(!email || !password)
            return invalid(400, { success: false, message: 'Username and Password Required' })

        await accounts.init()
        const login = await accounts.login(sessionID, email, password)
        await accounts.teardown()

        if(login === null)
            return invalid(401, { success: false, message: 'Invalid Username and/or Password' })

        return { success: true }
    }
}