<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	import Styles from '$lib/components/Styles.svelte';
	import type { SortedSearchIndexes } from '$lib/stores';
	import { styleIndex } from '$lib/stores';
	import type { SearchIndex } from '$lib/types';
	import { Query } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Button, Form, FormGroup, Icon, Input, InputGroup } from 'sveltestrap';

	let table = false;

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
			search: '',
			sort: 'weeklyInstalls',
			page: '1',
			table: 'false'
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

			for (const word of search.toLowerCase().split(' ')) {
				if (word.startsWith('#')) {
					categories.push(word.slice(1));
				} else if (word.startsWith('@')) {
					users.push(word.slice(1));
				} else {
					words.push(word);
				}
			}

			let s = words.join(' ');

			return val.filter(
				(el) =>
					(!s || (el.n && el.n.toLowerCase().includes(s))) &&
					(categories.length === 0 || (el.c && categories.includes(el.c.toLowerCase()))) &&
					(users.length === 0 ||
						(el.ai &&
							el.an &&
							(users.includes(el.ai.toString()) || users.includes(el.an.toLowerCase()))))
			);
		} else {
			return val;
		}
	}

	$: updateQuery(search, sort, currentPage, table);

	async function updateQuery(search: string, sort: string, currentPage: number, table: boolean) {
		if (!update) return;

		if (
			search === query.vars.search &&
			sort === query.vars.sort &&
			currentPage.toString() === query.vars.page &&
			table.toString() === query.vars.table
		)
			return;

		query.vars.search = search;
		query.vars.sort = sort;
		query.vars.page = currentPage.toString();
		query.vars.table = table.toString();

		if (browser) {
			update = false;
			await goto('?' + query.getQuery().toString());
			update = true;
		}
	}

	$: $page && onRouteChanged();
	function onRouteChanged() {
		if (!update || !window.location.pathname.startsWith('/browse/styles')) return;
		query.setQuery(window.location.search);

		update = false;
		input.search = query.vars.search;
		input.sort = query.vars.sort;
		onSearch();
		table = query.vars.table === 'true'
		currentPage = parseInt(query.vars.page);

		data = filterStyles($styleIndex.data, search, sort);

		update = true;
	}

	function onSearch(e?: Event) {
		if (search !== input.search) search = input.search;
		if (sort !== input.sort) sort = input.sort;
		if (e) e.preventDefault();
	}

</script>

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
			<Button color="dark" on:click={() => table = !table}>
				<Icon name={table ? "grid" : "table"} />
			</Button>
			<Button type="submit" color="dark">Search</Button>
		</InputGroup>
	</FormGroup>
</Form>
<Styles {table} on:sort={e => { input.sort = e.detail; sort = e.detail }} bind:page={currentPage} {data} />