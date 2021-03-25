<script>
    export let errorMessage;

    $: {
        console.log(errorMessage);
    }
</script>

{#if errorMessage}
    <div class="alert alert-danger" role="alert">
        {errorMessage}
    </div>
{/if}