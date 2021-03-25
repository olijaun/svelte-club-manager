<script>
    import {onMount} from "svelte";
    import auth from "./services/authService";
    import {isReady} from './services/personService'
    import {isAuthenticated, user} from "./services/stores";
    import {isLocaleLoaded, initI18n} from './services/i18n';
    import Login from "./components/Login.svelte";
    import Search from "./components/Search.svelte";
    import Navbar from "./components/Navbar.svelte";
    import Member from "./components/Member.svelte";
    import Admin from "./components/Admin.svelte";

    let backendReady = false;
    let backendFailure = false;
    let noAuthMode = false;
    let auth0Client;
    let state;
    let editMemberId;

    onMount(async () => {

        initI18n();

        if (!noAuthMode) {
            auth0Client = await auth.createClient();

            isAuthenticated.set(await auth0Client.isAuthenticated());
            user.set(await auth0Client.getUser());
        }

        scheduleBackendCheck();
    });

    function scheduleBackendCheck() {
        backendFailure = false;
        setTimeout(() => checkBackend(0), 1);
    }

    async function checkBackend(totalRetryTime) {
        console.log("total: " + totalRetryTime);
        if (totalRetryTime < 10000) {
            backendReady = await isReady();
            console.log("backend ready: " + backendReady)
            if (backendReady === false) {
                totalRetryTime += 2000;
                setTimeout(() => checkBackend(totalRetryTime), 2000);
            }
        } else {
            backendFailure = true;
        }
    }

    function login() {
        if (!noAuthMode) {
            auth.loginWithPopup(auth0Client);
        } else {
            console.log("set to authenticated")
            isAuthenticated.set(true);
        }
    }

    function editMember(id) {
        state = 'Edit';
        editMemberId = id.detail;
    }

    function logout() {
        console.log("logout")
        if (!noAuthMode) {
            auth.logout(auth0Client);
        } else {
            isAuthenticated.set(false);
        }
    }

    function select(event) {
        if (event.detail === "createMember") {
            state = "New";
        } else if (event.detail === "search") {
            state = "Search";
        } else if (event.detail === "admin") {
            state = "Admin"
        }
    }

</script>

<style>
    #main-application {
        margin-top: 50px;
    }
</style>

<main>

    {#if $isLocaleLoaded}

        <Navbar on:componentSelected={select} on:login={login} on:logout={logout} isAuthenticated={isAuthenticated}
                user={user}/>

        <div class="container">
            {#if backendReady}

                <!-- Application -->
                {#if !$isAuthenticated}
                    <Login on:login={login}/>
                {:else}

                    {#if !state || state === "Search" }
                        <Search on:memberSelected={editMember}/>
                    {/if}
                    {#if state === "Edit" }
                        <Member id={editMemberId}/>
                    {/if}
                    {#if state === "New"}
                        <Member/>
                    {/if}
                    {#if state === "Admin"}
                        <Admin/>
                    {/if}
                {/if}

            {:else if !backendFailure}
                Waiting for backend
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            {:else}
                Backend failure.
                <button type="button" class="btn btn-primary md-2"
                        on:click|preventDefault={e => scheduleBackendCheck()}>
                    Retry
                </button>
            {/if}
        </div>
    {:else}
        loading locale...
    {/if}

</main>