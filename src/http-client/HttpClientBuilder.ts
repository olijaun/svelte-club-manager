import { HttpClient } from "./HttpClient";

export class HttpClientBuilder {
    public static createClient() : HttpClient {
        return new HttpClient();
    }
}