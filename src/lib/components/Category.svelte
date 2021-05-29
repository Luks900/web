<script lang="ts">
    import type { CategoriesIndex, CategoriesIndexItem, SearchIndex, SearchIndexItem } from "$lib/types";
    import { Row,Col,Container } from "sveltestrap";
    import StyleCard from "./StyleCard.svelte";

    export let data: CategoriesIndexItem;
    let styles: SearchIndex;

    $: styles = data.s.slice(0, 4);
</script>

<div class="d-flex justify-content-between">
    <h1>#{data.n}</h1>
    <a href={'/browse/styles/?search=' + encodeURIComponent("#"+data.n)}>More styles...</a>
</div>
<Container>
    <Row>
        {#each styles as style}
        <Col xl="3" lg="4" md="6" sm="12" class="mb-4">
            <StyleCard data={style} />
        </Col>
        {/each}
    </Row>

</Container>