<script lang="ts">
    import Person from "./Person.svelte";
    import Subscriptions from "./Subscriptions.svelte";
    import {_} from '../services/i18n';

    export let id;

    let showMemberships = false;
</script>

<div class="container">

    <h1>{$_('member.title')} {id ? id : ""}</h1>

    <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link" class:active={!showMemberships} aria-current="page" href="#"
               on:click|preventDefault={e => showMemberships = false}>{$_('person.title')}</a>
        </li>
        {#if id}
            <li class="nav-item">
                <a class="nav-link" class:active={showMemberships} href="#"
                   on:click|preventDefault={e => showMemberships = true}>{$_('subscriptions.title')}</a>
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
