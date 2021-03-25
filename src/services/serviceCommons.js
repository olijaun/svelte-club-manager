import {token} from "./stores";

// export const API_BASE_URL = 'http://localhost:8081'
export const API_BASE_URL = 'http://localhost:8080/api'
// export const API_BASE_PATH = 'https://loscaracoles.herokuapp.com/api'

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

export async function getUnauthenticated(path) {
    return fetch(API_BASE_URL + path, {
        method: 'GET',
    });
}

export async function get(path) {
    return fetch(API_BASE_URL + path, {
        method: 'GET',
        headers: await defaultHeaders()
    });
}

export async function getCsv(path) {
    return fetch(API_BASE_URL + path, {

        method: 'GET',
        headers: {
            Accept: 'text/csv',
            Authorization: `Bearer ${await getToken()}`
        }
    });
}

export async function put(path, body, additionalHeaders) {

    let basicHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getToken()}`,
    };
    console.log("hier? " + path);
    const headers = {...basicHeaders, ...additionalHeaders };

    return fetch(API_BASE_URL + path, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: body // body data type must match "Content-Type" header
    });
}

export async function postCsv(path, csv) {

    return await fetch(API_BASE_URL + path, {
        method: 'POST',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': "text/csv",
            'Authorization': `Bearer ${await getToken()}`
        },
        body: csv
    });
}
