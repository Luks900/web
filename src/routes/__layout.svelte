<script lang="ts">
	import { darkTheme } from '$lib/stores';
	import 'bootstrap-dark-5/dist/css/bootstrap-nightshade.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import { onMount } from 'svelte';
	import { Collapse,Icon,Nav,Navbar,NavbarBrand,NavbarToggler,NavItem,NavLink } from 'sveltestrap';

	let isOpen = false;

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	onMount(darkTheme.sync);
</script>
<Navbar dark color="dark" class="mb-4" expand="md">
	<NavbarBrand href="/">UserStyles.org Archive</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse class="justify-content-end gap-2" {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav navbar>
			<NavItem>
				<NavLink href="/">Home</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/browse/styles">Userstyles</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/browse/categories">Categories</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="https://github.com/33kk/uso-archive" target="_blank">GitHub</NavLink>
			</NavItem>
		</Nav>
		<button class="btn-unstyled text-light" on:click={() => $darkTheme = !$darkTheme}>
			<Icon name={$darkTheme ? "sun-fill" : "moon-fill"} />
		</button>
	</Collapse>
</Navbar>
<slot></slot>
<style>
	.btn-unstyled {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>