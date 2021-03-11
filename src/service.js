import {token, user} from "./store";

//const API_BASE_URL = 'http://localhost:8081'
const API_BASE_URL = 'http://localhost:8080/api'
//const API_BASE_PATH = 'https://loscaracoles.herokuapp.com/api'

async function getToken() {

    let accessToken = '';

    await token.subscribe(t => {
        accessToken = t;
        console.log("x bearer token is: " + JSON.stringify(accessToken))
    });

    return accessToken;
}

async function defaultHeaders() {
    return {
        Authorization: `Bearer ${await getToken()}`
    }
}

export async function searchMembers(searchCriteria) {

    let queryParams = `?searchString=${searchCriteria.searchString}&subscriptionPeriodId=${searchCriteria.subscriptionPeriodId}&sortBy=${searchCriteria.sortBy}&sortAscending=${searchCriteria.sortAscending}`;

    const response = await fetch(API_BASE_URL + `/members` + queryParams, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    return response.json();
}

export async function exportMembers() {
    return await fetch(`${API_BASE_URL}/members?sortBy=lastNameOrCompanyName&subscriptionPeriodId=`, {
        method: 'GET',
        headers: {
            Accept: 'text/csv',
            Authorization: `Bearer ${await getToken()}`
        }
    });
}

export async function loadPeriods() {
    // const accessToken = await auth0Client.getTokenSilently();
    //
    let response = await fetch(API_BASE_URL + `/subscription-periods`, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    return await response.json();
}

export async function loadMember(memberId) {
    console.log("loading member: " + memberId)
    // const accessToken = await auth0Client.getTokenSilently();
    //
    let response = await fetch(API_BASE_URL + `/members/` + memberId, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    return await response.json();
}

export async function loadPerson(id) {
    // const accessToken = await auth0Client.getTokenSilently();
    //
    const response = await fetch(API_BASE_URL + `/persons/` + id, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    return response.json();
}