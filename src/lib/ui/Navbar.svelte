<script lang="ts">
    import User from "$lib/ui/icons/User.svelte";
    import { userAccount, traningQueue } from "$lib/stores";
	import Progress from "./Progress.svelte";

    export let pathname: string
    
    const navLinks = [
        { icon: '', label: 'Home', href: '/'},
        { icon: '', label: 'Datasets', href: '/datasets'},
        { icon: '', label: 'Models', href: '/models'},
        { icon: '', label: 'API Keys', href: '/api-keys'},
        { icon: '', label: 'Users', href: '/users'},
        { icon: '', label: 'Account', href: '/account'},

    ]

    function isActive(link: string, pathname: string) {
        if(link === '/' && pathname.length > 1)
            return 'nav-link'

        const base = pathname.slice(0, link.length)
        return (base === link) ? 'nav-link selected' : 'nav-link'
    }
</script>

<nav>
    <div class="nav-container">
        <div class="account-info">
            <User />
            <h1>Hi, {$userAccount?.firstName}!</h1>
            <div class={$traningQueue.length > 0 ? 'training-queue active' : 'training-queue'}>
                <p>{$traningQueue.length} Models Training</p>
                <Progress percent={$traningQueue[0]} height={0.5}/>
            </div>
        </div>
        
        <div class="nav-links">
            {#each navLinks as link}
                <a href={link.href} class={isActive(link.href, pathname)}>
                    <div class="link-icon">
                        {link.icon}
                    </div>
                    {link.label}
                </a>
            {/each}
        </div>
    </div> 
</nav>

<style>
    nav {
        width: 20rem;
        background-color: var(--color-bg-cont);
        box-shadow: 0 0 5px 0px var(--color-shadow);
        padding-block: 2rem;
        transition: box-shadow .3s;
    }
    nav:hover {
        box-shadow: 0 0 5px 2px var(--color-shadow);
    }

    .nav-container {
        position: relative;
    }

    .account-info {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .training-queue {
        border-radius: 1rem;
        text-align: center;
        opacity: 0;
        width: 75%;
        transition: background-color .3s, opacity .3s;
        padding-inline: 2rem;
        box-sizing: border-box;
    }
    .training-queue.active {
        opacity: 1;
    }
    .training-queue:hover {
        background-color: var(--accent-purple);
    }

    .nav-links {
        position: absolute;
        top: 30vh;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
        width: 100%;
    }

    .nav-link {
        padding: 1rem;
        border-radius: .5rem;
        padding: 1rem 2rem;
        cursor: pointer;
        transition: opacity .3s;
        width: 80%;
        transition: background-color .3s, color .3s;
        text-decoration: none;
    }
    .nav-link:hover {
        color: var(--color-text-cont);
        background-color: var(--accent-red);
    }
    .nav-link.selected {
        color: var(--color-text-cont);
        background-color: var(--accent-purple);
    }
</style>