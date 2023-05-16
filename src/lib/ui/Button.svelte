<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let color = "purple"

    const dispatch = createEventDispatcher()

    function onClick() {
        dispatch('click')
    }
</script>

<button style="background-color: var(--accent-{color});" on:click={onClick}>
    <slot></slot>
</button>

<style>
    button {
        border: none;
        border-radius: .5rem;
        font-size: 1rem;
        padding: 1rem 2rem;
        color: var(--color-text-cont);
        cursor: pointer;
        transition: opacity .3s
    }

    button:hover {
        opacity: 0.8
    }
</style>