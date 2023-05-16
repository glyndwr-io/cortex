<script lang="ts">
	import { onMount } from "svelte";

    export let shown = false

    let modal: HTMLDialogElement

    $: shown ? open() : close()

    function open() {
        if(modal === undefined) return

        modal.showModal()
    }

    function close(){
        if(modal === undefined) return

        setTimeout(()=>modal.close(), 300)
    }

    onMount(() => {
        modal.addEventListener('cancel', e => {
            e.preventDefault()
            shown = false
        })

        // Because modal is undefined
        // until after mount
        if(shown) open()
    })
</script>

<dialog bind:this={modal} class={shown ? 'visible': undefined}>
    <div class="modal-header">
        <slot name="header"></slot>
        <p class="close" on:click={()=>shown=false}>&times;</p>
    </div>

    <div class="modal-body">
        <slot name="body"></slot>
    </div>
    
    <div class="modal-footer">
        <slot name="footer"></slot>
    </div>
</dialog>

<style>
    dialog {
        border-radius: 1rem;
        border: none;
        background-color: var(--color-bg-cont);
        box-shadow: 0 0 5px 0px var(--color-shadow);
        padding: 0;
        opacity: 0;
        transition: opacity .3s, transform .3s;
        z-index: 999;
        min-width: 20rem;
        min-height: 20rem;
        transform: translateY(-10%);
    }
    dialog[open] {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    dialog::backdrop {
        opacity: 0;
        transition: opacity .3s;
        background-color: rgba(0,0,0,.7);
    }
    dialog.visible {
        transform: translateY(0%);
    }
    dialog.visible, dialog.visible::backdrop {
        opacity: 1;
    }

    .modal-header {
        top: .5rem;
        display: flex;
        gap: 2rem;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-inline: 2rem;
    }

    .modal-body {
        margin-top: 1rem;
        padding-inline: 2rem;
    }

    .modal-footer {
        padding: 2rem;
    }

    p.close {
        font-size: 3rem;
        margin: 0;
        cursor: pointer;
    }
</style>