<script>
    import {onMount} from "svelte";
    import auth from "./authService";
    import {isAuthenticated, tasks, user, user_tasks} from "./store";
    import Login from "./Login.svelte";
    import Search from "./Search.svelte";
    import Navbar from "./Navbar.svelte";

    let noAuthMode = true;

    let auth0Client;
    let newTask;

    let selectedComponent = Search;

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

    function logout() {
        if (!noAuthMode) {
            auth.logout(auth0Client);
        }
    }

    function select(event) {
        console.log("selectedComponent: " + event.detail);
        selectedComponent = event.detail;
    }

    async function addItem() {
        console.log("add");
        // const accessToken = await auth0Client.getTokenSilently();
        //
        // const response = await fetch(`http://localhost:8081/`, {
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // });
        // let data = await response.json();

        //console.log("data: " + JSON.stringify(data));

        let newTaskObject = {
            id: genRandom(),
            description: newTask,
            completed: false,
            user: $user.email
        };

        console.log(newTaskObject);

        let updatedTasks = [...$tasks, newTaskObject];

        tasks.set(updatedTasks);

        newTask = "";
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

    <Navbar on:componentSelected={select} on:login={login} on:logout={logout} isAuthenticated={isAuthenticated} user={user}/>

    <!-- Application -->
    {#if !$isAuthenticated}
        <Login on:login={login}/>
    {:else}
        <svelte:component this={selectedComponent}/>
    {/if}
</main>