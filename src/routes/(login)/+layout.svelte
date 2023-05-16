<script lang="ts">
    import Waves from "$lib/ui/Waves.svelte";
    import type { LayoutData } from "./$types";
    import { fly, fade } from 'svelte/transition'

    export let data: LayoutData

    const outConf = { x: 15, duration: 500 }
    const inConf = { x:-15, duration: 500, delay: 500 }

    let { account } = data
    $:({ account } = data)
</script>

<main>
    <div in:fly={inConf} out:fly={outConf}>
        <slot></slot>
    </div>
    <Waves/>
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: var(--color-bg);
    }
</style>