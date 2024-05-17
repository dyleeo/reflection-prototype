<script>
    import MirrorApp from '$threeApp/MirrorApp.svelte';
    import ControllerApp from '$threeApp/ControllerApp.svelte';
</script>

<style lang="scss">
    section.reflection-page {
        padding: 50px 0;
    
        .reflection-app {
            margin: 0 auto;
            width: 1200px;
            border: 1px solid red;

            .interactioon-container{
                border: 1px solid green;
                display: flex;
                gap: 10px;
            }

            
        }
    }
</style>

<section class="reflection-page">

    <div class="reflection-app">
        <h1>Reflections</h1>
        <div class="interactioon-container">
            <MirrorApp />
            <ControllerApp />
        </div>
        
    </div>

</section>