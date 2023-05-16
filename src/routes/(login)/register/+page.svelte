<script lang="ts">
    import Button from "$lib/ui/Button.svelte";
    import Card from "$lib/ui/Card.svelte";
	import Input from "$lib/ui/Input.svelte";

    const login = async (e: Event) => {

    }
</script>

<content>
    <Card>
        <form on:submit|preventDefault={login}>
            <h1>Register</h1>
            <Input label="Email Address" />
            <Input label="Password" type="password"/>
            <Button>Submit</Button>
        </form>
        
    </Card>
</content>

<style>
    form {
        text-align: center;
        display: grid;
        gap: 1rem
    }
</style>