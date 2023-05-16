import { redis, pool } from '$lib/db'
import type { createClient } from '@redis/client'
import type { PoolClient } from 'pg'
import type { Knex } from 'knex'
import knex from 'knex'

export class BaseController {
    initialized: boolean
    knex: Knex
    redis?: ReturnType<typeof createClient>
    client?: PoolClient
    
    constructor() {
        this.initialized = false
        this.knex = knex({ client: 'pg' })
    }

    async init(client: PoolClient | undefined = undefined) {
        this.client = client ?? await pool.connect()
        this.redis = await redis
        this.initialized = true

        return this.client
    }

    async teardown() {
        await this.client?.release()
        this.client = undefined
        this.redis = undefined
        this.initialized = false
    }

    initcheck() {
        if(!this.initialized)
            throw 'Controller Not Initialized'
    }

    slugify(text: string) {
        return text.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
    }

}