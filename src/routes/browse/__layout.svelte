<script>
	import { styleIndex } from '$lib/stores';
	import { Container, Spinner } from 'sveltestrap';

</script>

<Container xxl>
	{#if $styleIndex.isLoading}
		<div class="d-flex justify-content-center align-items-center h-100 w-100">
			<Spinner />
		</div>
	{:else if $styleIndex.error}
		<h1>Error</h1>
		{$styleIndex.error}
	{:else if $styleIndex.data}
		<slot />
	{/if}
</Container>
