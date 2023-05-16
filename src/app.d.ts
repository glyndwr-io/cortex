/// <reference types="@sveltejs/kit" />

import type { UserAccount } from "$lib/account";
import type { APIClient } from "$lib/api";
import type { EventEmitter } from 'node:events';
import type { Chart } from 'chart.js'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    var events: EventEmitter
    interface Window {
        websocket: WebSocket;
        chart: Chart
    }
    namespace App {
        interface Locals {
            account: UserAccount | null;
            client: APIClient | null;
            sessionID: string;
        }
        // interface Platform {}
        // interface Session {}
        // interface Stuff {}
    }
}