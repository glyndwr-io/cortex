import { json } from "@sveltejs/kit"
import type { APIKeyListing } from "$lib/types/APIKey"

export async function GET() {
    const models: APIKeyListing[] = [
        {
            title: 'Sample Model',
            slug: 'sample-model',
            author: 'Bob',
        },
    ]

    return json(models)
}