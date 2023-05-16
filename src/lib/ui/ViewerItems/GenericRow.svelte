<script lang="ts">
    export let object: object

    const values = Object.values(object)
</script>

<div class="viewer-item">
    <div class="item-info">
        <div class="item-body" style="grid-template-columns: repeat({values.length}, 1fr);">
            {#each values as value}
                <p>{value}</p>
            {/each}
        </div>
        <hr>
    </div>
</div>

<style>
    .viewer-item {
        display: flex;
        gap: 2rem;
        cursor: pointer;
        transition: box-shadow .3s;
        background-color: var(--color-bg-cont);
        box-shadow: 0 0 5px 0px var(--color-shadow);
        padding: 2rem;
    }
    .viewer-item:hover {
        box-shadow: 0 0 5px 2px var(--color-shadow);
    }

    .item-body {
        display: grid;
    }

    .item-info {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .item-info hr {
        border: 1px solid var(--accent-purple);
        width: 100%
    }
</style>