import {countries} from "./countries";
import {memberSearchResultStore} from "./stores";

export async function searchMembers(searchString) {
    // const accessToken = await auth0Client.getTokenSilently();
    //
    const response = await fetch(`http://localhost:8081/members`, {
        method: 'GET',
        headers: {
            //Authorization: `Bearer ${accessToken}`
        }
    });

    return response.json();
}

export async function loadPeriods() {
    // const accessToken = await auth0Client.getTokenSilently();
    //
    let response = await fetch(`http://localhost:8081/subscription-periods`, {
        method: 'GET',
        headers: {
            //Authorization: `Bearer ${accessToken}`
        }
    });

    return await response.json();
}

export async function loadMember(memberId) {
    console.log("loading member: " + memberId)
    // const accessToken = await auth0Client.getTokenSilently();
    //
    let response = await fetch(`http://localhost:8081/members/` + memberId, {
        method: 'GET',
        headers: {
            //Authorization: `Bearer ${accessToken}`
        }
    });

    return await response.json();
}

export async function loadPerson(id) {
    // const accessToken = await auth0Client.getTokenSilently();
    //
    const response = await fetch(`http://localhost:8081/persons/` + id, {
        method: 'GET',
        headers: {
            //Authorization: `Bearer ${accessToken}`
        }
    });

    return response.json();
}