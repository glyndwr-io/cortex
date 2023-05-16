import type * as Kit from '@sveltejs/kit';

type Params = {
    slug: string
}

export type RequestHandler = Kit.RequestHandler<Params>