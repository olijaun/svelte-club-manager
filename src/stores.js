import { writable } from 'svelte/store';

export const memberSearchResultStore = writable(undefined);

export const searchCriteriaStore = writable({ term: "", period: "all"});