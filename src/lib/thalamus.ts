import pkg from 'websocket'
import type { Message, client } from 'websocket'
import fetch, { Headers, type HeadersInit, type RequestInit } from 'node-fetch'
import { EventEmitter } from 'node:events';
import { Readable } from 'stream'
import FormData from 'form-data';
import http from 'http'
const WebSocket = pkg.client

enum Verb {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    WS = 'WS'
}

enum TrainingMode {
    CLASSIC = 'classic',
    ONESHOT = 'oneshot'
}

interface APIKeypairs {
    public_key: string,
    secret_key: string
}

interface TokenResponse {
    token: string,
    ttl: number,
    detail?: string
}

interface TrainingResponse {
    status: string
    wsUpdates: string
    detail?: string
}

interface ErrorResponse {
    detail: string
}

export interface SocketEvent {
    event: string
    message?: string
    data?: ThalamusEvent
}

export interface ThalamusEvent {
    orgID: string
    model: string
    raw: string
    epoch?: number
    totalEpochs?: number
    batch?: number
    totalBatches?: number
    progress?: number
    trainLoss?: number
    trainAccuracy?: number
    validLoss?: number
    validAccuracy?: number
}

export interface TrainingConfig {
    targetDataset: string
    epochs?: number
    batchSize?: number
    mode?: TrainingMode
    trainingSplit?: number
    validationSplit?: number
}

export interface ThalamusPrediction {
    prediction: string
    confidence: number
}

type ThalamusDataset = Record<string, string[]>

export class ThalamusAPI {
    private handleSocketEvent: (message: Message) => void
    webSocket: client
    serviceAddress: string
    keypair: APIKeypairs
    GUID: string
    token: string | null

    constructor(GUID: string) {
        this.webSocket = new WebSocket()
        this.serviceAddress = process.env.THALAMUS_URL
        this.token = null
        this.GUID = GUID
        this.keypair = {
            public_key: process.env.PUBLIC_KEY,
            secret_key: process.env.SECERET_KEY
        }

        // Register global handler for events
        if(global.events === undefined)
            global.events = new EventEmitter()

        // These are anonymous event handler functions and should
        // not be used as methods
        this.handleSocketEvent = async (socketEvent) => {
            if(socketEvent.type !== 'utf8') return
            
            try {
                const { event, data, message } = JSON.parse(socketEvent.utf8Data) as SocketEvent

                if(event === 'error' && message) throw this.exception(message)

                if(data !== undefined) {
                    data.orgID = this.GUID
                    data.raw = socketEvent.utf8Data
                }
                
                global?.events.emit(event, data ?? { orgID: this.GUID, raw: socketEvent.utf8Data })  
            } catch(e) {
                console.log(e)
            }
        }

        this.webSocket.on('connect', c => c.on('message', this.handleSocketEvent))
    }

    async connect() {
        const body = await this.request('/token.json', Verb.POST, this.keypair)
        const { token, ttl, detail } = await body.json() as TokenResponse
        
        if(detail !== undefined)
            throw this.exception(detail)

        this.token = token ?? null
        setTimeout(()=>{this.token = null}, ttl)
    }

    async request(endpoint: string, method: Verb, body?: object | FormData) {
        const isFormdata = body instanceof FormData
        const opts: RequestInit = {
            method,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        }

        if(method !== Verb.GET && !isFormdata)
            opts.body = JSON.stringify(body)
            
        try {
            if(isFormdata && method === Verb.PUT) {
                const [host, port] = this.serviceAddress.split(':')

                const resp = body.submit({
                    method,
                    host,
                    port,
                    path: endpoint,
                    headers: { 'Authorization': `Bearer ${this.token}` }
                })

                return new Response('{}')
                
            } else {
                const resp = await fetch('http://' + this.serviceAddress + endpoint, opts)
                return resp
            }
            
            
        } catch(e) {
            console.log(e)
            return new Response('{}')
        }
    }

    async createDataset(datasetName: string) {
        if(this.token === null)
            await this.connect()
        
        const resp = await this.request(`/${this.GUID}/datasets/${datasetName}.json`, Verb.POST)
    }

    async getDatasetInfo(name: string) {
        if(this.token === null)
            await this.connect()

        try {
            const resp = await this.request(`/${this.GUID}/datasets/${name}.json`, Verb.GET)
            const dataset = await resp.json() as ThalamusDataset

            return dataset
        } catch(e) {
            console.log(e)
            return {}
        }
        
    }

    async uploadClassdata(datasetName: string, className: string, classdata: Buffer[]){
        if(this.token === null)
            await this.connect()

        const body = new FormData()
        let i = 0
        for(const buff of classdata){
            body.append('files', buff, {
                contentType: 'image/jpg',
                filename: `${className}-${i}.jpg`,
            })
            i++
        }

        const resp = await this.request(
            `/${this.GUID}/datasets/${datasetName}/${className}.json`,
            Verb.PUT,
            body
        )
    }

    async getImage(dataset: string, classname: string, classdata: string) {
        if(this.token === null)
            await this.connect()

        try {
            const resp = await this.request(`/${this.GUID}/datasets/${dataset}/${classname}/${classdata}`, Verb.GET)

            if(resp.headers.get('content-type') === 'application/json') {
                const error = await resp.json() as ErrorResponse
                throw this.exception(error.detail)
            }
                
            return resp.body
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async trainModel(modelName: string, config: TrainingConfig) {
        if(this.token === null)
            await this.connect()

        try {
            const resp = await this.request(`/${this.GUID}/models/${modelName}/train.json`, Verb.POST, config)

            
            const payload = await resp.json() as TrainingResponse
            
            if(payload?.detail)
                throw this.exception(payload.detail)

            await this.connect()

            this.webSocket.connect(
                `ws://${this.serviceAddress}${payload.wsUpdates}`,
                undefined,
                undefined,
                { 'Authorization': `Bearer ${this.token}` }
            )
                
            return
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async makePrediction(modelName: string, image: Blob) {
        if(this.token === null)
            await this.connect()

        try {
            const body = new FormData()
            const arrBuff = Readable.from(Buffer.from(await image.arrayBuffer()))
            body.append('prediction', arrBuff, {
                filename: 'prediction'
            })

            const resp = await fetch('http://localhost:8000' + `/${this.GUID}/models/${modelName}/predict.json`, {
                method: 'POST',
                body,
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                    ...body.getHeaders()
                }
            })
            const json = await resp.json() as ThalamusPrediction
            return json

        } catch(e) {
            console.log(e)
            return null
        }
    }

    exception(detail: string) {
        return new Error(`ThalamusException: ${detail}`)
    }
}