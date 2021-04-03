import { HttpClientBuilder } from "../http-client/HttpClientBuilder";
import { API_BASE_URL } from "./serviceCommons"

let target = HttpClientBuilder.createClient().target(API_BASE_URL);

export async function searchMembers(searchCriteria: any): Promise<any> {
    if (searchCriteria.searchString == null) {
        searchCriteria.searchString = "";
    }
    if (searchCriteria.subscriptionPeriodId == null) {
        searchCriteria.subscriptionPeriodId = "";
    }

    if (searchCriteria.sortBy == null) {
        searchCriteria.sortBy = "ASC";
    }

    if (searchCriteria.sortAscending == null) {
        searchCriteria.sortAscending = true;
    }
    const response = await target.path("members")
        .request()
        .queryParam("searchString", searchCriteria.searchString)
        .queryParam("subscriptionPeriodId", searchCriteria.subscriptionPeriodId)
        .queryParam("sortBy", searchCriteria.sortBy)
        .queryParam("sortAscending", searchCriteria.sortAscending)
        .get();

    return response.json();
}

export async function exportMembers(searchCriteria: any): Promise<Response> {
    if (searchCriteria.searchString == null) {
        searchCriteria.searchString = "";
    }
    if (searchCriteria.subscriptionPeriodId == null) {
        searchCriteria.subscriptionPeriodId = "";
    }

    if (searchCriteria.sortBy == null) {
        searchCriteria.sortBy = "ASC";
    }

    if (searchCriteria.sortAscending == null) {
        searchCriteria.sortAscending = true;
    }
    return await target.path("members")
        .request("text/csv")
        .queryParam("searchString", searchCriteria.searchString)
        .queryParam("subscriptionPeriodId", searchCriteria.subscriptionPeriodId)
        .queryParam("sortBy", searchCriteria.sortBy)
        .queryParam("sortAscending", searchCriteria.sortAscending)
        .get();
}

export async function loadPeriods(): Promise<any> {
    let response = await target.path("subscription-periods").request().get();
    return await response.json();
}

export async function loadMember(memberId: string): Promise<any> {
    let response = await target.path(`members/${memberId}`).request().get();
    return await response.json();
}

export async function importMemberCsv(csv: string): Promise<any> {
    let response = await target.path("member-bulk-import")
        .request()
        .header("Content-Type", "text/csv")
        .post(csv);

    return response.json();
}

export async function updateMember(memberId: string, member: any) {
    target.path(`members/${memberId}`).request().header("Content-Type", "application/json").put(JSON.stringify(member));
}
