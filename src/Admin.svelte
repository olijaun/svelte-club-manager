<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import Admin from './Admin.svelte';
    import {exportMembers} from './service'

    onMount(async () => {

    });

    function download() {
        exportMembers();

        <!--exportPersons() : void {-->


        // import { saveAs } from 'file-saver';

        <!--    this.personService.exportCsv().subscribe(-->
        <!--        (res) => {-->
        <!--            const blob = new Blob([res], { type: 'text/csv' });-->
        <!--            saveAs(blob, "test.csv");-->
        //         }
        //     );
        // }
    }

</script>

<style>

</style>

<div class="container mt-5">

    <button on:click={download}>Download member export</button>

</div>
