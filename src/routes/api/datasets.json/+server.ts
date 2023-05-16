import type { RequestHandler } from "./$types"
import { DatasetController, type DatasetListing } from "$lib/dataset"
import { json } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ locals }) => {
    const { account } = locals
    if(account === null)
        return json([], { status: 401 })

    const { orgID } = account
    const datasets = new DatasetController(orgID)

    await datasets.init()
    const results = await datasets.getDatasets()
    await datasets.teardown()

    return json(results)
}