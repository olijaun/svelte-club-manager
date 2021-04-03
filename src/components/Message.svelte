<script lang="ts">
    export let message;

    $: {
        console.log(message);
    }
</script>

{#if message}
    <div class:alert-success={message.type === 'success'} class:alert-danger={message.type === 'danger'} class="alert" role="alert">
        {message.message}
    </div>
{/if}