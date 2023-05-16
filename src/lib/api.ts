import { BaseController } from "$lib/controller"

export interface APIKeypair {
    publicKey: string
    privateKey: string
}

export interface APIClient {
    publicKey: string
    orgID: string
    permission: number
}

export class APIController extends BaseController {
    ttl: number

    constructor() {
        super()
        this.ttl = 3600
    }

    async authorize(keys: APIKeypair) {
        try {
            this.initcheck()

            return ''
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async loadFromAuthorization(authorization: string) {
        if(authorization === '') return null

        const lower = authorization.toLowerCase()
        const split = lower.split(' ')

        if(split[0] !== 'bearer' || split.length !== 2)
            return null

        const token = split[1]

        try {
            this.initcheck()

            const serial = await this.redis?.get(`authorization_${token}`)
            if(!serial) return null
            const client = JSON.parse(serial) as APIClient
            
            return client
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async storeInAuthorization(token: string, client: APIClient) {
        if(token === '') return
        
        await this.redis?.set(
            `authorization_${token}`,
            JSON.stringify(client),
            { EX: this.ttl }
        )
    }
}