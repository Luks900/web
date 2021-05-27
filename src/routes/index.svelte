<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button,Container,Form,FormGroup,Input,InputGroup } from 'sveltestrap';

	let search = ""; 
	let sort = "weeklyInstalls";

	function onSearch(e: Event) {
		const qs = new URLSearchParams();
		if (search)
			qs.set("search", search)
		if (sort !== "weeklyInstalls")
			qs.set("sort", sort);
		goto("/browse/styles?" + qs.toString());
		e.preventDefault();
	}
</script>

<Container>
	<div class="mb-5">
		<h1 class="text-center mb-3">Search</h1>
		<Form on:submit={onSearch}>
			<FormGroup>
				<InputGroup>
					<Input bind:value={search} type="text" name="search" id="search" placeholder="Search styles..." />
					<select bind:value={sort} class="form-select" style="max-width: max-content" aria-label="Sort by">
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
	</div>
	<div class="mb-5">
		<h1 class="text-center">Stylus</h1>
	</div>
</Container>
<!-- Search -->
<!-- Most popular (week) styles -->
<!-- About -->
<!-- Stylus -->
<!-- UserStyles.world -->
