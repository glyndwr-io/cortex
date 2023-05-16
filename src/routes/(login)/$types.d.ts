import type { UserAccount } from '$lib/account';
import type * as Kit from '@sveltejs/kit';

type Params = Record<string, string>
type ParentData = Record<string, any>
type LayoutData = {
    account: UserAccount | null
}
type ServerData = {
    account: UserAccount | null
}

export type LayoutServerLoad = Kit.ServerLoad<Params, ParentData, ServerData>
export type LayoutLoad = Kit.Load<Params, ServerData, LayoutData>