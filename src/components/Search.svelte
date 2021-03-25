<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import {memberSearchResultStore} from '../services/stores';
    import {searchCriteriaStore} from '../services/stores';
    import {exportMembers, loadPeriods, searchMembers} from '../services/memberService'
    import Error from "./Error.svelte";
    import {download} from '../services/downloadhelper'
    import {_} from '../services/i18n'

    const dispatch = createEventDispatcher();

    let timer;
    let membersPromise;
    let periodsPromise = [];
    let selectedPeriod;

    let sortBy;

    onMount(async () => {
        periodsPromise = loadPeriods().then(p => p.subscriptionPeriods);
    });

    const debounce = v => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            $searchCriteriaStore.searchString = v;
            membersPromise = search($searchCriteriaStore)
        }, 750);
    }

    async function search(searchCriteria) {
        console.log("searching via rest " + JSON.stringify(searchCriteria));
        return searchMembers(searchCriteria).then(m => {
            $memberSearchResultStore = m;
            return m;
        });
    }

    function memberSelected(id) {
        console.log("dispatch memberSelected: " + id)
        dispatch('memberSelected', id);
    }

    function periodChanged() {
        console.log("periodChanged " + $searchCriteriaStore.subscriptionPeriodId)
        search($searchCriteriaStore);
    }

    $: sortBy = $searchCriteriaStore.sortBy;

    function changeSortBy(sortBy) {
        if (sortBy == $searchCriteriaStore.sortBy) {
            $searchCriteriaStore.sortAscending = !($searchCriteriaStore.sortAscending);
        } else {
            $searchCriteriaStore.sortBy = sortBy;
        }
        search($searchCriteriaStore)
    }

    async function downloadSearchResult() {
        console.log("downloading...")

        exportMembers($searchCriteriaStore).then(res => download('search-result.csv', res));
    }

</script>

<style>

    h2.page-header {
        margin-top: 0px;
        padding-top: 0px;
        line-height: 15px;
        vertical-align: middle;
    }

    .table-sortable > thead > tr > th {
        cursor: pointer;
        position: relative;
    }

    .table-sortable > thead > tr > th:after,
    .table-sortable > thead > tr > th:after,
    .table-sortable > thead > tr > th:after {
        content: ' ';
        position: absolute;
        height: 0;
        width: 0;
        right: 10px;
        top: 16px;
    }

    .table-sortable > thead > tr > th:after {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #ccc;
        border-bottom: 0px solid transparent;
    }

    .table-sortable > thead > tr > th:hover:after {
        border-top: 5px solid #888;
    }

    .table-sortable > thead > tr > th.asc:after {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 0px solid transparent;
        border-bottom: 5px solid #333;
    }
    .table-sortable > thead > tr > th.asc:hover:after {
        border-bottom: 5px solid #888;
    }

    .table-sortable > thead > tr > th.desc:after {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #333;
        border-bottom: 5px solid transparent;
    }


</style>

<div class="container mt-5">

    {#await periodsPromise}

        <p>loading...</p>

    {:then periods}

        {#if $searchCriteriaStore}

            <div class="mb-3">
                <label for="searchStringInput" class="form-label">{$_('search.term')}</label>
                <input type="searchString" class="form-control" id="searchStringInput"
                       on:keyup={({ target: { value } }) => debounce(value)} value={$searchCriteriaStore.searchString}>
            </div>
            <div class="mb-3">
                <label for="periodSelect" class="form-label">{$_('search.period')}</label>
                <select bind:value={$searchCriteriaStore.subscriptionPeriodId} class="form-control" id="periodSelect" on:change|preventDefault={periodChanged}>
                    <option value="">*</option>
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
            <a href="" on:click|preventDefault={e => downloadSearchResult()}>Download search result as CSV</a>
            <table class="table table-sortable">
                <thead>
                <tr>
                    <th scope="col" on:click={e => changeSortBy('id')} class:desc={sortBy == 'id' && !$searchCriteriaStore.sortAscending} class:asc={sortBy == 'id' && $searchCriteriaStore.sortAscending}>#</th>
                    <th scope="col" on:click={e => changeSortBy('lastNameOrCompanyName')} class:desc={sortBy == 'lastNameOrCompanyName' && !$searchCriteriaStore.sortAscending} class:asc={sortBy == 'lastNameOrCompanyName' && $searchCriteriaStore.sortAscending}>Nachname</th>
                    <th scope="col" on:click={e => changeSortBy('firstName')} class:desc={sortBy == 'firstName' && !$searchCriteriaStore.sortAscending} class:asc={sortBy == 'firstName' && $searchCriteriaStore.sortAscending}>Vorname</th>
                    <th scope="col">Adresse</th>
                    <th scope="col">Typ</th>
                </tr>
                </thead>

                <tbody>

                {#each $memberSearchResultStore.members as member}
                    <tr on:click|preventDefault={e => memberSelected(member.id)}>
                        <th scope="row">{member.id}</th>
                        <td>{member.lastNameOrCompanyName}</td>
                        <td>{#if member.firstName }{member.firstName}{/if}</td>
                        <td>{#if member.address }{member.address}{/if}</td>
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
        <Error errorMessage={error}/>
    {/await}
</div>
