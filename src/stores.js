import { writable } from 'svelte/store';

export const memberSearchResultStore = writable(undefined);
export const searchCriteriaStore = writable({ searchString: "", subscriptionPeriodId: "", sortBy: "lastNameOrCompanyName", sortAscending: true});