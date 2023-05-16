import { BaseController } from "$lib/controller"
import { validate } from 'uuid'

export type UserAccount = {
    id: number,
    orgID: string,
    email: string,
    firstName: string,
    lastName: string,
    permission: number
}

export class AccountController extends BaseController{
    constructor() {
        super()
    }

    async logout(sessionID: string) {
        if(!validate(sessionID)) return
        await this.redis?.del(`session_${sessionID}`)
    }

    async login(sessionID: string, email: string, password: string) {
        if(!validate(sessionID)) return null
        
        try {
            this.initcheck()

            const queryString = this.knex<UserAccount>('user_accounts')
                .select('id', 'org_id AS orgID', 'email', 'first_name AS firstName',
                'last_name AS lastName', 'permission')
                .where('email',email)
                .andWhereRaw('password = crypt(?, password)', password)
                .toQuery()
            const query = await this.client?.query(queryString)

            if(!query?.rows[0])
                return null

            const account = query.rows[0] as UserAccount
            await this.storeInSession(sessionID, account)
            return account
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async loadFromSession(sessionID: string) {
        if(!validate(sessionID)) return null

        try {
            this.initcheck()

            const serial = await this.redis?.get(`session_${sessionID}`)
            if(!serial) return null
            const account = JSON.parse(serial) as UserAccount
            
            return account
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async storeInSession(sessionID: string, account: UserAccount) {
        if(!validate(sessionID)) return
        
        await this.redis?.set(
            `session_${sessionID}`,
            JSON.stringify(account),
            { EX: 3600 * 24 }
        )
    }
}