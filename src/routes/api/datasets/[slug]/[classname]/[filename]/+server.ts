import type { RequestHandler } from "./$types"
import { DatasetController, type DatasetListing } from "$lib/dataset"
import { json, error } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ locals, params }) => {
    const { account } = locals
    if(account === null)
        return json([], { status: 401 })

    const { orgID } = account
    const { slug, classname, filename } = params
    const datasets = new DatasetController(orgID)

    await datasets.init()
    const image = await datasets.getImage(slug, classname, filename)
    await datasets.teardown()

    if(image === null)
        throw error(404, 'Dataset Not Found')

    // Due to Undici (used by SvelteKit) and node-fetch
    // using different typing for Response I have to do
    // this to silence typescript even though it works
    // just fine.
    return new Response(image as unknown as BodyInit)
}