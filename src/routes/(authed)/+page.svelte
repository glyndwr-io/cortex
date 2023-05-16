<script lang="ts">
    import Card from '$lib/ui/Card.svelte'
    import Button from '$lib/ui/Button.svelte'
	import Progress from '$lib/ui/Progress.svelte';
</script>

<Card>
    <h1 class="mt0">Hello World</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    
    <Progress percent={-1}/>
    
    <Button color={'purple'} on:click={()=>fetch('/debug.json')}>Click me</Button>
    <Button color={'red'} on:click={()=>fetch('/debug.json')}>Click me</Button>
    <Button color={'pink'} on:click={()=>fetch('/debug.json')}>Click me</Button>
    <Button color={'orange'} on:click={()=>fetch('/debug.json')}>Click me</Button>
    <Button color={'yellow'} on:click={()=>fetch('/debug.json')}>Click me</Button>
</Card>
