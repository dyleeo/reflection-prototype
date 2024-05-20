<script>
	import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import { WallsStore, SceneStore } from '$stores/ReflectionAppStore';
    import { gsap } from 'gsap/dist/gsap';

    // Low polly bear Model 
    //  CGTrader - Credit to: shkaf923149
    // (https://www.cgtrader.com/free-3d-print-models/miniatures/figurines/bear-low-poly-f7d1eeb7-d779-4fcf-ae9d-019dbd935964)

    import { 
        createRoom, 
        createLights,
    } from '$reflectionApp/room';

    let threeContainerEl;
    let scene, camera, renderer;
    let cube;
    let stageWidth = 600, stageHeight = 600;
    const loader = new OBJLoader();

    onMount(() => {
        loadModel();
        initApp()
    });

    async function loadModel() { }

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

        // add lights
        createLights(scene);

        // creat room walls and environment
        const room = createRoom();
        scene.add(room.group);
        $WallsStore = room;
    }

    const toggleMirror = (wall) => {
        $WallsStore.roomObj[wall].mirror.visible = ($WallsStore.roomObj[wall].mirror.visible) ? false : true;
    }
    
    function addCube(){
        const geometry = new THREE.BoxGeometry( 15, 15, 15 );
        const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        cube = new THREE.Mesh( geometry, material );
        cube.position.set(0, 20, -10); //z: -60 to 60, default -10
        scene.add(cube);
        $SceneStore.cube = cube;
    }

    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        // $SceneStore.mirror.cube.rotation.x += 0.01;
        // $SceneStore.mirror.cube.rotation.y += 0.01;
    }
    
</script>

<div class="three-container" bind:this={threeContainerEl}></div>