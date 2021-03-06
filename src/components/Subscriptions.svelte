<script lang="ts">
    import {onMount} from 'svelte';
    import {loadPeriods, updateMember, loadMember} from '../services/memberService'
    import Error from "./Error.svelte";
    import {v4 as uuidv4} from 'uuid';
    import {_} from '../services/i18n';

    export let id;

    let memberPromise = Promise.resolve();
    let periodsPromise = Promise.resolve();

    let selectedPeriod;
    let selectedSubscriptionType;

    let displaySubscriptions = [];
    let unsavedSubscriptions = [];

    let addedPeriods = [];
    let removedPeriods = [];

    onMount(async () => {

        periodsPromise = loadPeriods().then(periods => {
            selectedPeriod = periods.subscriptionPeriods[0];
            selectedSubscriptionType = selectedPeriod.subscriptionTypes[0];
            console.log("load periods finished: " + JSON.stringify(periods.subscriptionPeriods));
            return periods.subscriptionPeriods;
        });

        memberPromise = loadMember(id).then(member => {
            displaySubscriptions = member.subscriptions.map(s => {
                return {"subscriptionPeriodId": s.subscriptionPeriodId, "subscriptionTypeId": s.subscriptionTypeId}
            });
            console.log("displaySubscriptions: " + JSON.stringify(displaySubscriptions));
            console.log("return member: " + member);
            return member;
        });
    });

    async function addSubscription(subscriptionPeriodId, subscriptionTypeId) {

        let newSubscription = {
            "subscriptionPeriodId": subscriptionPeriodId,
            "subscriptionTypeId": subscriptionTypeId,
            "id": uuidv4(),
            "memberId": id
        };

        let member = await memberPromise;

        member.subscriptions = [...member.subscriptions, newSubscription];

        if (!displaySubscriptions.find(s => s.subscriptionPeriodId === subscriptionPeriodId && s.subscriptionTypeId === subscriptionTypeId)) {
            displaySubscriptions = [...displaySubscriptions, newSubscription];
            unsavedSubscriptions = [...unsavedSubscriptions, newSubscription];
            console.log("added subscription: " + JSON.stringify(newSubscription));
        }
    }

    async function save() {
        console.log("save stuff: " + JSON.stringify(unsavedSubscriptions));

        let member = await memberPromise;

        let updatedMember = {
            "subscriptions": member.subscriptions
        }

        await updateMember(id, updatedMember);

        unsavedSubscriptions = [];
    }

</script>

<div class="container mt-5">

    {#await periodsPromise}

        <p>loading...</p>

    {:then periods}

        <form on:submit|preventDefault={e => save()} class="row g-2" novalidate>

            <div class="form-floating col-md-6">
                <select bind:value={selectedPeriod} class="form-control" id="periodSelect">
                    {#each periods as period}
                        <option value="{period}">{period.name}</option>
                    {/each}
                </select>
                <label for="periodSelect" class="form-label">{$_('subscriptions.period')}</label>
            </div>

            <div class="form-floating col-md-6">
                <select bind:value={selectedSubscriptionType} class="form-control" id="membershipTypeSelect"
                        disabled={!selectedPeriod}>
                    {#if selectedPeriod}
                        {#each selectedPeriod.subscriptionTypes as subscriptionType}
                            <option value="{subscriptionType}">{subscriptionType.name}</option>
                        {/each}
                    {/if}
                </select>
                <label for="membershipTypeSelect" class="form-label">{$_('subscriptions.type')}</label>
            </div>
            <div class="col-12">
                <button class="btn btn-primary"
                        on:click={addSubscription(selectedPeriod.id, selectedSubscriptionType.id)}
                        disabled={(!selectedPeriod && !selectedSubscriptionType) || displaySubscriptions.find(s => s.subscriptionPeriodId === selectedPeriod.id && s.subscriptionTypeId === selectedSubscriptionType.id) }>
                    {$_('common.add')}
                </button>
            </div>

            {#await memberPromise}
            {:then member}
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">{$_('subscriptions.period')}</th>
                        <th scope="col">{$_('subscriptions.type')}</th>
                    </tr>
                    </thead>

                    <tbody>
                    {#each displaySubscriptions as subscription}
                        <tr>
                            <td>{periods.find(p => p.id === subscription.subscriptionPeriodId).name}</td>
                            <td>{periods.find(p => p.id === subscription.subscriptionPeriodId).subscriptionTypes.find(s => s.id === subscription.subscriptionTypeId).name}</td>
                        </tr>
                    {/each}
                    </tbody>
                </table>

            {:catch error}
                <p>failed to load member data: {error}</p>
            {/await}
            <div class="col-12">
                <button type="submit" class="btn btn-primary" disabled={unsavedSubscriptions.length === 0}>{$_('common.save')}
                </button>
            </div>
        </form>

    {:catch error}

        <Error errorMessage={error}/>

    {/await}
</div>
