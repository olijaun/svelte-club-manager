<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {_, changeLanguageTo, isLocaleLoaded, locale} from '../services/i18n';
    import LocaleSwitcher from "./controllers/LocaleSwitcher.svelte";
    import NavLink from "./controllers/NavLink.svelte";

    export let isAuthenticated;
    export let user;

    const dispatch = createEventDispatcher();

    const navItems = [
        {page: $_('nav.search'), id: 'search'},
        {page: $_('nav.createMember'), id: 'createMember'},
        {page: $_('nav.admin'), id: 'admin'},
    ];

    function login() {
        dispatch('login', {});
    }

    function logout() {
        console.log("dispatching logout")
        dispatch('logout', {});
    }

</script>

{#if $isLocaleLoaded}

    <nav class="navbar navbar-expand-lg navbar-light bg-light">


        <div class="container-fluid">
            <a class="navbar-brand" href="#">Club Manager</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    {#if $isAuthenticated}
                        <li class="nav-link">
                            <NavLink baseClass="nav-link p-2 ml-1" to="/">{$_('nav.search')}</NavLink>
                        </li>
                        <li class="nav-link">
                            <NavLink baseClass="nav-link p-2 ml-1" to="/member">{$_('nav.createMember')}</NavLink>
                        </li>
                        <li class="nav-link">
                            <NavLink baseClass="nav-link p-2 ml-1" to="/admin">{$_('nav.admin')}</NavLink>
                        </li>
                    {/if}
                    <LocaleSwitcher
                            value={$locale}
                            on:locale-changed={e => changeLanguageTo(e.detail) }
                    />
                    <!--                <li class="nav-item dropdown">-->
                    <!--                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">-->
                    <!--                        Dropdown-->
                    <!--                    </a>-->
                    <!--                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">-->
                    <!--                        <li><a class="dropdown-item" href="#">Action</a></li>-->
                    <!--                        <li><a class="dropdown-item" href="#">Another action</a></li>-->
                    <!--                        <li><hr class="dropdown-divider"></li>-->
                    <!--                        <li><a class="dropdown-item" href="#">Something else here</a></li>-->
                    <!--                    </ul>-->
                    <!--                </li>-->
                </ul>

                {#if $isAuthenticated === false}
                    <li class="nav-link">
                        <a class="nav-link" href="/#" on:click="{login}">{$_('common.login')}</a>
                    </li>
                {:else}

                    <li class="nav-link">
                        <a class="nav-link" href="/#" on:click="{logout}">{$_('common.logoff')} {$user.name}</a>
                    </li>
                {/if}
            </div>
        </div>

    </nav>

{:else}
    loading translations...
{/if}
