<script lang="ts">
    import type { ViewerConfig } from '$lib/types/ViewerConfig';
    import type { ModelListing } from "$lib/types/Model"
    import Viewer from '$lib/ui/Viewer.svelte'
    import GenericRow from '$lib/ui/ViewerItems/GenericRow.svelte'
    import GenericHeader from '$lib/ui/ViewerItems/GenericHeader.svelte';

    export let data
    
    let config: ViewerConfig<ModelListing[]> = {
        createURL: '/users/create',
        headerComponent: GenericHeader,
        headers: ['Name', 'Slug', 'Author'],
        searchParams: data.searchParams,
        rowComponent: GenericRow,
        objects: data.models
    }
</script>

<h1 class="mt0">Users</h1>
<Viewer {config} />