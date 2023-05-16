<script lang="ts">
    import type { OutputData } from './$types';
    import Card from '$lib/ui/Card.svelte'
    import DatasetViewer from '$lib/ui/DatasetViewer.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { goto } from '$app/navigation';

    export let data: OutputData
    let { dataset, slug } = data
    $: ({ dataset, slug } = data)
</script>

<h1>{dataset.title}</h1>
<Card>
    <h2>Author: {dataset.author}</h2>
    <p>{dataset.description}</p>
    <Button on:click={()=>goto('/models/create')}>Create Model from This Dataset</Button>
    <hr>
    <DatasetViewer dataset={slug} classes={dataset.classes} />
</Card>