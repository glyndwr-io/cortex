<script lang="ts">
    import type { ViewerConfig } from '$lib/types/ViewerConfig';
    import Select from "./Select.svelte"
    import Input from "./Input.svelte"
    import Pagination from "./Pagination.svelte"
    import Button from "./Button.svelte"
    import { goto } from "$app/navigation";
    import { browser } from '$app/environment';

    export let config: ViewerConfig<any>

    let pageSize = 4
    let pageCount = 4

    let searchParams = new URLSearchParams(config.searchParams)
    //let pageCount = Math.ceil(objects.length / pageSize)
    let currentPage = parseInt(searchParams.get('page') ?? '1') - 1
    let options = [
        { value: '1', label: 'Type 1' },
        { value: '1', label: 'Type 2' },
        { value: '1', label: 'Type 3' },
    ]

    $: {
        if(browser) {
            const { state } = window.history
            searchParams.set('page',`${currentPage + 1}`)
            window.history.replaceState(state, '', `?${searchParams.toString()}`)
        }
    }
</script>

<div class="viewer-wrapper">
    <div class="viewer-start">
        <div class="viewer-start-top">
            <h2 class="m0">Filters</h2>
        </div>
        <Input label={'Model Name'} />
        <Input label={'Model Author'} />
        <Select label={'Model Type'} options={options}/>
        <div class="viewer-start-bottom">
            {#if config.createURL}
                <Button on:click={()=>goto(config.createURL ?? '')}>Create New</Button>
            {/if}
        </div>
    </div>
    
    {#if config.headerComponent}
        <div class="viewer-header">
            <svelte:component this={config.headerComponent} headers={config.headers}/>
        </div>
    {/if}

    {#key currentPage}
        <div class="viewer-items">
            {#each config.objects as object}
                <svelte:component this={config.rowComponent} {object} />
            {/each}
        </div>
    {/key}
    
    <div class="viewer-end">
        <Pagination count={pageCount} bind:currentPage={currentPage}/>
    </div>
</div>


<style>
    .viewer-wrapper {
        display: flex;
        flex-direction: column;
    }

    .viewer-start,
    .viewer-end {
        background-color: var(--color-bg-cont);
        box-shadow: 0 0 5px 0px var(--color-shadow);
        padding: 2rem;
    }

    .viewer-start {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border-radius: 1rem 1rem 0 0;
        gap: 1rem;
    }

    .viewer-start-top,
    .viewer-start-bottom {
        grid-column: 1/4;
    }

    .viewer-header {
        margin-top: 1rem;
    }

    .viewer-end {
        border-radius: 0 0 1rem 1rem;
        display: flex;
        justify-content: center;
    }

    .viewer-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-block: 1rem;
        animation: fade-in .5s forwards;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }
</style>