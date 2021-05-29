<script lang="ts">
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
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
		
		onRouteChanged();
	});

	let data: SearchIndex;

	$: data = filterStyles($styleIndex.data, search, sort);

	function filterStyles(d: SortedSearchIndexes, ..._args: unknown[]) {
		if (!d) return;

		let val: SearchIndex = d[sort];

		if (search) {
			let categories: string[] = [];
			let users: string[] = [];
			let words: string[] = [];
		
			for (const word of search.toLowerCase().split(" ")) {
				if (word.startsWith("#")) {
					categories.push(word.slice(1));
				}
				else if (word.startsWith("@")) {
					users.push(word.slice(1));
				}
				else {
					words.push(word);
				}
			}

			let s = words.join(" ");

			return val.filter(el => 
				(!s || (el.n && el.n.toLowerCase().includes(s))) &&
				(categories.length === 0 || (el.c && categories.includes(el.c.toLowerCase()))) &&
				(users.length === 0 || (el.ai && el.an && (users.includes(el.ai.toString()) || users.includes(el.an.toLowerCase()))))
			);
		}
		else {
			return val;
		}
	}

	$: updateQuery(search, sort, currentPage);
	
	async function updateQuery(search: string, sort: string, currentPage: number) {
		if (!update) return;

		if (search === query.vars.search && sort === query.vars.sort && currentPage.toString() === query.vars.page) return;

		query.vars.search = search;
		query.vars.sort = sort;
		query.vars.page = currentPage.toString();

		if (browser) {
			update = false;
			await goto("?"+query.getQuery().toString());
			update = true;
		}
	}

	$: $page && onRouteChanged();
	function onRouteChanged() {
		if (!update || !window.location.pathname.startsWith("/browse/styles")) return;
		query.setQuery(window.location.search);

		update = false;
		input.search = query.vars.search;
		input.sort = query.vars.sort;
		onSearch();
		currentPage = parseInt(query.vars.page);
		
		data = filterStyles($styleIndex.data, search, sort);

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

{#if $styleIndex.isLoading}
	<div class="d-flex justify-content-center align-items-center h-100">
		<Spinner />
	</div>
{:else if $styleIndex.error}
	<Container>
		<h1>Error</h1>
		{$styleIndex.error}
	</Container>
{:else if $styleIndex.data}
	<Container xxl>
		<Form on:submit={onSearch}>
			<FormGroup>
				<InputGroup>
					<Input bind:value={input.search} type="text" name="search" id="search" placeholder="Search userstyles..." />
					<select bind:value={input.sort} class="form-select" style="max-width: max-content" aria-label="Sort by">
						<option value="weeklyInstalls">Weekly installs</option>
						<option value="totalInstalls">Total installs</option>
						<option value="rating">Rating</option>
						<option value="updated">Updated</option>
						<option value="created">Created</option>
					</select>
					<Button type="submit" color="dark">Search</Button>
				</InputGroup>
			</FormGroup>
		</Form>
		<StyleGrid bind:page={currentPage} {data} />
	</Container>
{/if}
