<script>
    import {createEventDispatcher, onMount} from 'svelte';

    const dispatch = createEventDispatcher();

    let searchString = '';
    let timer;
    let members = {members: []};
    let periods = [];
    let selectedPeriod;

    onMount(async () => {
        loadSubscriptionPeriods();
    });

    const debounce = v => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            loadMembers(v)
        }, 750);
    }

    async function loadMembers(searchString) {
        // const accessToken = await auth0Client.getTokenSilently();
        //
        const response = await fetch(`http://localhost:8081/members`, {
            method: 'GET',
            headers: {
                //Authorization: `Bearer ${accessToken}`
            }
        });

        response.json().then(p => {
            members = p;
        });
    }

    async function loadSubscriptionPeriods() {
        // const accessToken = await auth0Client.getTokenSilently();
        //
        const response = await fetch(`http://localhost:8081/subscription-periods`, {
            method: 'GET',
            headers: {
                //Authorization: `Bearer ${accessToken}`
            }
        });

        response.json().then(p => {
            periods = p.subscriptionPeriods
        });
    }

    function periodChanged(e) {
        console.log("selected period: " + selectedPeriod);
    }
</script>

<div class="container mt-5">

    <div class="mb-3">
        <label for="searchStringInput" class="form-label">Search String</label>
        <input type="searchString" class="form-control" id="searchStringInput"
               on:keyup={({ target: { value } }) => debounce(value)}>
    </div>
    <div class="mb-3">
        <label for="periodSelect" class="form-label">Period</label>
        <select bind:value={selectedPeriod} class="form-control" id="periodSelect" on:change={periodChanged}>
            <option value="all">*</option>
            {#each periods as period}
                <option value="{period.id}">{period.name}</option>
            {/each}
        </select>
    </div>

    <table class="table">
        <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">Nachname</th>
            <th scope="col">Vorname</th>
            <th scope="col">Adresse</th>
            <th scope="col">Typ</th>
        </tr>
        </thead>

        <tbody>
        {#each members.members as member}
            <tr on:click|preventDefault={e => loadMembers(1)}>
                <th scope="row">{member.id}</th>
                <td>{member.lastNameOrCompanyName}</td>
                <td>{member.firstName}</td>
                <td>{member.address}</td>
                <td>
                    <ul>
                    {#each member.subscriptions as subscription}
                        <li>{subscription.subscriptionDisplayInfo}</li>
                    {/each}
                    </ul>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>

</div>
