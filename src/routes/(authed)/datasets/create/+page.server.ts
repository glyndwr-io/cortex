import { DatasetController } from "$lib/dataset"
import { redirect, invalid } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const { account } = locals
        if(account === null)
            throw redirect(302, '/login')

        const datasets = new DatasetController(account.orgID)
        const formData = await request.formData()
        const authorID = account.id
        const description = formData.get('description') as string | null
        const title = formData.get('title') as string | null
        const zip = formData.get('dataset-zip') as File | null

        if(!title)
            return { success: false, message: "Missing dataset title"}

        if(!description)
            return { success: false, message: "Missing dataset description"}

        if(!zip)
            return { success: false, message: "Missing dataset zip file"}

        if(zip.type !== 'application/zip')
            return { success: false, message: "Uploaded file is not a zip file"}

        await datasets.init()
        const  { uploaded, url } = await datasets.createDataset({ title, description, zip, authorID })
        await datasets.teardown()

        if(uploaded)
            throw redirect(302, url)
        
        return { success: uploaded }
    }
}
