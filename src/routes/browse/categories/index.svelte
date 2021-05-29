<script lang="ts">
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import CategoryList from "$lib/components/CategoryList.svelte";
	import type { SortedSearchIndexes } from "$lib/stores";
	import { styleIndex } from '$lib/stores';
	import type { CategoriesIndex } from '$lib/types';
	import { Query } from "$lib/utils";
	import { onMount } from 'svelte';
	import { Button,Container,Form,FormGroup,Input,InputGroup,Spinner } from 'sveltestrap';

	let query: Query;
	let update = false;
	
	let search: string, currentPage: number;

	let input = {
		search
	};

	onMount(() => {
		update = true;
		query = new Query(window.location.search, {
			search: "",
			page: "1"
		});
		
		onRouteChanged();
	});

	let data: CategoriesIndex;

	$: data = filterStyles($styleIndex.data, search);

	function filterStyles(d: SortedSearchIndexes, ..._args: unknown[]) {
		if (!d) return;

		if (search) {
			return d.categories.filter(el => (!search || (el.n && el.n.toLowerCase().includes(search))));
		}
		else {
			return d.categories;
		}
	}

	$: updateQuery(search, currentPage);
	
	async function updateQuery(search: string, currentPage: number) {
		if (!update) return;

		if (search === query.vars.search && currentPage.toString() === query.vars.page) return;

		query.vars.search = search;
		query.vars.page = currentPage.toString();

		if (browser) {
			update = false;
			await goto("?"+query.getQuery().toString());
			update = true;
		}
	}

	$: $page && onRouteChanged();
	function onRouteChanged() {
		if (!update || !window.location.pathname.startsWith("/browse/categories")) return;
		query.setQuery(window.location.search);

		update = false;
		input.search = query.vars.search;
		onSearch();
		currentPage = parseInt(query.vars.page);
		
		data = filterStyles($styleIndex.data, search);

		update = true;
	}

	function onSearch(e?: Event) {
		if (search !== input.search) {
            let s = input.search;
            let indexOfSpace = s.indexOf(" ");
            if (indexOfSpace !== -1)
                s = s.slice(0, indexOfSpace);
            input.search = s;
			search = s;
        }
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
					<Input bind:value={input.search} type="text" name="search" id="search" placeholder="Search categories..." />
					<Button type="submit" color="dark">Search</Button>
				</InputGroup>
			</FormGroup>
		</Form>
		<CategoryList bind:page={currentPage} {data} />
	</Container>
{/if}
