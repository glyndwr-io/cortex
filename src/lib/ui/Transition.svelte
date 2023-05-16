<script lang="ts">
    import { fly } from 'svelte/transition'
    export let refresh = ''

    const outConf = { x: 15, duration: 500 }
    const inConf = { x:-15, duration: 500, delay: 500 }
</script>

{#key refresh}
    <div id="transition-wrapper" in:fly={inConf} out:fly={outConf}>
        <slot />
    </div>
{/key}