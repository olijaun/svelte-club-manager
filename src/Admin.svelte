<script>
    import {onMount} from 'svelte';
    import {exportMembers} from './service'
    import streamSaver from 'streamsaver'

    onMount(async () => {

    });

    async function downloadPersonExport() {
        exportMembers().then(res => download('person-export.csv', res));
    }

    async function downloadMemberExport() {
        exportMembers().then(res => download('member-export.csv', res));
    }

    async function download(filename, res) {
        console.log("saving to " + filename);
        const fileStream = streamSaver.createWriteStream(filename);

        const readableStream = res.body

        // more optimized
        if (window.WritableStream && readableStream.pipeTo) {
            return readableStream.pipeTo(fileStream)
                .then(() => console.log('done writing'))
        }

        window.writer = fileStream.getWriter()

        const reader = res.body.getReader()
        const pump = () => reader.read()
            .then(res => res.done
                ? writer.close()
                : writer.write(res.value).then(pump))

        pump()
    }

</script>

<style>

</style>

<div class="container mt-5">

    <button type="button" class="btn btn-primary md-2" on:click|preventDefault={downloadPersonExport}>Download person
        export
    </button>
    <button type="button" class="btn btn-primary md-2" on:click|preventDefault={downloadMemberExport}>Download member
        export
    </button>

</div>
