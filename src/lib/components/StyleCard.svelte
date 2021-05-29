<script lang="ts">
	import type { SearchIndexItem } from "$lib/types";
	import { getScreenshot } from "$lib/utils";
	import { CardBody,CardText,Icon } from 'sveltestrap';

	export let data: SearchIndexItem;
</script>
<a class="h-100 w-100 card hover-shadow overflow-hidden" href={'/style/' + data.i}>
	{#if data.sn}
		<img class="img" src={getScreenshot({name: data.sn, archived: data.sa})} alt="Screenshot" />
	{:else}
		<div class="img"></div>
	{/if}
	<CardBody>
		<h5 class="card-title">{data.n}</h5>
		{#if data.ai && data.an}
			<CardText><small>By <a href={'/browse/styles/?search=' + encodeURIComponent("@"+data.ai)}>@{data.an} ({data.ai})</a></small></CardText>
		{/if}
	</CardBody>
	<div class="card-footer">
		<div class="d-flex justify-content-between overflow-hidden">
			<div class="footer-category text-capitalize"><Icon class="me-1" name="hash" /> {data.c}</div>
			<div><Icon class="me-1" name="download"/> {data.w}</div>
			<div><Icon class="me-1" name="calendar"/> {new Date(data.u * 1000).toLocaleDateString()}</div>
		</div>
	</div>
</a>
<style>
	.card-footer > div {
		margin: 0 -10px;
	}

	.card-footer > div > div {
		white-space: nowrap;
		margin: 0 5px;
	}

	.footer-category {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	img {
		object-fit: cover;
	}

	.img {
		height: 220px;
	}

	a {
		color: inherit;
		text-decoration: inherit;
		box-shadow: none;
		transition: box-shadow 0.1s;
	}

	a:not(.card) {
		text-decoration: underline;
	}

	a.card:hover {
		box-shadow: 2px 2px 20px 5px rgba(0, 0, 0, 0.2);
	}

	/* a.card button {
		z-index: 1;
	}

	a.card.disabled,
	a.card[disabled] {
		pointer-events: none;
		opacity: .8;
	} */
</style>
