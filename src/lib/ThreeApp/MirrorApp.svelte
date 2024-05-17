<script>
	import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import { WallsStore } from '$stores/ThreeAppStore';
    import { gsap } from 'gsap/dist/gsap';

    // Low polly bear Model 
    //  CGTrader - Credit to: shkaf923149
    // (https://www.cgtrader.com/free-3d-print-models/miniatures/figurines/bear-low-poly-f7d1eeb7-d779-4fcf-ae9d-019dbd935964)

    import { 
        createRoom, 
        createLights,
    } from '$threeApp/room';

    let threeContainerEl;
    let scene, camera, renderer;
    let cube;
    let stageWidth = 600, stageHeight = 600;
    const loader = new OBJLoader();


    onMount(() => {
        loadModel();
        initApp()
    });

    async function loadModel() {
        
    }

    function initApp() {
        setupAppScene();
        addCube();
        animate();
    }

    function setupAppScene() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, stageWidth / stageHeight, .1, 1000);
        camera.position.set( 0, 50, 140); //max-z 140
        // camera.rotateY(0)

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(stageWidth, stageHeight);
        threeContainerEl.appendChild(renderer.domElement);

        createLights(scene);

        const room = createRoom();
        scene.add( room.group );
        $WallsStore = room;

        toggleMirror("left");
        toggleMirror("right");
        toggleMirror("back");
    }

    
    const toggleMirror = (wall) => {
        if($WallsStore.roomObj[wall].mirror.visible){
            $WallsStore.roomObj[wall].mirror.visible = false;
        } else{
            $WallsStore.roomObj[wall].mirror.visible = true;
        }
    }
    function addCube(){
        const geometry = new THREE.BoxGeometry( 10, 10, 10 );
        const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        cube = new THREE.Mesh( geometry, material );
        cube.position.y = 8;
        cube.position.x = 0;
        cube.position.z = -10;
        scene.add( cube );
    }

    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );

        // if($WallsStore){
        //     $WallsStore.group.rotation.y+=.01
        // }

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    
</script>

<style lang="scss">
    // .three-container {
    //     border: 1px solid blue;
    // }
</style>

<div class="three-container" bind:this={threeContainerEl}></div>