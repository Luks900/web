<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import StyleCard from '$lib/components/StyleCard.svelte';
	import type { SearchIndex } from '$lib/types';
	import { getScreenshot } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { Col, Row, Table } from 'sveltestrap';

	const dispatch = createEventDispatcher();

	export let table = false;
	export let data: SearchIndex = [];
	export let page = 1;
	export let totalPages = 1;
	export let perPage = 36;

	$: perPage = table ? 75 : 36;

	let paginated: SearchIndex = [];

	function update(..._args: unknown[]) {
		totalPages = Math.ceil(data.length / perPage);
		if (page > totalPages) page = totalPages;
		if (page <= 0) page = 1;

		paginated = data.slice((page - 1) * perPage, page * perPage);
	}

	$: update(data, page, perPage);

</script>

<Row>
	{#if table}
		<Table responsive bordered striped class="text-nowrap">
			<thead>
				<tr>
					<th scope="col">Screenshot</th>
					<th scope="col">Name</th>
					<th scope="col">Category</th>
					<th scope="col">Author</th>
					<th scope="col"><button class="btn-unstyled" on:click={() => dispatch("sort", "updated")}>Updated at</button></th>
					<th scope="col"><button class="btn-unstyled" on:click={() => dispatch("sort", "weeklyInstalls")}>Weekly installs</button></th>
					<th scope="col"><button class="btn-unstyled" on:click={() => dispatch("sort", "totalInstalls")}>Total installs</button></th>
					<th scope="col"><button class="btn-unstyled" on:click={() => dispatch("sort", "rating")}>Rating</button></th>
				</tr>
			</thead>
			<tbody>
				{#each paginated as style (style.i)}
					<tr class="align-middle">
						<td>
							{#if style.sn}
								<a href={getScreenshot({ name: style.sn, archived: style.sa })} target="_blank">
									<img class="screenshot" src={getScreenshot({ name: style.sn, archived: style.sa })} alt="Screenshot" />
								</a>
							{:else}
								<div class="screenshot" />
							{/if}
						</td>
						<th class="text-wrap" scope="row">
							<a href={'/style/' + style.i}>
								{style.n}
							</a>
						</th>
						<td>
							<a href={'/browse/styles/?search=' + encodeURIComponent('#' + style.c)}>
								{style.c}
							</a>
						</td>
						<td>
							<a href={'/browse/styles/?search=' + encodeURIComponent('@' + style.ai)}>
								{style.an}
							</a>
						</td>
						<td>{new Date(style.u * 1000).toLocaleString()}</td>
						<td>{style.w}</td>
						<td>{style.t}</td>
						<td>{style.r || "-"}</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{:else}
		{#each paginated as style (style.i)}
			<Col xl={3} lg={4} md={6} sm={12} class="mb-4">
				<StyleCard data={style} />
			</Col>
		{/each}
	{/if}
</Row>
<Row>
	<div class="m-auto">
		<Pagination bind:current={page} bind:total={totalPages} />
	</div>
</Row>

<style>
	.screenshot {
		width: 200px;
		height: 75px;
		object-fit: contain;
	}

	a {
		color: inherit !important;
		text-decoration: inherit;
		box-shadow: none;
		transition: box-shadow 0.1s;
	}

	a:hover {
		text-decoration: underline;
	}

</style>