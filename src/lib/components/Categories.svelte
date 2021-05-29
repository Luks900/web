<script lang="ts">
	import Category from '$lib/components/Category.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { CategoriesIndex } from '$lib/types';

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

{#each paginated as category (category.n)}
	<div class="mb-4">
		<Category data={category} />
	</div>
{/each}
<div class="m-auto">
	<Pagination bind:current={page} bind:total={totalPages} />
</div>
