<script lang="ts">
    import type { DatasetClass } from '$lib/dataset'
	import Input from '$lib/ui/Input.svelte';
    import Modal from '$lib/ui/Modal.svelte';
    import Preview from '$lib/ui/icons/Preview.svelte';
    import Delete from '$lib/ui/icons/Delete.svelte';
	import Download from '$lib/ui/icons/Download.svelte';
	import Button from './Button.svelte';

    export let classes: DatasetClass[], dataset: string

    let queries: Record<string, string> = {}
    let downloadLink: HTMLAnchorElement
    let shown = false
    let shownDelete = false
    let galleryMax = 12
    let deleteImage: string[] = []
    let imagePreview = {
        filename: '',
        url: ''
    }

    $: if(queries) galleryMax = 12

    function deleteImageWarning(e: MouseEvent) {
        const currentTarget = e.currentTarget as HTMLDivElement
        const image = currentTarget?.getAttribute('data-image')

        if(image === null) return

        deleteImage = [image]
        shownDelete = true
    }

    function previewImage(e: MouseEvent) {
        const currentTarget = e.currentTarget as HTMLDivElement
        const url = currentTarget?.getAttribute('data-url')
        const filename = currentTarget?.getAttribute('data-filename')

        if(url === null || filename === null) return

        imagePreview.filename = filename
        imagePreview.url = url
        downloadLink.href = url
        downloadLink.download = filename

        shown = true
    }

    function downloadImage(e: MouseEvent) {
        const currentTarget = e.currentTarget as HTMLDivElement
        const url = currentTarget?.getAttribute('data-url')
        const filename = currentTarget?.getAttribute('data-filename')

        if(url === null || filename === null) return

        downloadLink.href = url
        downloadLink.download = filename
        downloadLink.click()
    }
</script>

{#each classes as singleClass}
    {@const filteredImages = singleClass.images.filter(v => queries[singleClass.slug] === ''
    || v.includes(queries[singleClass.slug]))}
    <a bind:this={downloadLink} class="download-link" href="/">Download</a>
    <div class="dataset-class">
        <div class="class-heading">
            <h3>{singleClass.title} - {singleClass.images.length}</h3>
        </div>
        <div class="class-body">
            <Input label="Search Images" bind:value={queries[singleClass.slug]}/>
            <div class="class-gallery">
                {#each filteredImages as image, i}
                    {#if i < galleryMax}
                        <div 
                            class="gallery-thumbnail"
                            style="background-image: url('/dataset-cache/{dataset}/{singleClass.slug}/{image}');"
                        >
                            <div class="thumbnail-overlay">
                                <p class="image-name">{image}</p>
                                <div
                                    class="thumbnail-action"
                                    data-filename={image}
                                    data-url="/api/datasets/{dataset}/{singleClass.slug}/{image}"
                                    on:click={previewImage}
                                >
                                    <Preview />
                                    <p>Preview</p>
                                </div>
                                <div
                                    class="thumbnail-action"
                                    data-filename={image}
                                    data-url="/api/datasets/{dataset}/{singleClass.slug}/{image}"
                                    on:click={downloadImage}
                                >
                                    <Download />
                                    <p>Download</p>
                                </div>
                                <div
                                    class="thumbnail-action"
                                    data-image={image}
                                    on:click={deleteImageWarning}
                                >
                                    <Delete />
                                    <p>Delete</p>
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
            {#if filteredImages.length > galleryMax}
                <div class="class-loadmore" on:click={()=>galleryMax+=8}>
                    Load More
                </div>
            {/if}
        </div>
    </div>
{/each}

<Modal bind:shown>
    <p slot="header">{imagePreview.filename}</p>
    <div class="img-wrapper" slot="body">
        <img src={imagePreview.url} alt="">
    </div>
    <Button slot="footer" on:click={()=>downloadLink.click()}>Download</Button>
</Modal>

<Modal bind:shown={shownDelete}>
    <p slot="header">Delete Image</p>

    <div class="delete-message" slot="body">
        <h1>Are you sure?</h1>
        <p>You are about to delete the following image{deleteImage.length > 1 ? 's' : ''}</p>
        <pre>
            {#each deleteImage as name}
                <p>{name}</p>
            {/each}
        </pre>
        <p>This action cannot be un-done. Models trained using this dataset will have to be re-trained in order to reflect these changes. Models using this dataset will be marked as out of date.</p>
    </div>

    <div slot="footer">
        <Button>Yes, I'm sure.</Button>
    </div>
</Modal>

<style>
    a.download-link {
        display: none;
    }
    .class-body {
        display: grid;
        padding-top: .5rem;
        gap: 1rem;
        max-height: 10000vh;
        transition: max-height .3s;
        overflow: hidden;
    }
    .class-body.collapse {
        max-height: 0;
    }
    .class-gallery {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        
    }

    .class-loadmore {
        text-align: center;
        padding-block: 2rem;
        border-radius: 1rem;
        transition: background-color .3s;
        cursor: pointer;
    }
    .class-loadmore:hover {
        background-color: var(--color-bg);
    }

    .gallery-thumbnail {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        background-size: cover;
        background-position: center;
        border-radius: 1rem;
        overflow: hidden;
    }

    .thumbnail-overlay {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        transition: opacity .3s;
        background-color: rgba(0,0,0,0.8);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .gallery-thumbnail:hover .thumbnail-overlay {
        opacity: 1;
    }
    .thumbnail-overlay p.image-name {
        position: absolute;
        bottom: 1rem;
    }

    .thumbnail-action {
        position: relative;
        cursor: pointer;
    }
    .thumbnail-action p {
        position: absolute;
        margin: 0;
        left: 50%;
        transform: translate(-50%, -75%);
        opacity: 0;
        transition: opacity .3s, transform .3s;
    }
    .thumbnail-action:hover p{
        opacity: 1;
        transform: translate(-50%, 0%);
    }

    .delete-message {
        max-width: min(20rem, 80vw);
    }

    .img-wrapper {
        display: flex;
        justify-content: center;
    }

    pre p {
        margin: 0;
    }
</style>