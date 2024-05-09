<script>
    import * as THREE from 'three';
    import { gsap } from "gsap/dist/gsap";
	import { onMount } from 'svelte';

    let threeContainerEl;
    let scene, camera, renderer;
    let cube;
    let stageWidth = 960, stageHeight = 680;

    onMount(() => {
        initApp()
    });

    function initApp() {
        setupAppScene();
        addCube();
        animate();
    }

    function setupAppScene() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, stageWidth / stageHeight, .1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(stageWidth, stageHeight);
        threeContainerEl.appendChild(renderer.domElement);
    }

    function addCube(){
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
    }

    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    
</script>

<style lang="scss">
    // .three-container { }
</style>

<div class="three-container" bind:this={threeContainerEl}></div>