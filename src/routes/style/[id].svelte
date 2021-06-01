<script lang="ts">
	import { page } from '$app/stores';
	import StyleScreenshotCarousel from '$lib/components/StyleScreenshotCarousel.svelte';
	import { DATA_PREFIX, USO_PREFIX } from '$lib/constants';
	import { createAwaiter } from '$lib/stores';
	import type { Style } from '$lib/types';
	import { addTargetBlank, htmlToTemplate } from '$lib/utils';
	import DOMPurify from 'dompurify';
	import linkifyHtml from 'linkifyjs/html.js';
	import { Col, Container, Icon, Row, Spinner } from 'sveltestrap';

	let id: string, url: string, name: string, promise: Promise<Style>, awaiter;

	$: id = $page.params.id;
	$: url = `${DATA_PREFIX}/styles/${id}.json`;
	$: promise = fetch(url).then((r) => r.json());
	$: awaiter = createAwaiter(promise);
	$: name = $awaiter.data?.info?.name || "";

	function trim(str: string, char: string): string {
		return str.slice(
			str[0] === char ? 1 : 0,
			str[str.length] === char ? str.length - 1 : str.length
		);
	}

	function createUrl(
		category?: string,
		search?: string,
		style?: string,
		user?: string,
		page?: string
	) {
		let params = new URLSearchParams();
		if (style) return `/style/${style}`;

		if (page) params.set('page', page);

		if (category) search = `#${category} ${search}`;

		if (user) search = `@${user} ${search}`;

		return '/browse/styles?' + params.toString();
	}

	function convertUsoUrl(url: string) {
		const parsedUrl = new URL(url);
		const path = trim(parsedUrl.pathname, '/').split('/');
		const query = parsedUrl.search ? new URLSearchParams(trim(parsedUrl.search, '?')) : null;
		let page: string;
		let search: string;

		if (query) {
			page = query.get('page');
		}
		if (query) {
			search = query.get('search_terms');
		}
		if (path[0] === 'styles' && path[1] === 'browse') {
			const category = path[2];
			return createUrl(category, search, null, null, page);
		} else if (path[0] === 'styles') {
			const style = path[1];
			return createUrl(null, null, style, null, null);
		} else if (path[0] === 'users') {
			const user = path[1];
			return createUrl(null, search, null, user, page);
		} else if (path[0] === 'style_screenshots') {
			return `${DATA_PREFIX}/screenshots/${path[1]}`;
		}
	}

	function replaceUrls(str: string): string {
		const regex = /https?:\/\/userstyles\.org\/[^\s"]+/;
		let m;
		let i = 0;
		while ((m = regex.exec(str)) !== null && i < 500) {
			str =
				str.slice(0, m.index) +
				(convertUsoUrl(m[0]) || '*uso link*') +
				str.slice(m.index + m[0].length);
			i++;
		}
		return str;
	}

	function processDescription(html: string) {
		let newHtml = replaceUrls(html);
		newHtml = html.replace(/\r?\n/g, '<br>');
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

<svelte:head>
	<title>{name ? name + " - " : ""}UserStyles.org Archive</title>
</svelte:head>
<Container>
	{#if $awaiter && $awaiter.isLoading}
		<div class="d-flex justify-content-center align-items-center h-100">
			<Spinner />
		</div>
	{:else if $awaiter && $awaiter.data}
		<h1 class="mb-4">{$awaiter.data.info.name}</h1>
		<StyleScreenshotCarousel data={$awaiter.data} />
		<Row class="mt-4">
			<Col xs={12} class="d-flex flex-row-reverse gap-2 mb-4">
				{#if $awaiter.data.style.css}
					<a href={`${DATA_PREFIX}/usercss/${$awaiter.data.id}.user.css`} target="_blank" class="btn btn-dark">
						Install with Stylus
					</a>
				{/if}
				<a href={url} target="_blank" class="btn btn-outline-secondary">View JSON</a>
				<a href={`${USO_PREFIX}/styles/${$awaiter.data.id}`} target="_blank" class="btn btn-outline-secondary">
					View on UserStyles.org
				</a>
			</Col>
			<Col xs={12} lg={7} xl={8} class="order-2 order-lg-1">
				{#if $awaiter.data.info.description}
					<h2>Description</h2>
					<p>{@html processDescription($awaiter.data.info.description)}</p>
				{/if}
				{#if $awaiter.data.info.additionalInfo}
					<h2>Additional info</h2>
					<p>{@html processDescription($awaiter.data.info.additionalInfo)}</p>
				{/if}
			</Col>
			<Col class="order-1 mb-3">
				<h2>Details</h2>
				<Row>
					<Col xs={3} lg={5}>Rating</Col>
					<Col>
						{#if !$awaiter.data.stats.rating}
							<Icon name="dash-circle" />
						{:else if $awaiter.data.stats.rating < 1.5}
							<Icon name="hand-thumbs-down" /> {$awaiter.data.stats.rating}
						{:else if $awaiter.data.stats.rating < 2.5}
							<Icon name="dash-circle" /> {$awaiter.data.stats.rating}
						{:else}
							<Icon name="hand-thumbs-up" /> {$awaiter.data.stats.rating}
						{/if}
					</Col>
				</Row>
				<Row>
					<Col xs={3} lg={5}>Applies to</Col>
					<Col>
						<a href={'/browse/styles?search=' + encodeURIComponent('#' + $awaiter.data.info.category)}>
							{$awaiter.data.info.category}
						</a>
					</Col>
				</Row>
				{#if $awaiter.data.info.author}
					<Row>
						<Col xs={3} lg={5}>Author</Col>
						<Col>
							<a href={'/browse/styles/?search=' + encodeURIComponent('@' + $awaiter.data.info.author.id)}>
								{$awaiter.data.info.author.name} ({$awaiter.data.info.author.id})
							</a>
						</Col>
					</Row>
				{/if}
				<Row>
					<Col xs={3} lg={5}>License</Col>
					<Col>
						{#if $awaiter.data.info.license !== 'NO-REDISTRIBUTION'}
							<a href={'https://spdx.org/licenses/' + $awaiter.data.info.license} target="_blank">
								{$awaiter.data.info.license}
							</a>
						{:else}
							{$awaiter.data.info.license}
						{/if}
					</Col>
				</Row>
				<Row>
					<Col xs={3} lg={5}>Updated at</Col>
					<Col>{new Date($awaiter.data.info.updatedAt).toLocaleString()}</Col>
				</Row>
				<Row>
					<Col xs={3} lg={5}>Created at</Col>
					<Col>{new Date($awaiter.data.info.createdAt).toLocaleString()}</Col>
				</Row>
				<h2 class="mt-2">Stats</h2>
				<Row>
					<Col xs={3} lg={5}>Installs this week</Col>
					<Col>{$awaiter.data.stats.installs.weekly}</Col>
				</Row>
				<Row>
					<Col xs={3} lg={5}>Total installs</Col>
					<Col>{$awaiter.data.stats.installs.total}</Col>
				</Row>
			</Col>
		</Row>
	{:else if $awaiter && $awaiter.error}
		{$awaiter.error}
	{/if}
</Container>
