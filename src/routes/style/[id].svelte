<script lang="ts">
	import { page } from '$app/stores';
	import StyleScreenshotCarousel from '$lib/components/StyleScreenshotCarousel.svelte';
	import { DATA_PREFIX } from '$lib/constants';
	import type { Style } from '$lib/types';
	import { addTargetBlank,htmlToTemplate } from "$lib/utils";
	import DOMPurify from 'dompurify';
	import linkifyHtml from 'linkifyjs/html.js';
	import { Col,Container,Icon,Row,Spinner } from 'sveltestrap';

	let id: string, url: string, promise: Promise<Style>;

	$: id = $page.params.id;
	$: url = `${DATA_PREFIX}/styles/${id}.json`;
	$: promise = fetch(url).then((r) => r.json());

	function processModalDescription(html: string) {
		let newHtml = html.replace(/\r?\n/g, '<br>');
		try {
			newHtml = linkifyHtml(newHtml, {
				target: '_blank',
				defaultProtocol: 'https'
			});
		} catch (e) {
			console.error('Linkify failed', e);
		}

		const sanitized = DOMPurify.sanitize(newHtml);
		const template = htmlToTemplate(sanitized);
		addTargetBlank(template);
		return template.innerHTML;
	}
</script>

<Container>
	{#await promise}
		<div class="d-flex justify-content-center align-items-center h-100">
			<Spinner />
		</div>
	{:then data}
		<h1 class="mb-4">{data.info.name}</h1>
		<StyleScreenshotCarousel {data} />
		<Row class="mt-4">
			<Col class="col-12 order-2 order-lg-1 col-lg-7 col-xl-8">
				{#if data.info.description}
					<h3>Description</h3>
					<p>{@html processModalDescription(data.info.description)}</p>
				{/if}
				{#if data.info.additionalInfo}
					<h3>Additional info</h3>
					<p>{@html processModalDescription(data.info.additionalInfo)}</p>
				{/if}
			</Col>
			<Col class="order-1 mb-3">
				<h3>Details</h3>
				<Row>
					<Col class="col-3 col-lg-5">Rating</Col>
					<Col>
					{#if !data.stats.rating}
						<Icon name="dash-circle" />
					{:else if data.stats.rating < 1.5}
						<Icon name="hand-thumbs-down" /> {data.stats.rating}
					{:else if data.stats.rating < 2.5}
						<Icon name="dash-circle" /> {data.stats.rating}
					{:else}
						<Icon name="hand-thumbs-up" /> {data.stats.rating}
					{/if}
					</Col>
				</Row>
				<Row>
					<Col class="col-3 col-lg-5">Applies to</Col>
					<Col>
						<a href={'/browse/styles?search='+encodeURIComponent("#"+data.info.category)}>{data.info.category}</a>
					</Col>
				</Row>
				{#if data.info.author}
					<Row>
						<Col class="col-3 col-lg-5">Author</Col>
						<Col>
							<a href={'/user/' + data.info.author.id}>{data.info.author.name} ({data.info.author.id})</a>
						</Col>
					</Row>
				{/if}
				<Row>
					<Col class="col-3 col-lg-5">License</Col>
					<Col>
						{#if data.info.license !== "NO-REDISTRIBUTION"}
							<a href={"https://spdx.org/licenses/" + data.info.license} target="_blank">{data.info.license}</a>
						{:else}
							{data.info.license}
						{/if}
					</Col>
				</Row>
				<Row>
					<Col class="col-3 col-lg-5">Updated at</Col>
					<Col>{(new Date(data.info.updatedAt)).toLocaleString()}</Col>
				</Row>
				<Row>
					<Col class="col-3 col-lg-5">Created at</Col>
					<Col>{(new Date(data.info.createdAt)).toLocaleString()}</Col>
				</Row>
				<h3 class="mt-2">Stats</h3>
				<Row>
					<Col class="col-3 col-lg-5">Installs this week</Col>
					<Col>{data.stats.installs.weekly}</Col>
				</Row>
				<Row>
					<Col class="col-3 col-lg-5">Total installs</Col>
					<Col>{data.stats.installs.total}</Col>
				</Row>
			</Col>
		</Row>
	{:catch error}
		{JSON.stringify(error)}
	{/await}
</Container>
