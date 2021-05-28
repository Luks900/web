<script lang="ts">
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { Collapse,Nav,Navbar,NavbarBrand,NavbarToggler,NavItem,NavLink } from 'sveltestrap';

	let isOpen = false;

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}
</script>
<Navbar dark color="dark" class="mb-4" expand="md">
	<NavbarBrand href="/">UserStyles.org Archive</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse class="justify-content-end" {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav navbar>
			<NavItem>
				<NavLink href="/browse/categories">Categories</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/browse/styles">Styles</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="https://github.com/33kk/uso-archive" target="_blank">GitHub</NavLink>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>
<slot></slot>
