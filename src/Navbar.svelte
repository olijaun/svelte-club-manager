<script>
    import Search from "./Search.svelte";
    import Member from "./Member.svelte";

    export let isAuthenticated;
    export let user;

    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    let selectedItem;

    const navItems = [
        { page: 'Search',   component: Search },
        { page: 'Member',   component: Member },
        // other navigation pages can go here
    ];

    function login() {
        dispatch('login', {});
    }

    function logout() {
        dispatch('logout', {});
    }

    function componentSelected(i) {
        selectedItem = i;
        console.log("selectedItem: " + i)
        dispatch('componentSelected', navItems[i].component);
    }

</script>

<!-- App Bar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="/#">Club Manager</a>
    <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
    >
        <span class="navbar-toggler-icon"/>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
        <div class="navbar-nav mr-auto user-details">
            {#if $isAuthenticated}
                <span class="text-white">&nbsp;&nbsp;{$user.name} ({$user.email})</span>
            {:else}<span>&nbsp;</span>{/if}
        </div>
        <span class="navbar-text">
        <ul class="navbar-nav float-right">
          {#if $isAuthenticated}

              {#each navItems as item, i}
		<li class="nav-item">
			<a href="/#" class={selectedItem==i ? "nav-link active p-2 ml-1" : "p-2 ml-1 nav-link"} on:click|preventDefault="{e => componentSelected(i)}">{item.page}</a>
		</li>
              {/each}

          {:else}
          <li class="nav-item">
            <a class="nav-link" href="/#" on:click="{login}">Log In</a>
          </li>
          {/if}
        </ul>
      </span>
    </div>
</nav>