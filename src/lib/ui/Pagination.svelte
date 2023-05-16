<script lang="ts">
import { goto } from "$app/navigation";


    export let count: number, currentPage: number

    function nav(i: number) {
        if(i >= count-1) {
            currentPage = count-1
        } else if(i < 0) {
            currentPage = 0
        } else {
            currentPage = i
        }
    }

    function prev(){ nav(currentPage-1) }
    function next(){ nav(currentPage+1) }
</script>

<div class="button-group">
    {#if count > 1}
        <button class="previous" on:click={prev}>Previous</button>
        {#each {length: count} as x, i}
            {#if i > 3 && count > 8 && i < (count-1)}
                <button>...</button>
            {:else}
                <button class={(i===currentPage) ? 'current' : ''} on:click={()=>nav(i)}>{i+1}</button>
            {/if}
        {/each}
        <button class="next" on:click={next}>Next</button>
    {/if}
</div>

<style>
    .button-group {
        display: flex;
    }

    button {
        position: relative;
        border: none;
        font-size: 1rem;
        padding: 1rem;
        color: var(--color-text-cont);
        background-color: var(--accent-purple);
        cursor: pointer;
        transition: opacity .3s
    }
    button:hover {
        opacity: 0.8
    }

    button.current {
        background-color: var(--accent-pink);
    }

    .button-group .previous {
        padding: 1rem 2rem;
        border-radius: .5rem 0 0 .5rem;
    }

    .button-group .next {
        padding: 1rem 2rem;
        border-radius:  0 .5rem .5rem 0;
    }
</style>