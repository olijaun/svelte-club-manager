<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import {memberSearchResultStore} from './stores';
    import {searchCriteriaStore} from './stores';
    import {loadPeriods, searchMembers} from './serivce'

    const dispatch = createEventDispatcher();

    let searchString = '';
    let timer;
    let membersPromise;
    let periodsPromise = [];
    let selectedPeriod;

    onMount(async () => {
        periodsPromise = loadPeriods().then(p => p.subscriptionPeriods);
    });

    const debounce = v => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            membersPromise = searchMembers(v).then(m => {
                console.log('storing search term: ' + v);
                $searchCriteriaStore.term = v;
                $memberSearchResultStore = m;
                return m;
            });
        }, 750);
    }

    function memberSelected(id) {
        console.log("dispatch memberSelected: " + id)
        dispatch('memberSelected', id);
    }

    function periodChanged(e) {
        console.log("selected period: " + selectedPeriod);
        $searchCriteriaStore.selectedPeriod = selectedPeriod;
    }
</script>

<div class="container mt-5">

    {#await periodsPromise}

        <p>loading...</p>

    {:then periods}

        {#if $searchCriteriaStore}

            <div class="mb-3">
                <label for="searchStringInput" class="form-label">Search String</label>
                <input type="searchString" class="form-control" id="searchStringInput"
                       on:keyup={({ target: { value } }) => debounce(value)} value={$searchCriteriaStore.term}>
            </div>
            <div class="mb-3">
                <label for="periodSelect" class="form-label">Period</label>
                <select bind:value={$searchCriteriaStore.period} class="form-control" id="periodSelect">
                    <option value="all">*</option>
                    {#each periods as period}
                        <option value="{period.id}">{period.name}</option>
                    {/each}
                </select>
            </div>

        {:else}
            <p>else</p>
        {/if}

    {:catch error}

        <p>Error loading search: {error}</p>

    {/await}

    {#await membersPromise}
        <p>loading...</p>
    {:then unusedValue}
        {#if $memberSearchResultStore}

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

                {#each $memberSearchResultStore.members as member}
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
        {/if}
    {:catch error}
        <p>failed to search: {error}</p>
    {/await}
</div>
