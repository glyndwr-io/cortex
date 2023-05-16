import type * as Kit from '@sveltejs/kit';

type Params = {
    slug: string
    classname: string
    filename: string
}

export type RequestHandler = Kit.RequestHandler<Params>