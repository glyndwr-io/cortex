import { ModelController } from "$lib/model"
import type { TrainingConfig } from "$lib/thalamus"
import { redirect, invalid } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
    train: async ({ locals, request }) => {
        const { account } = locals
        if(account === null)
            throw redirect(302, '/login')

        const models = new ModelController(account.orgID)
        const formData = await request.formData()
        const config = {
            authorID: account.id,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            targetDataset: formData.get('sourceDataset') as string,
            mode: formData.get('mode') as string,
            epochs: parseInt(formData.get('epochs') as string) || 1,
            batchSize: parseInt(formData.get('batchSize') as string || '1') || 1,
            trainingSplit: parseFloat(formData.get('trainingSplit') as string || '1') || 1,
            validationSplit: parseFloat(formData.get('validationSplit') as string || '1') || 1
        }

        await models.init()
        const slug = await models.createModel(config)
        if(slug !== null)
            await models.train(slug, config as TrainingConfig)
        await models.teardown()

        return { success: slug !== null, slug: slug ?? undefined }
    },
    predict: async ({ locals, request, params }) => {
        const { slug } = params
        const { account } = locals
        if(account === null)
            throw redirect(302, '/login')

        if(!slug) return

        const models = new ModelController(account.orgID)
        const formData = await request.formData()
        const image = formData.get('prediction') as Blob

        await models.init()
        const prediction = await models.predict(slug, image)
        await models.teardown()

        return prediction
    }
}