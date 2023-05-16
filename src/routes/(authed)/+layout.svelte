<script lang="ts">
    import type { SocketEvent } from "$lib/thalamus";
    import type { LayoutData } from "./$types";
    import { userAccount } from "$lib/stores";
    import Navbar from "$lib/ui/Navbar.svelte";
    import Transition from "$lib/ui/Transition.svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
    import { webSocket } from '$lib/stores'
	import { get } from "svelte/store";

    export let data: LayoutData
    let { pathname, account } = data
    $:({ pathname, account } = data)

    $: userAccount.set(account)
</script>

<main>
    <Navbar {pathname}/>
    <content>
        <Transition refresh={pathname}>
            <slot/>
        </Transition>
    </content>
</main>

<style>
    main {
        display: flex;
        height: 100vh;
        background-color: var(--color-bg);
    }

    content {
        padding: 2rem;
        width: 100%;
        height: 100vh;
        overflow-y: auto;
    }
</style>