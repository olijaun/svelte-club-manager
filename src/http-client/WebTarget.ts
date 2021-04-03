import type { HttpClient } from "./HttpClient";
import { InvocationBuilder } from "./InvocationBuilder";

export class WebTarget {
    
    private _url: URL;
    private httpCLient: HttpClient;

    constructor(httpClient: HttpClient, url: URL) {
        if(!httpClient) {
            throw new Error("httpClient cannot be null");
        }
        if(!url) {
            throw new Error("url cannot be null");
        }
        
        this._url = url;
        this.httpCLient = httpClient;
        console.log("new web target: " + url.toString())
    }

    public path(path: string) : WebTarget {
        console.log("path()")
        return new WebTarget(this.httpCLient, new URL(this._url.toString() + "/" + path));
    }

    public request(mimeType?: string) : InvocationBuilder {
        let invoc = new InvocationBuilder(mimeType, this);
        return invoc;
    }

    public get url() : URL {
        return this._url;
    }
}