<script lang="ts">
	import { PaginationItem } from 'sveltestrap';

	export let current = 1;
	export let total = 10;

	type PaginationArray = { active: boolean; page: number }[];
	let array: PaginationArray = [];

	$: update(current, total);

	function update(current: number, total: number) {
		if (current > total) current = total;
		if (current <= 0) current = 1;
		array = createArray(current, total);
	}

	function paginate(page: number) {
		current = page;
	}

	function createArray(current: number, total: number): PaginationArray {
		let from = current - 2;
		if (from <= 0) from = 1;
		let to = current + 5 - (current - from);
		if (to > total) to = total;
		from = current - 5 - (current - to);
		if (from <= 0) from = 1;
		if (to > total) to = total;
		let array = [];
		for (let i = from; i <= to; i++) {
			array.push({
				active: current === i,
				page: i
			});
		}
		return array;
	}

</script>

<nav aria-label="pagination">
	<ul class="pagination flex-wrap">
		<PaginationItem>
			<button on:click={() => paginate(1)} class="page-link">
				«
			</button>
		</PaginationItem>
		<PaginationItem>
			<button on:click={() => paginate(current - 1)} class="page-link">
				‹
			</button>
		</PaginationItem>
		{#each array as item}
			<PaginationItem active={item.active}>
				<button on:click={() => paginate(item.page)} class="page-link">
					{item.page}
				</button>
			</PaginationItem>
		{/each}
		<PaginationItem>
			<button on:click={() => paginate(current + 1)} class="page-link">
				›
			</button>
		</PaginationItem>
		<PaginationItem>
			<button on:click={() => paginate(total)} class="page-link">
				»
			</button>
		</PaginationItem>
	</ul>
</nav>

<style>
	ul.pagination {
		display: flex;
		justify-content: center;
	}

</style>
