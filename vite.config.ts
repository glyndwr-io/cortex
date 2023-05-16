import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig, ViteDevServer } from 'vite';
import { injectSocket } from './websocket';

const websocket = {
    name: 'websockets',
    configureServer(server: ViteDevServer) {
        injectSocket(server.httpServer)
    }
}

const config: UserConfig = {
	plugins: [sveltekit(), websocket],
    server: {
        hmr: {
            host: "localhost",
            port: 3001,
            protocol: "ws",
        }
    }
};

export default config;
