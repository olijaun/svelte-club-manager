<script>
    import {onMount} from 'svelte';
    import {exportMembers, exportPersons, importPersonCsv, importMemberCsv} from './service'
    import streamSaver from 'streamsaver'
    import Message from "./Message.svelte";

    let personFileInput;
    let memberFileInput;
    let personCsvString;
    let memberCsvString;

    let importPersonMessage;
    let importMemberMessage;

    const onPersonFileSelected = (e) => {
        let csv = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(csv, "UTF-8");
        reader.onload = e => {
            personCsvString = e.target.result;
            importPersonMessage = {
                type: 'success',
                message: 'Successfully opened person CSV ' + csv.name + '. You can now import.'
            };
        };
    }

    const onMemberFileSelected = (e) => {
        let csv = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(csv, "UTF-8");
        reader.onload = e => {
            memberCsvString = e.target.result;
            importMemberMessage = {
                type: 'success',
                message: 'Successfully opened member CSV ' + csv.name + '. You can now import.'
            };
        };
    }

    onMount(async () => {

    });

    async function uploadPersons() {
        try {
            let result = await importPersonCsv(personCsvString);
            importPersonMessage = {
                type: 'success',
                message: 'File was uploaded successfully: ' + JSON.stringify(result)
            };
            personCsvString = null;
        } catch (e) {
            importPersonMessage = {
                type: 'danger',
                message: 'import of persons failed: ' + e
            }
        }
    }

    async function uploadMembers() {
        try {
            let result = await importMemberCsv(memberCsvString);
            importMemberMessage = {
                type: 'success',
                message: 'Member File was uploaded successfully: ' + JSON.stringify(result)
            };
            memberCsvString = null;
        } catch (e) {
            importMemberMessage = {
                type: 'danger',
                message: 'import of members failed: ' + e
            }
        }
    }

    async function downloadPersonExport() {
        exportPersons().then(res => download('person-export.csv', res));
    }

    async function downloadMemberExport() {
        exportMembers().then(res => download('member-export.csv', res));
    }

    async function download(filename, res) {
        console.log("saving to " + filename);
        const fileStream = streamSaver.createWriteStream(filename);

        const readableStream = res.body;

        // more optimized
        if (window.WritableStream && readableStream.pipeTo) {
            return readableStream.pipeTo(fileStream)
                .then(() => console.log('done writing'))
        }

        window.writer = fileStream.getWriter();

        const reader = res.body.getReader();
        const pump = () => reader.read()
            .then(res => res.done
                ? writer.close()
                : writer.write(res.value).then(pump))

        pump();
    }

</script>

<style>

</style>

<div class="container mt-5">
    <div class="card text-left">
        <div class="card-header">
            Import Person CSV
        </div>
        <div class="card-body">
            <form class="row g-2">
                <div class="form-floating col-md-12">
                    <input type="file" accept=".csv" on:change={(e)=>onPersonFileSelected(e)} bind:this={personFileInput}>
                </div>
                <Message message={importPersonMessage}/>
                <div class="col-md-12">
                    <button type="button" class="btn btn-primary md-2" on:click|preventDefault={uploadPersons}
                            disabled="{personCsvString === undefined || personCsvString === null}">upload
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div class="card text-left">
        <div class="card-header">
            Import Member CSV
        </div>
        <div class="card-body">
            <form class="row g-2">
                <div class="form-floating col-md-12">
                    <input type="file" accept=".csv" on:change={(e)=>onMemberFileSelected(e)} bind:this={memberFileInput}>
                </div>
                <Message message={importMemberMessage}/>
                <div class="col-md-12">
                    <button type="button" class="btn btn-primary md-2" on:click|preventDefault={uploadMembers}
                            disabled="{memberCsvString === undefined || memberCsvString === null}">upload
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div class="card text-left">
        <div class="card-header">
            Export Person CSV
        </div>
        <div class="card-body">
            <button type="button" class="btn btn-primary md-2" on:click|preventDefault={downloadPersonExport}>Download
                person
                export
            </button>
        </div>
    </div>
    <div class="card text-left">
        <div class="card-header">
            Export Person CSV
        </div>
        <div class="card-body">
            <button type="button" class="btn btn-primary md-2" on:click|preventDefault={downloadMemberExport}>Download
                member
                export
            </button>
        </div>
    </div>
</div>
