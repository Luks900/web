<script lang="ts">
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import StyleGrid from '$lib/components/StyleGrid.svelte';
	import type { SortedSearchIndexes } from "$lib/stores";
	import { styleIndex } from '$lib/stores';
	import type { SearchIndex } from '$lib/types';
	import { Query } from "$lib/utils";
	import { onMount } from 'svelte';
	import { Button,Container,Form,FormGroup,Input,InputGroup,Spinner } from 'sveltestrap';

	let query: Query;
	let update = false;
	
	let search: string, sort: string, currentPage: number;

	let input = {
		search,
		sort
	};

	onMount(() => {
		update = true;
		query = new Query(window.location.search, {
			search: "",
			sort: "weeklyInstalls",
			page: "1"
		});
		
		onPopState();
	});

	let data: SearchIndex;

	$: data = filterStyles($styleIndex.data, search, sort);

	function filterStyles(d: SortedSearchIndexes, ..._args: any[]) {
		if (!d) return;

		let val = d[sort];

		if (search)
			return val.filter((e: any) => e.n.toLowerCase().includes(search.toLowerCase()));
		else
			return val;
	}

	$: updateQuery(search, sort, currentPage);
	
	function updateQuery(search: string, sort: string, currentPage: number) {
		if (!update) return;
		
		if (search === query.vars.search && sort === query.vars.sort && currentPage.toString() === query.vars.page) return;

		query.vars.search = search;
		query.vars.sort = sort;
		query.vars.page = currentPage.toString();

		if (browser)
			goto("?"+query.getQuery().toString());
	}

	function onPopState() {
		query.setQuery(window.location.search);

		update = false;
		input.search = query.vars.search;
		input.sort = query.vars.sort;
		onSearch();
		currentPage = parseInt(query.vars.page);
		update = true;
	}

	function onSearch(e?: Event) {
		if (search !== input.search)
			search = input.search;
		if (sort !== input.sort)
			sort = input.sort;
		if (e)
			e.preventDefault();
	}
</script>

<svelte:window on:popstate={onPopState} />
{#if $styleIndex.isLoading}
	<div class="d-flex justify-content-center align-items-center h-100">
		<Spinner />
	</div>
{:else if $styleIndex.error}
	Error! {$styleIndex.error}
{:else if $styleIndex.data}
	<Container xxl>
		<Form on:submit={onSearch}>
			<FormGroup>
				<InputGroup>
					<Input bind:value={input.search} type="text" name="search" id="search" placeholder="Search styles..." />
					<select bind:value={input.sort} class="form-select" style="max-width: max-content" aria-label="Sort by">
						<option value="weeklyInstalls">Weekly installs</option>
						<option value="totalInstalls">Total installs</option>
						<option value="rating">Rating</option>
						<option value="updated">Updated</option>
						<option value="created">Created</option>
					</select>
					<Button type="submit">Search</Button>
				</InputGroup>
			</FormGroup>
		</Form>
		<StyleGrid bind:page={currentPage} {data} />
	</Container>
{/if}
