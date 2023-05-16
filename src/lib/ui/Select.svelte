<script lang="ts">
    interface SelectOption {
        label: string,
        value: string
    }

    export let options: SelectOption[],
    label= '',
    selected = '',
    name='',
    required: boolean | undefined = undefined,
    value=''


    let isOpen = false
</script>

<div class="input-wrapper">
    <select {name} {required} bind:value={value} data-chosen={!!value}>
        {#each options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
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

    .input-wrapper select:hover ~ label {
        color: var(--accent-red);
    }

    .input-wrapper select:focus ~ label {
        color: var(--accent-pink);
    }

    .input-wrapper select:focus ~ label,
    .input-wrapper select[data-chosen="true"] ~ label{
        transform: translateY(-1.5rem);
    }

    .input-wrapper select {
        padding: .75rem;
        outline: none;
        border: 2px solid var(--accent-purple);
        border-radius: .5rem;
        height: 3rem;
        font-size: 1rem;
        transition: transform .3s, box-shadow .3s, border .3s;
        width: 100%;
        background-color: var(--color-bg-cont)
    }
    .input-wrapper select:hover {
        border: 2px solid var(--accent-red);
        box-shadow: 0 0 5px 0px var(--color-shadow);
    }
    .input-wrapper select:focus {
        border: 2px solid var(--accent-pink);
        box-shadow: 0 0 5px 0px var(--color-shadow);
    }
    
    
</style>