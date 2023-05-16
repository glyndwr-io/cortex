import type { RequestHandler } from "./$types"
import { APIController } from "$lib/api"
import type { APIKeypair } from "$lib/api"
import { json } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ locals, request }) => {
    const { publicKey, privateKey } = await request.json() as APIKeypair

    if(publicKey === undefined || privateKey === undefined)
        return json({}, { status: 400 })

    const api = new APIController()

    await api.init()
    const token = await api.authorize({ publicKey, privateKey })
    await api.teardown()

    if(token === null)
        return json({}, { status: 401 })

    return json({ token, ttl: api.ttl })
}