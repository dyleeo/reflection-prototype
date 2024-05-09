<script>
    import MirrorApp from '$threeApp/MirrorApp.svelte';
</script>

<style lang="scss">
    section.reflection-page {
        padding: 50px 0;
    
        .reflection-app {
            margin: 0 auto;
            width: 960px;
        }
    }
</style>

<section class="reflection-page">

    <div class="reflection-app">
        <h1>Reflections</h1>
        <MirrorApp />
    </div>

</section>