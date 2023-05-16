<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/ui/Button.svelte";
    import Card from "$lib/ui/Card.svelte";
	import Filedrop from "$lib/ui/Filedrop.svelte";
	import Input from "$lib/ui/Input.svelte";
	import Textarea from "$lib/ui/Textarea.svelte";
    import type { SubmitFunction } from '$app/forms'
	import Progress from "$lib/ui/Progress.svelte";

    let percent = 0
    let status = ''

    const upload: SubmitFunction = () => {
        status = 'Uploading'
        percent = -1
    }
</script>

<h1>Create Dataset</h1>
<Card>
    <form action="" use:enhance={upload}>
        <div class="two-cols">
            <h2>{status}</h2>
            <Progress {percent} />
        </div>
        <div class="two-cols">
            <Input label="Dataset Name" name="title"/>
        </div>
        <Textarea label="Description" name="description"/>
        <Filedrop label="Drag Zipfile Here" name="dataset-zip"/>
        <div class="two-cols">
            <Button>Submit</Button>
        </div>
    </form>
</Card>

<style>
    form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .two-cols {
        grid-column: 1/3;
    }

    h2 {
        text-align: center;
    }
</style>
