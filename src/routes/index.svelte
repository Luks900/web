<script>
	import { Container } from 'sveltestrap';

</script>

<Container class="text-center">
	<div class="mb-5 d-flex align-items-center hero">
		<div class="mx-auto">
			<h1>UserStyles.org Archive</h1>
			<p>
				USo-Archive is a full mirror of <a href="https://userstyles.org" target="_blank">userstyles.org</a>,
				created after the original website became unusable.
			</p>
			<div class="d-flex justify-content-center gap-3">
				<a class="btn btn-dark" href="/browse/styles">Browse userstyles</a>
				<a class="btn btn-dark" href="/browse/categories">Browse categories</a>
			</div>
		</div>
	</div>
	<div class="mb-5">
		<h2>Stylus</h2>
		<p>
			"Stylus" is a fork of the popular Stylish extension which can be used to restyle the web. The
			objective in creating Stylus was to remove any and all analytics, and return to a more
			user-friendly UI.
		</p>
		<div class="d-flex justify-content-center gap-3">
			<a class="btn btn-dark" href="https://addons.mozilla.org/firefox/addon/styl-us/" target="_blank">
				Firefox
			</a>
			<a class="btn btn-dark" href="https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne" target="_blank">
				Chromium
			</a>
			<a class="btn btn-dark" href="https://github.com/openstyles/stylus/wiki/Opera,-Outdated-Stylus" target="_blank">
				Opera
			</a>
		</div>
	</div>
	<div class="mb-5">
		<h2>UserStyles.world</h2>
		<p>
			A free and open-source, community-driven, modern alternative to <a href="https://userstyles.org" target="_blank">userstyles.org</a>. For the community, by the community.
		</p>
		<div class="d-flex justify-content-center gap-3">
			<a class="btn btn-dark" href="https://userstyles.world/" target="_blank">Homepage</a>
			<a class="btn btn-dark" href="https://userstyles.world/explore" target="_blank">Explore userstyles</a>
		</div>
	</div>
</Container>

<style>
	.hero {
		min-height: 75vh;
	}

</style>
