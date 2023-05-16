<script lang="ts">
    export let label: string,
    value = '',
    placeholder = ' ',
    name='',
    min: string | undefined = undefined,
    max: string | undefined = undefined,
    step: string | undefined = undefined,
    required: boolean | undefined = undefined,
    type = 'text'
</script>

<div class="input-wrapper">
    <!-- This looks dumb but we cant bind value if type is a variable -->
    {#if type === 'date'}
        <input {placeholder} {name} {required} type="date" bind:value={value}/>
    {:else if type === 'password'}
        <input {placeholder} {name} {required} type="password" bind:value={value}/>
    {:else if type === 'email'}
        <input {placeholder} {name} {required} type="email" bind:value={value}/>
    {:else if type === 'number'}
        <input {placeholder} {name} {min} {max} {step} {required} type="number" bind:value={value}/>
    {:else}
        <input {placeholder} {name} {required} type="text" bind:value={value}/>
    {/if}
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

    .input-wrapper input:hover ~ label {
        color: var(--accent-red);
    }

    .input-wrapper input:focus ~ label {
        color: var(--accent-pink);
    }

    .input-wrapper input:focus ~ label,
    .input-wrapper input:not(:placeholder-shown) ~ label{
        transform: translateY(-1.5rem);
    }

    .input-wrapper input {
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
    .input-wrapper input:hover {
        border: 2px solid var(--accent-red);
        box-shadow: 0 0 5px 0px var(--color-shadow);
    }
    .input-wrapper input:focus {
        border: 2px solid var(--accent-pink);
        box-shadow: 0 0 5px 0px var(--color-shadow);
    }
</style>