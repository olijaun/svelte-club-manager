<script>
    import {onMount} from "svelte";
    import auth from "./authService";
    import {isAuthenticated, user} from "./store";
    import Login from "./Login.svelte";
    import Search from "./Search.svelte";
    import Navbar from "./Navbar.svelte";
    import Member from "./Member.svelte";

    let noAuthMode = true;
    let auth0Client;
    let state;
    let editMemberId;

    onMount(async () => {
        if (!noAuthMode) {
            auth0Client = await auth.createClient();

            isAuthenticated.set(await auth0Client.isAuthenticated());
            user.set(await auth0Client.getUser());
        }
    });

    function login() {
        console.log("my login");
        if (!noAuthMode) {
            auth.loginWithPopup(auth0Client);
        } else {
            isAuthenticated.set(true);
        }
    }

    function editMember(id) {
        console.log("edit!!!!! " + id.detail)
        state = 'Edit';
        editMemberId = id.detail;
    }

    function logout() {
        if (!noAuthMode) {
            auth.logout(auth0Client);
        }
    }

    function select(event) {
        if (event.detail === "New Member") {
            state = "New";
        } else if (event.detail === "Search") {
            state = "Search";
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

    <!-- Application -->
    {#if !$isAuthenticated}
        <Login on:login={login}/>
    {:else}

        {#if state === "Search" }
            <Search on:memberSelected={editMember}/>
        {/if}
        {#if state === "Edit" }
            <Member id={editMemberId}/>
        {/if}
        {#if state === "New"}
            <Member/>
        {/if}
    {/if}
</main>