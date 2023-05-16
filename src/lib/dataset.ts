import { BaseController } from "$lib/controller";
import { ThalamusAPI } from "$lib/thalamus";
import { writeFile, unlink, mkdir } from 'node:fs/promises';
import StreamZip from "node-stream-zip";
import { v4 } from "uuid";

export interface DatasetListing {
    title: string,
    slug: string,
    description: string,
    authorID: number,
    author: string,
    image: string | null
}

export interface Dataset extends DatasetListing {
    classes: DatasetClass[]
}

export interface DatasetClass {
    title: string,
    slug: string,
    images: string[]
}

export interface DatasetUpload {
    title: string
    description: string
    zip: File
    authorID: number
}

export interface DatasetOption {
    label: string,
    value: string
}

export class DatasetController extends BaseController {
    orgID: string
    thalamus: ThalamusAPI
    
    constructor(orgID: string) {
        super()
        this.orgID = orgID
        this.thalamus = new ThalamusAPI(orgID)
    }

    async getDatasets() {
        try {
            this.initcheck()

            const queryString = this.knex<DatasetListing>('datasets')
                .select('datasets.title','datasets.slug','datasets.description',
                'datasets.image','datasets.author_id AS authorID',
                this.knex.raw('CONCAT(user_accounts.first_name, \' \', user_accounts.last_name) AS author'))
                .leftJoin('user_accounts', function() {
                    this.on('datasets.author_id','=','user_accounts.id')
                })
                .where('datasets.org_id', this.orgID)
                .toString()
            const query = await this.client?.query(queryString)
            const datasets: DatasetListing[] = query?.rows ?? []

            return datasets
        } catch(e) {
            console.log(e)
            const datasets: DatasetListing[] = []
            return datasets
        }
    }

    async getDatasetOptions() {
        try {
            this.initcheck()

            const queryString = this.knex<DatasetOption>('datasets')
                .select('datasets.title AS label','datasets.slug AS value')
                .where('datasets.org_id', this.orgID)
                .toString()
            const query = await this.client?.query(queryString)
            const datasets: DatasetOption[] = query?.rows ?? []

            return datasets
        } catch(e) {
            console.log(e)
            const datasets: DatasetOption[] = []
            return datasets
        }
    }

    async getDataset(slug: string) {
        try {
            this.initcheck()

            const queryString = this.knex<Dataset>('datasets')
                .select('datasets.title','datasets.slug','datasets.description',
                'datasets.image','datasets.author_id AS authorID',
                this.knex.raw('CONCAT(user_accounts.first_name, \' \', user_accounts.last_name) AS author'))
                .leftJoin('user_accounts', function() {
                    this.on('datasets.author_id','=','user_accounts.id')
                })
                .where('datasets.org_id', this.orgID)
                .andWhere('datasets.slug', slug)
                .toString()
            const query = await this.client?.query<Dataset>(queryString)
            
            if(query?.rows[0] === undefined)
                return null

            const dataset: Dataset = query.rows[0]
            dataset.classes = []

            const classes = await this.thalamus.getDatasetInfo(slug)
            for(const key in classes) {
                dataset.classes.push({
                    title: key,
                    slug: key,
                    images: classes[key]
                })
            }

            return dataset
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async getImage(dataset: string, classname: string, classdata: string) {
        try {
            this.initcheck()

            const image = await this.thalamus.getImage(dataset, classname, classdata)

            return image
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async createDataset(args: DatasetUpload) {
        const { title, description, zip, authorID } = args
        const slug = this.slugify(title)
        const tempName = `${v4()}.zip`
        await this.thalamus.createDataset(slug)
        await writeFile(`./tmp/${tempName}`, await zip.stream())

        const tempZip = new StreamZip.async({ file: `./tmp/${tempName}`})
        const entries = await tempZip.entries()
        const iter = Object.values(entries)
        const uploadMap = new Map<string, string[]>()

        // Map zip entries by classname, filtering out all entries
        // that do not fit the classname/classimage.xxx pattern
        for(const entry of iter) {
            const path = entry.name.split('/').filter(s => s !== '')
            if( entry.isDirectory || (!entry.isDirectory && path.length !== 2) )
                continue

            const [classname, filname] = path
            if(!uploadMap.has(classname))
                uploadMap.set(classname, [])

            uploadMap.get(classname)?.push(entry.name)
        }
        const classes = [...uploadMap.keys()]

        for(const [key, value] of uploadMap) {
            const buffs = []
            let i = 0
            for(const entry of value) {
                const buff = await tempZip.entryData(entry)
                await mkdir(`./static/dataset-cache/${slug}/${key}/`, { recursive: true })
                await writeFile(`./static/dataset-cache/${slug}/${key}/${key}-${i}.jpg`, buff)
                buffs.push(buff)
                i++
            }
            await this.thalamus.uploadClassdata(slug, key, buffs)
            
        }
        const image = `/dataset-cache/${slug}/${classes[0]}/${classes[0]}-${0}.jpg`

        await tempZip.close()
        await unlink(`./tmp/${tempName}`)

        const queryText = this.knex('datasets')
            .insert({
                org_id: this.orgID,
                title,
                slug,
                image,
                description,
                author_id: authorID,
                classes
            })
            .toString()

        await this.client?.query(queryText)

        //setTimeout(() => {}, 10000)
        return { uploaded: true, url: `/datasets/${slug}`}
    }
}