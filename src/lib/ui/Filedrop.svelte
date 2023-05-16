<script lang="ts">
    export let label = '', name = ''
    let input: HTMLInputElement

    function onDrop(e: DragEvent) {
        input.files = e.dataTransfer?.files || null
    }
    

</script>

<div
    class="drop-area"
    on:drop|preventDefault={onDrop}
    on:dragenter|preventDefault
    on:dragover|preventDefault
>
    {#if input?.files?.[0]}
        <p>File Selected: {input.files[0].name}</p>
    {:else}
        <p>{label}</p>
    {/if}
</div>

<input bind:this={input} type="file" {name}/>

<style>
    input {
        display: none;
    }
    .drop-area {
        height: 100%;
        border: 2px solid var(--accent-purple);
        border-radius: .5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>