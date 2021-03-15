import {token, user} from "./store";

// const API_BASE_URL = 'http://localhost:8081'
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

    handleErrors(response);

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

export async function exportPersons() {
    return await fetch(`${API_BASE_URL}/persons`, {
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

    handleErrors(response);

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

    handleErrors(response);

    return await response.json();
}

export async function importPersonCsv(csv) {
    let response = await fetch(API_BASE_URL + `/persons`, {
        method: 'POST',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': "text/csv",
            'Authorization': `Bearer ${await getToken()}`
        },
        body: csv
    });

    handleErrors(response);
}

export async function importMemberCsv(csv) {
    let response = await fetch(API_BASE_URL + `/members`, {
        method: 'POST',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': "text/csv",
            'Authorization': `Bearer ${await getToken()}`
        },
        body: csv
    });

    handleErrors(response);
}

export async function updateMember(memberId, member) {
    console.log("loading member: " + memberId)
    // const accessToken = await auth0Client.getTokenSilently();
    //
    let response = await fetch(API_BASE_URL + `/members/` + memberId, {
        method: 'PUT',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify(member)
    });

    handleErrors(response);
}

export async function registerPersonId(id) {

    let response = await fetch(API_BASE_URL + `/person-id-requests/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${await getToken()}`
        }
    });

    handleErrors(response);

    return response.text();
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export async function updatePerson(personId, data) {
    console.log("updating person: " + personId)

    const response = await fetch(API_BASE_URL + `/persons/` + personId, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    handleErrors(response);

    return response.text();
}

export async function createPerson(personId, personIdRequestId, data) {
    console.log("creating person: " + personId)

    const response = await fetch(API_BASE_URL + `/persons/` + personId, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`,
            'person-id-request-id': personIdRequestId
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    handleErrors(response);

    return response.text();
}

export async function loadPerson(id) {
    const response = await fetch(API_BASE_URL + `/persons/` + id, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    handleErrors(response);

    return response.json();
}