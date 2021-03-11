import createAuth0Client from "@auth0/auth0-spa-js";
import { token, user, isAuthenticated, popupOpen } from "./store";
import config from "../auth_config";

// see https://auth0.com/blog/authenticating-svelte-apps/

async function createClient() {
    let auth0Client = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        scope: 'openid profile email user',
        audience: 'https://member-manager.jaun.org' // required to get jwt token. war früher bei angular-oauth2-oidc so gesetzt: customQueryParams: { audience: 'https://member-manager.jaun.org' },
    });

    return auth0Client;
}

async function loginWithPopup(client, options) {
    popupOpen.set(true);
    try {
        await client.loginWithPopup(options);

        user.set(await client.getUser());
        token.set(await client.getTokenSilently());
        // make sure to set this after token.set()
        isAuthenticated.set(true);

        console.log("raw token: " + token);

    } catch (e) {
        // eslint-disable-next-line
        console.error(e);
    } finally {
        popupOpen.set(false);
    }
}

function logout(client) {
    return client.logout();
}

const auth = {
    createClient,
    loginWithPopup,
    logout
};

export default auth;