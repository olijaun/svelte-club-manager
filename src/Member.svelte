<script>
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    function loadMember(i) {
        console.log("load member" + i);
        //dispatch('login', {});
    }
</script>

<div class="container mt-5">
    <form class="row g-3">
        <div class="form-floating col-md-6">
            <input type="text" class="form-control" id="inputFirstName">
            <label for="inputFirstName" class="form-label">First name</label>
        </div>
        <div class="form-floating col-md-6">
            <input type="text" class="form-control" id="inputLastName">
            <label for="inputLastName" class="form-label">Last name</label>
        </div>
        <div class="form-floating col-10">
            <input type="text" class="form-control" id="inputStreet">
            <label for="inputStreet" class="form-label">Street</label>
        </div>
        <div class="form-floating col-2">
            <input type="text" class="form-control" id="inputStreeNumber">
            <label for="inputStreeNumber" class="form-label">Nr.</label>
        </div>
        <div class="form-floating col-4">
            <input type="text" class="form-control" id="inputZip">
            <label for="inputZip" class="form-label">Zip</label>
        </div>
        <div class="form-floating col-8">
            <input type="text" class="form-control" id="inputCity">
            <label for="inputCity" class="form-label">City</label>
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-primary">Sign in</button>
        </div>
    </form>

</div>
