<script>
    import {createEventDispatcher} from 'svelte';
    import {countries} from './countries'
    import {bindClass, form} from 'svelte-forms';

    let GENDERS = [
        {value: 'MALE', viewValue: 'male'},
        {value: 'FEMALE', viewValue: 'female'}
    ];

    let TYPES = [
        {value: 'NATURAL', viewValue: 'natural-person'},
        {value: 'JURISTIC', viewValue: 'juristic-person'}
    ];

    let id;

    let type = TYPES[0];
    let firstName;
    let lastName;
    let birthdate;

    let email;
    let phone;

    let selectedGender;
    let street;
    let streetNumber;
    let zip;
    let city;
    let selectedCountry = countries.find(c => c.Code === "CH");

    const dispatch = createEventDispatcher();

    function emailCheck(val) {
        if (val === '' || val == undefined) {
            return true;
        }
        // Email regex from Open Web Application Security Project (OWASP) : https://owasp.org/www-community/OWASP_Validation_Regex_Repository
        const regex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/
        return Boolean(val) && regex.test(val);
    }

    $: isNaturalPerson = type === TYPES[0];

    const emailRule = value => ({valid: emailCheck(value), name: 'emailOrEmpty'})

    const memberForm = form(() => ({
        firstName: {value: firstName, validators: []},
        lastName: {value: lastName, validators: ['required']},
        birthdate: {value: birthdate, validators: []},
        email: {value: email, validators: [emailRule]},
        phone: {value: phone, validators: []},
        street: {value: street, validators: []},
        streetNumber: {value: streetNumber, validators: []},
        zip: {value: zip, validators: []},
        city: {value: city, validators: []}
    }));

    function save() {

        console.log("save: " + $memberForm.valid)
    }
</script>

<div class="container mt-5">
    <form on:submit|preventDefault={e => save()} class="row g-2" novalidate>

        <div class="form-floating col-md-12">
            <input type="text" class="form-control" id="inputMemberId" bind:value={id} disabled/>
            <label for="inputMemberId" class="form-label">Member Id</label>
        </div>

        <div class="form-check col-md-6">
            <input bind:group={type} value={TYPES[0]} class="form-check-input" type="radio" name="exampleRadios"
                   id="typeRadio0">
            <label class="form-check-label" for="typeRadio0">
                {TYPES[0].viewValue}
            </label>
        </div>
        <div class="form-check col-md6">
            <input bind:group={type} value={TYPES[1]} class="form-check-input" type="radio" name="exampleRadios"
                   id="typeRadio1">
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
        <div class="form-floating col-md-6">
            <input type="text" class="form-control" id="inputLastName"
                   bind:value={lastName}
                   use:bindClass={{ form: memberForm }}
                   class:is-invalid={!$memberForm.fields.lastName.valid}/>
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
                        <option value="{gender.value}">{gender.viewValue}</option>
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


        <div class="form-floating col-10">
            <input type="text" class="form-control" id="inputStreet"
                   bind:value={street}
                   use:bindClass={{ form: memberForm }}
                   class:is-invalid={!$memberForm.fields.street.valid}/>
            <label for="inputStreet" class="form-label">Street</label>
        </div>
        <div class="form-floating col-2">
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
        <div class="form-floating col-8">
            <select bind:value={selectedCountry} class="form-control" id="inputCountry">
                <option value=""></option>
                {#each countries as country}
                    <option value="{country}">{country.Name}</option>
                {/each}
            </select>
            <label for="inputCountry" class="form-label">Country</label>
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-primary" disabled={!$memberForm.valid || !$memberForm.dirty}>Save
            </button>
        </div>
    </form>

</div>
