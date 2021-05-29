<script lang="ts">
	import { page } from '$app/stores';
	import StyleScreenshotCarousel from '$lib/components/StyleScreenshotCarousel.svelte';
	import { DATA_PREFIX, USO_PREFIX } from '$lib/constants';
	import type { Style } from '$lib/types';
	import { addTargetBlank,htmlToTemplate } from "$lib/utils";
	import DOMPurify from 'dompurify';
	import linkifyHtml from 'linkifyjs/html.js';
	import { Button,Col,Container,Icon,Row,Spinner } from 'sveltestrap';

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
			<Col xs={12} class="d-flex flex-row-reverse mb-4">
				{#if data.style.css}
					<a href={`${DATA_PREFIX}/usercss/${data.id}.user.css`} target="_blank" class="btn btn-primary ms-2">Install</a>
				{/if}
				<a href={url} target="_blank" class="btn btn-outline-secondary ms-2">View JSON</a>
				<a href={`${USO_PREFIX}/styles/${data.id}`} target="_blank" class="btn btn-outline-secondary">View on UserStyles.org</a>
			</Col>
			<Col xs={12} lg={7} xl={8} class="order-2 order-lg-1">
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
					<Col xs={3} lg={5}>Rating</Col>
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
					<Col xs={3} lg={5}>Applies to</Col>
					<Col>
						<a href={'/browse/styles?search='+encodeURIComponent("#"+data.info.category)}>{data.info.category}</a>
					</Col>
				</Row>
				{#if data.info.author}
					<Row>
						<Col xs={3} lg={5}>Author</Col>
						<Col>
							<a href={'/browse/styles/?search=' + encodeURIComponent("@"+data.info.author.id)}>{data.info.author.name} ({data.info.author.id})</a>
						</Col>
					</Row>
				{/if}
				<Row>
					<Col xs={3} lg={5}>License</Col>
					<Col>
						{#if data.info.license !== "NO-REDISTRIBUTION"}
							<a href={"https://spdx.org/licenses/" + data.info.license} target="_blank">{data.info.license}</a>
						{:else}
							{data.info.license}
						{/if}
					</Col>
				</Row>
				<Row>
					<Col xs={3} lg={5}>Updated at</Col>
					<Col>{(new Date(data.info.updatedAt)).toLocaleString()}</Col>
				</Row>
				<Row>
					<Col xs={3} lg={5}>Created at</Col>
					<Col>{(new Date(data.info.createdAt)).toLocaleString()}</Col>
				</Row>
				<h3 class="mt-2">Stats</h3>
				<Row>
					<Col xs={3} lg={5}>Installs this week</Col>
					<Col>{data.stats.installs.weekly}</Col>
				</Row>
				<Row>
					<Col xs={3} lg={5}>Total installs</Col>
					<Col>{data.stats.installs.total}</Col>
				</Row>
			</Col>
		</Row>
	{:catch error}
		{error}
	{/await}
</Container>
