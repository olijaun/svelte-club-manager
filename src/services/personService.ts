import { HttpClientBuilder } from "../http-client/HttpClientBuilder";

let target = HttpClientBuilder.createClient().target("http://localhost:8080/api");

export async function isReady() {
    try {
        await target.path("readiness").request().get();
        return true;
    } catch (error) {
        console.log(error);
        // could occur if there is a network problem
        return false;
    }
}

export async function exportPersons(): Promise<Response> {
    return await target.path("persons").request("text/csv").get();
}

export async function importPersonCsv(csv: string): Promise<any> {
    const response = await target.path("person-bulk-import").request().header("Content-Type", "text/csv").post(csv);
    return response.json();
}

export async function registerPersonId(id: string): Promise<string> {
    const response = await target.path(`person-id-requests/${id}`).request().put("");
    return response.text();
}

export async function updatePerson(personId: string, data: any): Promise<string> {
    const response = await target
        .path(`persons/${personId}`)
        .request()
        .header("Content-Type", "application/json")
        .put(JSON.stringify(data));

    return response.text();
}

export async function createPerson(personId: string, personIdRequestId: string, data: any) : Promise<string> {

    const response = await target
        .path(`persons/${personId}`)
        .request()
        .header("Content-Type", "application/json")
        .header('person-id-request-id', personIdRequestId)
        .put(JSON.stringify(data));

    return response.text();
}

export async function loadPerson(id: string) {
    const response = await target.path(`persons/${id}`).request().get();
    return response.json();
}