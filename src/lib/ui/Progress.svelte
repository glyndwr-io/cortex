<script lang="ts">
    export let percent: number, height: number = 1
</script>

<div class="track" style="height: {height}rem">
    {#if percent < 0}
        <div class="bar intermediate"></div>
    {:else}
        <div class="bar" style="width: {percent * 100}%"></div>
    {/if}
</div>

<style>
    .track {
        position: relative;
        width: 100%;
        border-radius: 1rem;
        background-color: var(--color-bg);
        margin-block: 1rem;
        overflow: hidden;
    }

    .bar {
        position: absolute;
        background-image: var(--gradient);
        background-size: 200% 200%, cover;
        height: 100%;
        width: 60%;
        transition: width .5s, transform .5s;
        animation: pulse 5s linear reverse infinite;
    }

    .bar.intermediate {
        border-radius: 1rem;
        animation: intermediate 5s ease-in-out reverse infinite;
        width: 50%
    }

    @keyframes pulse { 
        0%{background-position:0% 0%}
        100%{background-position:200% 0%}
    }

    @keyframes intermediate {
        0% { 
            transform: translateX(200%);
        }
        100% {
            transform: translateX(-100%);
        }
    }
</style>