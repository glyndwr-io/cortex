<script lang="ts">
    import type { ActionData } from "./$types";

    import { enhance } from '$app/forms'
    import Button from "$lib/ui/Button.svelte";
    import Card from "$lib/ui/Card.svelte";
	import Input from "$lib/ui/Input.svelte";

    export let form: ActionData
</script>

<Card>
    <form method="POST" use:enhance>
        <h1>Login</h1>
        {#if form?.success === false}
            <p class="error">{form.message}</p>
        {/if}
        <Input label="Email Address" name="email" required={true} type="email"/>
        <Input label="Password" name="password" required={true} type="password"/>
        <Button>Submit</Button>
    </form>
</Card>

<style>
    form {
        text-align: center;
        display: grid;
        gap: 1rem
    }

    p.error {
        color: var(--accent-pink)
    }
</style>