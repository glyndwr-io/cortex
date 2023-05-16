import type * as Kit from '@sveltejs/kit';

export type ActionData = {
    success: boolean
    dataset?: string
    message?: string
}

export type Actions = Kit.Actions