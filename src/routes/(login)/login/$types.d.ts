import type * as Kit from '@sveltejs/kit';

export type ActionData = {
    success: boolean,
    message?: string
}

export type Actions = Kit.Actions