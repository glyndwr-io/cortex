import { createClient } from 'redis';
import cookie from 'cookie'
import pkg from 'websocket'
import { EventEmitter } from 'node:events';
const WebSocketServer = pkg.server

async function makeRedis() {
    const client = createClient()
    client.on('error', e => console.error(e))
    await client.connect()
    return client
}
const redis = makeRedis()

const connections = new Map()

export function injectSocket(httpServer) {
    if(global.events === undefined)
        global.events = new EventEmitter()

    const socket = new WebSocketServer({ httpServer })

    global.events.on('message', event => {
        const { orgID, permission, message } = event

        if(orgID === undefined || permission === undefined
            || message === undefined) return

        connections
            .get(orgID)
            .filter(c => c.account.permission === permission)
            .forEach(c => c.send(message))
    })

    socket.on('request', async request => {
        try {
            const { headers } = request.httpRequest
            const { session_id } = cookie.parse(headers.cookie || '')

            if(!session_id) return request.reject()

            const client = await redis
            const serial = await client.get(`session_${session_id}`)
            const ttl = await client.ttl(`session_${session_id}`)

            if(serial === null || ttl < 0) return request.reject()

            const account = JSON.parse(serial)
            const connection = request.accept()

            if(!connections.has(account.orgID))
                connections.set(account.orgID, [])

            connection.session = `session_${session_id}`
            connection.account = account
            connections.get(account.orgID).push(connection)

            setTimeout(() => {
                const pool = connections
                    .get(account.orgID)
                    .filter(c => {
                        const isValid = c.session !== `session_${session_id}`
                        console.log('closing ' + `session_${session_id}`)
                        if(!isValid) c.close()

                        return isValid
                    })

                connections.set(account.orgID, pool)
            }, ttl * 1000)

        } catch(e) {
            console.log(e)
            return
        }
    })

    return httpServer
}