<script lang="ts">
    import type { ViewerConfig } from '$lib/types/ViewerConfig';
    import type { ModelListing } from "$lib/types/Model"
    import Viewer from '$lib/ui/Viewer.svelte'
    import ModelRow from '$lib/ui/ViewerItems/ModelRow.svelte'

    export let data
    
    let config: ViewerConfig<ModelListing[]> = {
        createURL: '/models/create',
        rowComponent: ModelRow,
        objects: data.models,
        searchParams: data.searchParams
    }
</script>

<h1 class="mt0">Your Models</h1>
<Viewer {config} />