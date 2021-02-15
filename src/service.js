import {token, user} from "./store";

const HOSTNAME = 'http://localhost:8081'
//const HOSTNAME = 'https://loscaracoles.herokuapp.com'

async function getToken() {

    let accessToken = '';

    await token.subscribe(t => {
        accessToken = t;
    });

    return accessToken;
}

async function defaultHeaders() {
    return {
        Authorization: `Bearer ${await getToken()}`
    }
}

export async function searchMembers(searchString) {

    const response = await fetch(HOSTNAME + `/members`, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    return response.json();
}

export async function loadPeriods() {
    // const accessToken = await auth0Client.getTokenSilently();
    //
    let response = await fetch(`http://localhost:8081/subscription-periods`, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    return await response.json();
}

export async function loadMember(memberId) {
    console.log("loading member: " + memberId)
    // const accessToken = await auth0Client.getTokenSilently();
    //
    let response = await fetch(`http://localhost:8081/members/` + memberId, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    return await response.json();
}

export async function loadPerson(id) {
    // const accessToken = await auth0Client.getTokenSilently();
    //
    const response = await fetch(`http://localhost:8081/persons/` + id, {
        method: 'GET',
        headers: await defaultHeaders()
    });

    return response.json();
}