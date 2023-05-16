<script lang="ts">
    import type { ModelListing } from "$lib/types/Model"
    
    export let object: ModelListing
</script>

<a href="/models/{object.slug}" class="viewer-item">
    <div class="item-img">
        <img src={object.image} alt="picsum" width="200px" height="200px"/>
    </div>
    <div class="item-info">
        <div class="item-top">
            <h3>{object.title}</h3>
        </div>
        <hr>
        <div class="item-bottom">
            <p>{object.description}</p>
        </div>
    </div>
</a>

<style>
    .viewer-item {
        display: flex;
        gap: 2rem;
        cursor: pointer;
        transition: box-shadow .3s;
        background-color: var(--color-bg-cont);
        box-shadow: 0 0 5px 0px var(--color-shadow);
        padding: 2rem;
        text-decoration: none;
    }
    .viewer-item:hover {
        box-shadow: 0 0 5px 2px var(--color-shadow);
    }

    .viewer-item img {
        border-radius: 2rem;
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