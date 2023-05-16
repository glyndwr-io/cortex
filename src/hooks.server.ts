import type { Handle } from "@sveltejs/kit";
import type { ThalamusEvent } from "$lib/thalamus";

import { v4, validate } from 'uuid'
import { AccountController } from "$lib/account";
import { APIController } from "$lib/api";
import { ModelController } from "$lib/model";
import { pool } from "$lib/db";
import { EventEmitter } from 'node:events';

export const handle: Handle = async ({ event, resolve }) => {
    const accounts = new AccountController()
    const api = new APIController()
    const sessionID = event.cookies.get('session_id') || ''
    const authorization = event.request.headers.get('authorization') || ''
    const isValid = validate(sessionID)

    const db = await accounts.init()
    await api.init(db)

    const client = await api.loadFromAuthorization(authorization)
    if(client !== null) {
        event.locals.sessionID = sessionID
        event.locals.client = client
        event.locals.account = null
    } else if(!isValid) {
        const sessionID = v4()
        event.locals.sessionID = sessionID
        event.locals.client = null
        event.locals.account = null
        event.cookies.set('session_id', sessionID)
    } else {
        event.locals.sessionID = sessionID
        event.locals.client = null
        event.locals.account = await accounts.loadFromSession(sessionID)
    }

    await accounts.teardown()

    const response = await resolve(event)
    response.headers.set('X-Frame-Options','DENY')
    response.headers.set('Content-Security-Policy', "frame-ancestors 'none';")

    return response
}

if(global.events !== undefined) {
    interface ClientMessage {
        orgID: string
        permission: number
        message: string
    }
    
    function forwardMessage(message: ClientMessage) {
        global?.events.emit('message', message)
    }
    
    global?.events.on('trainingStart', async (e: ThalamusEvent) => {
        const { orgID, model } = e
        const message = e.raw
        const permission = 0
        
        forwardMessage({ orgID, message, permission})
    
        const models = new ModelController(orgID)
    
        await models.init()
        await models.lock(model)
        await models.teardown()
    })
    global?.events.on('epochStart', (e: ThalamusEvent) => {
        const { orgID } = e
        const message = e.raw
        const permission = 0
        
        forwardMessage({ orgID, message, permission})
    })
    global?.events.on('batchEnd', (e: ThalamusEvent) => {
        const { orgID } = e
        const message = e.raw
        const permission = 0
        
        forwardMessage({ orgID, message, permission})
    })
    global?.events.on('epochEnd', async (e: ThalamusEvent) => {
        const { orgID } = e
        const message = e.raw
        const permission = 0
    
        forwardMessage({ orgID, message, permission})
    
        const models = new ModelController(orgID)
    
        await models.init()
        await models.addUpdate(e)
        await models.teardown()
    })
    global?.events.on('trainingEnd', async (e: ThalamusEvent) => {
        const { orgID, model } = e
        const message = e.raw
        const permission = 0
        
        forwardMessage({ orgID, message, permission})
    
        const models = new ModelController(orgID)
    
        await models.init()
        await models.unlock(model)
        await models.teardown()
    })
}