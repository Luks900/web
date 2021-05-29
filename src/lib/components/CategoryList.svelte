<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import Category from '$lib/components/Category.svelte';
	import type { CategoriesIndex } from "$lib/types";
	import { Col,Row } from 'sveltestrap';

	export let data: CategoriesIndex = [];
	export let page = 1;
	export let totalPages = 1;
	export let perPage = 10;

	let paginated: CategoriesIndex = [];
	
	function update(..._args: unknown[]) {
		totalPages = Math.ceil(data.length / perPage);
		if (page > totalPages) page = totalPages;
		if (page <= 0) page = 1;

		paginated = data.slice((page - 1) * perPage, page * perPage);
	}

	$: update(data, page, perPage);
</script>

<Row>
	{#each paginated as category (category.n)}
		<Category data={category} />
	{/each}
</Row>
<Row>
	<div class="m-auto">
		<Pagination bind:current={page} bind:total={totalPages} />
	</div>
</Row>
