import type { RequestHandler } from "./$types"
import { DatasetController, type DatasetListing } from "$lib/dataset"
import { json, error } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ locals, params }) => {
    const { account } = locals
    if(account === null)
        return json([], { status: 401 })

    const { orgID } = account
    const { slug } = params
    const datasets = new DatasetController(orgID)

    await datasets.init()
    const dataset = await datasets.getDataset(slug)
    await datasets.teardown()

    if(dataset === null)
        throw error(404, 'Dataset Not Found')

    return json(dataset)
}