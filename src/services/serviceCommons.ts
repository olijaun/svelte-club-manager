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
