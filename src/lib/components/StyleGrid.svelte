<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import StyleCard from '$lib/components/StyleCard.svelte';
	import type { SearchIndex } from "$lib/types";
	import { Col,Row } from 'sveltestrap';

	export let data: SearchIndex = [];
	export let page = 1;
	export let totalPages = 1;
	export let perPage = 36;

	let paginated: SearchIndex = [];

	function update(..._args: any[]) {
		totalPages = Math.ceil(data.length / perPage);
		if (page > totalPages) page = totalPages;
		if (page <= 0) page = 1;

		paginated = data.slice((page - 1) * perPage, page * perPage);
	}

	$: update(data, page, perPage);
</script>

<Row>
	{#each paginated as style (style.i)}
		<Col xl="3" lg="4" md="6" sm="12" class="mb-4">
			<StyleCard data={style} />
		</Col>
	{/each}
</Row>
<Row>
	<div class="m-auto">
		<Pagination bind:current={page} bind:total={totalPages} />
	</div>
</Row>
