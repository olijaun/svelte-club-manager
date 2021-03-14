<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import {countries} from './countries'
    import {bindClass, form} from 'svelte-forms';
    import {createPerson, loadPerson, registerPersonId, updatePerson} from './service'
    import {v4 as uuidv4} from 'uuid';
    import Error from "./Error.svelte";

    let GENDERS = [
        {value: 'MALE', viewValue: 'male'},
        {value: 'FEMALE', viewValue: 'female'}
    ];

    let TYPES = [
        {value: 'NATURAL', viewValue: 'natural-person'},
        {value: 'JURISTIC', viewValue: 'juristic-person'}
    ];

    export let id;

    let errorMessage;

    let isNaturalPerson = true;
    let personPromise;

    let type = TYPES[0];
    let firstName;
    let lastNameOrCompanyName;
    let birthdate;

    let email;
    let phone;

    let selectedGender;
    let street;
    let streetNumber;
    let zip;
    let city;
    let selectedCountry = countries.find(c => c.Code === "CH");

    $: isNaturalPerson = type === TYPES[0];

    const emailRule = value => ({valid: emailCheck(value), name: 'emailOrEmpty'})

    const memberForm = form(() => ({
        firstName: {value: firstName, validators: []},
        lastNameOrCompanyName: {value: lastNameOrCompanyName, validators: ['required']},
        gender: {value: selectedGender},
        birthdate: {value: birthdate, validators: []},
        email: {value: email, validators: [emailRule]},
        phone: {value: phone, validators: []},
        street: {value: street, validators: []},
        streetNumber: {value: streetNumber, validators: []},
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
                selectedGender = GENDERS.find(g => m.basicData.gender === g.value);
                console.log(m.basicData.gender + ": gender: " + selectedGender.value);
                // address
                street = m.streetAddress.street;

                streetNumber = m.streetAddress.houseNumber;
                zip = m.streetAddress.zip;
                city = m.streetAddress.city;
                selectedCountry = countries.find(c => m.streetAddress.isoCountryCode === c.Code)

                // contact data
                email = m.contactData.emailAddress;
                phone = m.contactData.phoneNumber;

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


    async function save() {

        errorMessage = null;

        memberForm.validate();

        if ($memberForm.valid === false) {
            console.log("invalid")
            return;
        }

        let person = {
            "type": type.value,
            "basicData": {
                "name": {
                    "lastNameOrCompanyName": lastNameOrCompanyName,
                    "firstName": firstName
                },
                "birthDate": birthdate,
                "gender": selectedGender.value
            },
            "contactData": {
                "phoneNumber": phone,
                "emailAddress": email
            }
        };

        if (street || streetNumber || zip || city) {
            person.address = {
                "street": street,
                "streetNumber": streetNumber,
                "zip": zip,
                "city": city,
                "country": selectedCountry.Code
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
                    <label for="inputFirstName" class="form-label">First name</label>
                </div>
            {/if}
            <div class="form-floating" class:col-md-6={isNaturalPerson} class:col-md-12={!isNaturalPerson}>
                <input type="text" class="form-control" id="inputLastName"
                       bind:value={lastNameOrCompanyName}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.lastNameOrCompanyName.valid}/>
                <label for="inputLastName" class="form-label">{isNaturalPerson ? "Last name" : "Company Name"}</label>
            </div>
            {#if isNaturalPerson}
                <div class="form-floating col-md-6">
                    <input type="date" class="form-control date" id="inputBirthday"
                           bind:value={birthdate}
                           use:bindClass={{ form: memberForm }}
                           class:is-invalid={!$memberForm.fields.birthdate.valid}/>
                    <label for="inputBirthday" class="form-label">Birthday</label>
                </div>

                <div class="form-floating col-md-6">
                    <select bind:value={selectedGender} class="form-control" id="periodSelect">
                        <option value=""></option>
                        {#each GENDERS as gender}
                            <option value="{gender}">{gender.viewValue}</option>
                        {/each}
                    </select>
                    <label for="periodSelect" class="form-label">Gender</label>
                </div>
            {/if}

            <div class="form-floating col-md-6">
                <input type="text" class="form-control" id="inputEmail"
                       bind:value={email}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.email.valid}/>
                <label for="inputEmail" class="form-label">Email</label>
            </div>
            <div class="form-floating col-md-6">
                <input type="text" class="form-control" id="inputPhone"
                       bind:value={phone}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.phone.valid}/>
                <label for="inputPhone" class="form-label">Phone</label>
            </div>


            <div class="form-floating col-8">
                <input type="text" class="form-control" id="inputStreet"
                       bind:value={street}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.street.valid}/>
                <label for="inputStreet" class="form-label">Street</label>
            </div>
            <div class="form-floating col-4">
                <input type="text" class="form-control" id="inputStreetNumber"
                       bind:value={streetNumber}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.streetNumber.valid}/>
                <label for="inputStreetNumber" class="form-label">Nr.</label>
            </div>
            <div class="form-floating col-4">
                <input type="text" class="form-control" id="inputZip"
                       bind:value={zip}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.zip.valid}/>
                <label for="inputZip" class="form-label">Zip</label>
            </div>
            <div class="form-floating col-8">
                <input type="text" class="form-control" id="inputCity"
                       bind:value={city}
                       use:bindClass={{ form: memberForm }}
                       class:is-invalid={!$memberForm.fields.city.valid}/>
                <label for="inputCity" class="form-label">City</label>
            </div>
            <div class="form-floating col-12">
                <select bind:value={selectedCountry} class="form-control" id="inputCountry">
                    <option value=""></option>
                    {#each countries as country}
                        <option value="{country}">{country.Name}</option>
                    {/each}
                </select>
                <label for="inputCountry" class="form-label">Country</label>
            </div>
            <div class="form-floating col-12">
                <Error errorMessage={errorMessage}/>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary" disabled={!$memberForm.valid || !$memberForm.dirty}>
                    Save
                </button>
            </div>
        </form>

    {:catch error}

        <Error errorMessage={error}/>

    {/await}
</div>
