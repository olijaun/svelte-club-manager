<script>
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    function loadMember(i) {
        console.log("load member" + i);
        //dispatch('login', {});
    }
</script>

<div class="container mt-5">
    Member

</div>
