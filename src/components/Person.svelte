<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    import {countries} from '../services/countries'
    import {bindClass, form} from 'svelte-forms';
    import {createPerson, loadPerson, registerPersonId, updatePerson} from '../services/personService';
    import {v4 as uuidv4} from 'uuid';
    import { isPossiblePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
    import {_} from '../services/i18n';
    import Error from "./Error.svelte";

    let GENDERS = [
        {value: 'MALE', viewValue: 'male'},
        {value: 'FEMALE', viewValue: 'female'}
    ];

    let TYPES = [
        {value: 'NATURAL', viewValue: $_('person.naturalPerson')},
        {value: 'JURISTIC', viewValue: $_('person.juristicPerson')}
    ];

    export let id;

    let errorMessage;

    let isNaturalPerson : boolean = true;
    let personPromise;

    let type = TYPES[0];
    let firstName : string;
    let lastNameOrCompanyName : string;
    let birthdate;

    let email;
    let phone;

    let selectedGender;
    let street;
    let houseNumber;
    let zip;
    let city;
    let selectedCountry = countries.find(c => c.Code === "CH");

    $: isNaturalPerson = type === TYPES[0];

    const emailRule = value => ({valid: emailCheck(value), name: 'emailOrEmpty'});

    const phoneRule = value => ({valid: phoneCheck(value), name: 'phoneOrEmpty'});

    const memberForm = form(() => ({
        firstName: {value: firstName, validators: []},
        lastNameOrCompanyName: {value: lastNameOrCompanyName, validators: ['required']},
        gender: {value: selectedGender},
        birthdate: {value: birthdate, validators: []},
        email: {value: email, validators: [emailRule]},
        phone: {value: phone, validators: [phoneRule]},
        street: {value: street, validators: []},
        houseNumber: {value: houseNumber, validators: []},
        zip: {value: zip, validators: []},
        city: {value: city, validators: []},
        country: {value: selectedCountry}
    }));

    const dispatch = createEventDispatcher();

    onMount(async () => {
        if (id) {
            personPromise = loadPerson(id).then(m => {
                type = TYPES.find(t => t.value === m.type)

                // basic data
                firstName = m.basicData.name.firstName;
                lastNameOrCompanyName = m.basicData.name.lastNameOrCompanyName;
                birthdate = m.basicData.birthDate;
                if (m.basicData.gender) {
                    selectedGender = GENDERS.find(g => m.basicData.gender === g.value);
                }

                // address
                if (m.streetAddress) {
                    street = m.streetAddress.street;
                    houseNumber = m.streetAddress.houseNumber;
                    zip = m.streetAddress.zip;
                    city = m.streetAddress.city;
                    if (m.streetAddress.isoCountryCode) {
                        selectedCountry = countries.find(c => m.streetAddress.isoCountryCode === c.Code)
                    }
                }

                // contact data
                if (m.contactData) {
                    email = m.contactData.emailAddress;
                    phone = m.contactData.phoneNumber;
                }

                // Don't forget to reset after loading
                memberForm.reset();

            });
        } else {
            personPromise = Promise.resolve();
        }
    });

    function emailCheck(val) {
        if (val === '' || val == undefined) {
            return true;
        }
        // Email regex from Open Web Application Security Project (OWASP) : https://owasp.org/www-community/OWASP_Validation_Regex_Repository
        const regex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/
        return Boolean(val) && regex.test(val);
    }

    function phoneCheck(val) {
        if (val === '' || val == undefined) {
            return true;
        }
        console.log("is valid: " + selectedCountry.Code)
        return isValidPhoneNumber(phone, selectedCountry.Code)
    }

    function empty2null(string) {
        if(string === "") {
            return null;
        }
        return string;
    }

    async function save() {

        errorMessage = null;

        memberForm.validate();

        if ($memberForm.valid === false) {
            errorMessage = "invalid input";
            return;
        }

        let person = {
            "type": type.value,
            "basicData": {
                "name": {
                    "lastNameOrCompanyName": empty2null(lastNameOrCompanyName),
                    "firstName": empty2null(firstName)
                },
                "birthDate": birthdate,
                "gender": selectedGender.value
            },
            "contactData": {
                "phoneNumber": empty2null(phone),
                "emailAddress": empty2null(email)
            }
        };

        if (street || houseNumber || zip || city) {
            person.streetAddress = {
                "street": empty2null(street),
                "houseNumber": empty2null(houseNumber),
                "zip": empty2null(zip),
                "city": empty2null(city),
                "isoCountryCode": selectedCountry.Code
            };
        }

        try {
            if (!id) {
                let personIdRequestId = uuidv4();
                id = await registerPersonId(personIdRequestId);
                await createPerson(id, personIdRequestId, person);
            } else {
                console.log("update person");
                await updatePerson(id, person);
            }

            memberForm.reset();

        } catch (error) {
            errorMessage = error;
        }
    }
</script>

<div class="container mt-5">

    {#await personPromise}

        <p>loading user...</p>

    {:then value}

        <form on:submit|preventDefault={e => save()} class="row g-2" novalidate>

            <div class="form-check col-md-12">
                <input bind:group={type} value={TYPES[0]} class="form-check-input" type="radio" name="exampleRadios"
                       id="typeRadio0" disabled={id != undefined}>
                <label class="form-check-label" for="typeRadio0">
                    {TYPES[0].viewValue}
                </label>
            </div>
            <div class="form-check col-md-12">
                <input bind:group={type} value={TYPES[1]} class="form-check-input" type="radio" name="exampleRadios"
                       id="typeRadio1" disabled={id != undefined}>
                <label class="form-check-label" for="typeRadio1">
                    {TYPES[1].viewValue}
                </label>
            </div>

            {#if isNaturalPerson}
                <div class="form-floating col-md-6">
                    <input type="text" class="form-control" id="inputFirstName"
                           bind:value={firstName}
                           use:bindClass={{ form: memberForm }}
                           class:is-invalid={!$memberForm.fields.firstName.valid}/>
                    <label for="inputFirstName" class="form-label">{$_('person.firstName')}</label>
                </div>
            {/if}
            <div class="form-floating" class:col-md-6={isNaturalPerson} class:col-md-12={!isNaturalPerson}>
                <input type="text" class="form-control" id="inputLastName"
                       bind:value={lastNameOrCompanyName}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.lastNameOrCompanyName.valid}/>
                <label for="inputLastName" class="form-label">{isNaturalPerson ? $_('person.lastName') : $_('person.companyName')}</label>
            </div>
            {#if isNaturalPerson}
                <div class="form-floating col-md-6">
                    <input type="date" class="form-control date" id="inputBirthday"
                           bind:value={birthdate}
                           use:bindClass={{ form: memberForm }}
                           class:is-invalid={!$memberForm.fields.birthdate.valid}/>
                    <label for="inputBirthday" class="form-label">{$_('person.birthday')}</label>
                </div>

                <div class="form-floating col-md-6">
                    <select bind:value={selectedGender} class="form-control" id="periodSelect">
                        <option value=""></option>
                        {#each GENDERS as gender}
                            <option value="{gender}">{gender.viewValue}</option>
                        {/each}
                    </select>
                    <label for="periodSelect" class="form-label">{$_('person.gender')}</label>
                </div>
            {/if}

            <div class="form-floating col-md-6">
                <input type="text" class="form-control" id="inputEmail"
                       bind:value={email}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.email.valid}/>
                <label for="inputEmail" class="form-label">{$_('person.email')}</label>
            </div>
            <div class="form-floating col-md-6">
                <input type="text" class="form-control" id="inputPhone"
                       bind:value={phone}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.phone.valid}/>
                <label for="inputPhone" class="form-label">{$_('person.phone')}</label>
            </div>


            <div class="form-floating col-8">
                <input type="text" class="form-control" id="inputStreet"
                       bind:value={street}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.street.valid}/>
                <label for="inputStreet" class="form-label">{$_('person.street')}</label>
            </div>
            <div class="form-floating col-4">
                <input type="text" class="form-control" id="inputHouseNumber"
                       bind:value={houseNumber}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.houseNumber.valid}/>
                <label for="inputHouseNumber" class="form-label">{$_('person.houseNumber')}</label>
            </div>
            <div class="form-floating col-4">
                <input type="text" class="form-control" id="inputZip"
                       bind:value={zip}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.zip.valid}/>
                <label for="inputZip" class="form-label">{$_('person.zip')}</label>
            </div>
            <div class="form-floating col-8">
                <input type="text" class="form-control" id="inputCity"
                       bind:value={city}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.city.valid}/>
                <label for="inputCity" class="form-label">{$_('person.city')}</label>
            </div>
            <div class="form-floating col-12">
                <select bind:value={selectedCountry} class="form-control" id="inputCountry">
                    <option value=""></option>
                    {#each countries as country}
                        <option value="{country}">{country.Name}</option>
                    {/each}
                </select>
                <label for="inputCountry" class="form-label">{$_('person.country')}</label>
            </div>
            <div class="form-floating col-12">
                <Error errorMessage={errorMessage}/>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary" disabled={!$memberForm.valid || !$memberForm.dirty}>
                    {$_('common.save')}
                </button>
            </div>
        </form>

    {:catch error}

        <Error errorMessage={error}/>

    {/await}
</div>
