import { browser } from "$app/environment";
import type { UserAccount } from "$lib/account";
import { writable } from "svelte/store";

function initWebsocket() {
    if(!browser) return null
    try {
        return new WebSocket(`ws://${window.location.host}`)
    } catch(e) {
        console.log(e)
        return null
    }
}

export const webSocket = writable<WebSocket | null>(initWebsocket())
export const userAccount = writable<UserAccount | null>(null)
export const traningQueue = writable<number[]>([])