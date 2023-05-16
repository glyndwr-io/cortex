<script lang="ts">
    import type { ViewerConfig } from '$lib/types/ViewerConfig';
    import type { DatasetListing } from "$lib/dataset"
    import Viewer from '$lib/ui/Viewer.svelte'
	import DatasetRow from '$lib/ui/ViewerItems/DatasetRow.svelte';

    export let data
    
    let config: ViewerConfig<DatasetListing[]> = {
        createURL: '/datasets/create',
        rowComponent: DatasetRow,
        objects: data.models,
        searchParams: data.searchParams
    }
</script>

<h1 class="mt0">Your Datasets</h1>
<Viewer {config} />