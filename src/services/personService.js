import {getCsv, get, getUnauthenticated, postCsv, put} from "./serviceCommons"

export async function isReady() {

    try {
        const response = await getUnauthenticated(`/readiness`);
        handleErrors(response);
        return true;
    } catch (error) {
        // could occur if there is a network problem
        return false;
    }
}

export async function exportPersons() {
    return await getCsv(`/persons`);
}

export async function importPersonCsv(csv) {
    let response = await postCsv(`/person-bulk-import`, csv);
    handleErrors(response);
    return response.json();
}

export async function registerPersonId(id) {
    let response = await put(`/person-id-requests/${id}`);
    handleErrors(response);
    return response.text();
}

export async function updatePerson(personId, data) {
    const response = await put(`/persons/${personId}`, JSON.stringify(data));
    handleErrors(response);
    return response.text();
}

export async function createPerson(personId, personIdRequestId, data) {
    console.log("creating person: " + personId)

    const response = await put(`/persons/${personId}`, JSON.stringify(data),{'person-id-request-id': personIdRequestId});
    handleErrors(response);
    return response.text();
}

export async function loadPerson(id) {
    const response = await get(`/persons/${id}`);
    handleErrors(response);
    return response.json();
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}