import { HttpError } from "./HttpError";
import type { WebTarget } from "./WebTarget";
import { token } from "../services/stores";

export class InvocationBuilder {
    private mimeType: string;
    private url: URL;
    private requestHeaders: Headers = new Headers();

    constructor(mimeType: string, target: WebTarget) {
        console.log("InvocationBuilder : " + target.url.toString());
        if (!target) {
            throw Error("target cannot be null");
        }

        if (mimeType) {
            this.mimeType = mimeType;
            this.header("Accept", this.mimeType);
        }
        this.url = target.url;
    }

    public header(name: string, value: string): InvocationBuilder {
        this.requestHeaders.set(name, value);
        return this;
    }

    public queryParam(name: string, value: string): InvocationBuilder {
        this.url.searchParams.append(name, value);
        return this;
    }

    public async get(): Promise<Response> {
        console.log("get() : ")
        if (!this.url.toString().endsWith("/readiness")) {
            this.header('Authorization', `Bearer ${await this.getToken()}`);
        }

        const response = await fetch(this.url.toString(), {
            method: 'GET',
            headers: this.requestHeaders
        });

        this.handleErrors(response)

        return response;
    }

    public async post(body: string): Promise<Response> {
        if (!this.url.toString().endsWith("/readiness")) {
            this.header('Authorization', `Bearer ${await this.getToken()}`);
        }
        return await fetch(this.url.toString(), {
            method: 'POST',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: this.requestHeaders,
            body: body
        });
    }

    public async put(body: string): Promise<Response> {
        if (!this.url.toString().endsWith("/readiness")) {
            this.header('Authorization', `Bearer ${await this.getToken()}`);
        }
        return fetch(this.url.toString(), {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: this.requestHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: body // body data type must match "Content-Type" header
        });
    }

    private handleErrors(response) {
        if (!response.ok) {
            throw new HttpError(response);
        }
    }

    private async getToken() {

        let accessToken = '';

        await token.subscribe(t => {
            accessToken = t;
            console.log("x bearer token is: " + JSON.stringify(accessToken))
        });

        return accessToken;
    }
}