import {get, getCsv, postCsv, put} from "./serviceCommons"

export async function searchMembers(searchCriteria) {

    let queryParams = `?searchString=${searchCriteria.searchString}&subscriptionPeriodId=${searchCriteria.subscriptionPeriodId}&sortBy=${searchCriteria.sortBy}&sortAscending=${searchCriteria.sortAscending}`;

    const response = await get(`/members` + queryParams);
    handleErrors(response);
    return response.json();
}

export async function exportMembers(searchCriteria) {
    if(searchCriteria.searchString == null) {
        searchCriteria.searchString = "";
    }
    if(searchCriteria.subscriptionPeriodId == null) {
        searchCriteria.subscriptionPeriodId = "";
    }

    if(searchCriteria.sortBy == null) {
        searchCriteria.sortBy = "ASC";
    }

    if(searchCriteria.sortAscending == null) {
        searchCriteria.sortAscending = true;
    }

    let queryParams = `?searchString=${searchCriteria.searchString}&subscriptionPeriodId=${searchCriteria.subscriptionPeriodId}&sortBy=${searchCriteria.sortBy}&sortAscending=${searchCriteria.sortAscending}`;
    return await getCsv(`/members` + queryParams);
}

export async function loadPeriods() {
    let response = await get(`/subscription-periods`);
    handleErrors(response);
    return await response.json();
}

export async function loadMember(memberId) {
    let response = await get(`/members/` + memberId);
    handleErrors(response);
    return await response.json();
}

export async function importMemberCsv(csv) {
    let response = await postCsv(`/member-bulk-import`, csv);

    handleErrors(response);

    return response.json();
}

export async function updateMember(memberId, member) {
    let response = await put(`/members/` + memberId, JSON.stringify(member));
    handleErrors(response);
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
