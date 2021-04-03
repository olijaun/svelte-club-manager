import { WebTarget } from "./WebTarget";

export class HttpClient {

    constructor() {

    }

    public target(url: string): WebTarget {
        console.log("target");
        return new WebTarget(this, new URL(url));
    }
}