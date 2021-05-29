<script lang="ts">
	import type { Style } from '$lib/types';
	import { getScreenshot } from '$lib/utils';
	import { Carousel, CarouselControl, CarouselIndicators, CarouselItem } from 'sveltestrap';

	let activeIndex = 0;

	export let data: Style;
	$: screenshots = getScreenshots(data);

	function getScreenshots(data: Style) {
		let screenshots = [];
		if (!data || !data.screenshots) return screenshots;

		let main = data.screenshots.main;
		if (main) {
			screenshots.push(getScreenshot(main));
		}
		if (data.screenshots.additional) {
			for (const ss of data.screenshots.additional) {
				screenshots.push(getScreenshot(ss));
			}
		}

		return screenshots;
	}

</script>

{#if screenshots && screenshots.length > 1}
	<Carousel items={screenshots} bind:activeIndex>
		<CarouselIndicators bind:activeIndex items={screenshots} />

		<div class="carousel-inner">
			{#each screenshots as item, index}
				<CarouselItem bind:activeIndex itemIndex={index}>
					<img src={item} class="d-block w-100 rounded" alt={`Screenshot ${index + 1}`} />
				</CarouselItem>
			{/each}
		</div>

		<CarouselControl direction="prev" bind:activeIndex items={screenshots} />
		<CarouselControl direction="next" bind:activeIndex items={screenshots} />
	</Carousel>
{:else if screenshots.length === 1}
	<img src={screenshots[0]} class="d-block w-100 rounded" alt="Screenshot" />
{/if}
