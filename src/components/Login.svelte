<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    function login() {
        dispatch('login', {});
    }
</script>

<div class="container mt-5">
    <div class="row">
        <div class="col-md-10 offset-md-1">
            <div class="jumbotron">
                <h1 class="display-4">Club Manager</h1>
                <p class="lead">Features</p>
                <ul>
                    <li>Manage Members</li>
                    <li>Manage Memberships</li>
                </ul>
                <a
                        class="btn btn-primary btn-lg mr-auto ml-auto"
                        href="/#"
                        role="button"
                        on:click="{login}"
                >Log In</a>
            </div>
        </div>
    </div>
</div>
