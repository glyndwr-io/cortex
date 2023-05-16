<script lang="ts">
    import Card from '$lib/ui/Card.svelte'
    import { page } from '$app/stores'
</script>

<Card>
    <h1 class="m0">Uh Oh!</h1>
    <h2 class="mt0">{$page.status === 404 ? 'Page not found' : 'Internal Server Error'}</h2>
    {#if $page.status === 404}
        <p>We could'nt find the page that you were looking for</p>
    {:else}
        <p>We've encountered an error on our end trying to process your last action. Please try again, and if you encounter this issue again you can open a ticket with support.</p>
    {/if}
</Card>
