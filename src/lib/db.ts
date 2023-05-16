import { createClient } from 'redis';
import pkg from 'pg'

const { Pool } = pkg

async function makeRedis() {
    const client = createClient()
    client.on('error', e => console.error(e))
    await client.connect()
    return client
}
export const redis = makeRedis()

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'thalamus'
})