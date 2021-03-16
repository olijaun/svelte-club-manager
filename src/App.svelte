<script>
    import {onMount} from "svelte";
    import auth from "./authService";
    import {isReady} from './service'
    import {isAuthenticated, user} from "./store";
    import Login from "./Login.svelte";
    import Search from "./Search.svelte";
    import Navbar from "./Navbar.svelte";
    import Member from "./Member.svelte";
    import Admin from "./Admin.svelte";

    let backendReady = false;
    let backendFailure = false;
    let noAuthMode = false;
    let auth0Client;
    let state;
    let editMemberId;

    onMount(async () => {

        if (!noAuthMode) {
            auth0Client = await auth.createClient();

            isAuthenticated.set(await auth0Client.isAuthenticated());
            user.set(await auth0Client.getUser());
        }

        scheduleBackendCheck();

    });

    function scheduleBackendCheck() {
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
            console.log("backend ffffffffffffffffffffffffffffff")
            backendFailure = true;
        }
    }

    function login() {
        console.log("my login");
        if (!noAuthMode) {
            auth.loginWithPopup(auth0Client);
        } else {
            console.log("set to authenticated")
            isAuthenticated.set(true);
        }
    }

    function editMember(id) {
        console.log("edit!!!!! " + id.detail)
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
        if (event.detail === "New Member") {
            state = "New";
        } else if (event.detail === "Search") {
            state = "Search";
        } else if (event.detail === "Admin") {
            state = "Admin"
        }
    }

    function genRandom(length = 7) {
        var chars =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var result = "";
        for (var i = length; i > 0; --i)
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
</script>

<style>
    #main-application {
        margin-top: 50px;
    }
</style>

<main>

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
            <button type="button" class="btn btn-primary md-2" on:click|preventDefault={e => scheduleBackendCheck()}>Retry
            </button>
        {/if}
    </div>
</main>