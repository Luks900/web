<script lang="ts">
	import type { CategoriesIndexItem, SearchIndex } from '$lib/types';
	import { Col, Row } from 'sveltestrap';
	import StyleCard from './StyleCard.svelte';

	export let data: CategoriesIndexItem;
	let styles: SearchIndex;

	$: styles = data.s.slice(0, 4);

</script>

<div class="d-flex justify-content-between align-items-center mb-2">
	<h2>#{data.n}</h2>
	<small>({data.s.length})</small>
</div>
<Row>
	{#each styles as style}
		<Col xl={3} lg={4} md={6} sm={12} class="mb-4">
			<StyleCard data={style} />
		</Col>
	{/each}
	<Col xs={12}>
		<a class="btn btn-outline-secondary w-100" href={'/browse/styles/?search=' + encodeURIComponent('#' + data.n)}>
            More styles...
        </a>
	</Col>
</Row>
