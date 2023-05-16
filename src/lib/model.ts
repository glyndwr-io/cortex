import { BaseController } from "$lib/controller"
import { ThalamusAPI } from "$lib/thalamus"
import type { ThalamusEvent, TrainingConfig } from "$lib/thalamus"

export interface ModelListing {
    title: string,
    slug: string,
    description: string,
    authorID: number,
    author: string,
    image: string | null
}

export interface ModelConfig {
    title: string
    authorID: number
    description: string
    targetDataset: string
    mode: string
    epochs: number
    batchSize: number
    trainingSplit: number
    validationSplit: number
}

export class ModelController extends BaseController {
    thalamus: ThalamusAPI
    orgID: string
    
    constructor(orgID: string) {
        super()
        this.orgID = orgID
        this.thalamus = new ThalamusAPI(orgID)
    }

    async get(modelName: string) {
        try {
            this.initcheck()

            const query = this.knex('models')
                .select('*')
                .where('slug', modelName)
                .toString()

            const models = await this.client?.query(query)
            const model = models?.rows[0] ?? null
            
            if(model === null) return model

            model.updates = await this.getUpdates(model.id)

            return model
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async lock(modelName: string) {
        try {
            this.initcheck()

            const queryString = this.knex('models')
                .where('slug', 'modelName')
                .update('is_training', 't')
                .toString()

            await this.client?.query(queryString)
        } catch(e) {
            console.log(e)
            return
        }
    }

    async unlock(modelName: string) {
        try {
            this.initcheck()

            const queryString = this.knex('models')
                .where('slug', 'modelName')
                .update('is_training', 'f')
                .toString()

            await this.client?.query(queryString)
        } catch(e) {
            console.log(e)
            return
        }
    }

    async train(modelName: string, config: TrainingConfig) {
        try {
            this.initcheck()

            await this.lock(modelName)
            await this.thalamus.trainModel(modelName, config)

            return
        } catch(e) {
            console.log(e)
            return
        }
        
    }

    async predict(modelName: string, image: Blob) {
        try {
            this.initcheck()

            const prediction = await this.thalamus.makePrediction(modelName, image)

            return prediction
        } catch(e) {
            console.log(e)
            return
        }
    }

    async createModel(data: ModelConfig) {
        try {
            this.initcheck()

            const datasetQuery = this.knex('datasets')
                .select('id', 'image')
                .where({
                    slug: data.targetDataset,
                    org_id: this.orgID
                })
                .toString()
            const datasets = await this.client?.query(datasetQuery)
            const { id, image } = datasets?.rows[0]

            if(id === undefined) return null

            const slug = this.slugify(data.title)
            const modelQuery = this.knex('models')
                .insert({
                    org_id: this.orgID,
                    dataset_id: id,
                    title: data.title,
                    slug,
                    description: data.description,
                    image,
                    author_id: data.authorID,
                    needs_retrain: false,
                    is_training: true
                })
                .returning('slug')
                .toString()

            await this.client?.query(modelQuery)
            
            return slug
        } catch(e) {
            console.log(e)
            return null
        } 
    }

    async getModels() {
        try {
            this.initcheck()

            const queryString = this.knex<ModelListing>('models')
                .select('models.title','models.slug','models.description',
                    'models.image','models.author_id AS authorID',
                    this.knex.raw('CONCAT(user_accounts.first_name, \' \', user_accounts.last_name) AS author')
                )
                .leftJoin('user_accounts', function() {
                    this.on('models.author_id','=','user_accounts.id')
                })
                .where('models.org_id', this.orgID)
                .toString()
            const query = await this.client?.query(queryString)
            const datasets: ModelListing[] = query?.rows ?? []

            return datasets
        } catch(e) {
            console.log(e)
            const datasets: ModelListing[] = []
            return datasets
        }
    }

    async getUpdates(id: number) {
        try {
            this.initcheck()

            const query = this.knex('model_updates')
                .select('*')
                .where('model_id', id)
                .toString()

            const models = await this.client?.query(query)
            const updates = models?.rows ?? []
            
            return updates
        } catch(e) {
            console.log(e)
            return []
        }
    }

    async addUpdate(update: ThalamusEvent) {

    }

}