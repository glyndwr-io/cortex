<script lang="ts">
    export let label: string,
    value = '',
    placeholder = ' ',
    name='',
    required: boolean | undefined = undefined
</script>

<div class="input-wrapper">
    <textarea {placeholder} {name} {required} rows="10" bind:value={value}></textarea>
    <label for="">{label}</label>
</div>

<style>
    label {
        color: var(--color-text);
        transition: color .3s;
    }

    .input-wrapper {
        position: relative;
    }

    .input-wrapper label {
        position: absolute;
        background-color: var(--color-bg-cont);
        padding-inline: .25rem;
        top: .9rem;
        left: .75rem;
        transition: transform .3s;
        pointer-events: none;
    }

    .input-wrapper textarea:hover ~ label {
        color: var(--accent-red);
    }

    .input-wrapper textarea:focus ~ label {
        color: var(--accent-pink);
    }

    .input-wrapper textarea:focus ~ label,
    .input-wrapper textarea:not(:placeholder-shown) ~ label{
        transform: translateY(-1.5rem);
    }

    .input-wrapper textarea {
        padding: .75rem;
        outline: none;
        border: 2px solid var(--accent-purple);
        border-radius: .5rem;
        font-size: 1rem;
        transition: transform .3s, box-shadow .3s, border .3s;
        width: 100%;
        background-color: var(--color-bg-cont)
    }
    .input-wrapper textarea:hover {
        border: 2px solid var(--accent-red);
        box-shadow: 0 0 5px 0px var(--color-shadow);
    }
    .input-wrapper textarea:focus {
        border: 2px solid var(--accent-pink);
        box-shadow: 0 0 5px 0px var(--color-shadow);
    }
</style>