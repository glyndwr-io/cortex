import type { RequestHandler } from "./$types"
import { ModelController, type ModelListing } from "$lib/model"
import { json } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ locals }) => {
    const { account } = locals
    if(account === null)
        return json([], { status: 401 })

    const { orgID } = account
    const models = new ModelController(orgID)

    await models.init()
    const results = await models.getModels()
    await models.teardown()

    return json(results)
}