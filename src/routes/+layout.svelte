<script>
    import '$lib/scss/global.scss';
    import Nav from "$components/Nav.svelte";
</script>

<svelte:head>
    <title>Reflection Prototype - Danny Lee</title>    
</svelte:head>

<main>
    <Nav />
    <slot/>
</main>