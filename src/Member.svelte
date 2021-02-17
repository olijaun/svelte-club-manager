<script>
    import Person from "./Person.svelte";
    import Subscriptions from "./Subscriptions.svelte";

    export let id;

    let showMemberships = false;
</script>

<div class="container">

    <h1>Member {id ? id : ""}</h1>

    <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link" class:active={!showMemberships} aria-current="page" href="#"
               on:click|preventDefault={e => showMemberships = false}>Person</a>
        </li>
        {#if id}
            <li class="nav-item">
                <a class="nav-link" class:active={showMemberships} href="#"
                   on:click|preventDefault={e => showMemberships = true}>Memberships</a>
            </li>
        {/if}
    </ul>

    {#if showMemberships === false}
        <Person id={id}/>
    {/if}
    {#if showMemberships}
        <Subscriptions id={id}/>
    {/if}

</div>
