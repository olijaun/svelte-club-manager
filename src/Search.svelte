<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import { memberSearchResultStore } from './stores';
    import { searchMembers, loadPeriods } from './serivce'

    const dispatch = createEventDispatcher();

    let searchString = '';
    let timer;
    let membersPromise;
    let periodsPromise = [];
    let selectedPeriod;

    const unsubscribe = memberSearchResultStore.subscribe(value => {
        console.log("subscription value: " + JSON.stringify(value));
        if(value) {
            membersPromise = Promise.resolve(value);
        }
    });

    onMount(async () => {
        periodsPromise = loadPeriods().then(p => p.subscriptionPeriods);
    });

    const debounce = v => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            membersPromise = searchMembers(v).then(m => {
                console.log("storing: " + JSON.stringify(m));
                memberSearchResultStore.set(m);
                return m;
            });
        }, 750);
    }



    function memberSelected(id) {
        console.log("dispatch memberSelected: " + id)
        dispatch('memberSelected', id);
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

        return response.json().then(p => p.subscriptionPeriods);
    }

    function periodChanged(e) {
        console.log("selected period: " + selectedPeriod);
    }
</script>

<div class="container mt-5">

    {#await periodsPromise}

        <p>loading...</p>

    {:then periods}
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

    {:catch error}

        <p>Error loading search: {error}</p>

    {/await}

    {#if membersPromise}
        {#await membersPromise}

            <p>Searching...</p>

        {:then members}

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
                    <tr on:click|preventDefault={e => memberSelected(member.id)}>
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

        {:catch error}
            <p>Error when searching: {error}</p>
        {/await}
    {/if}

</div>
