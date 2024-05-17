import { browser } from '$app/environment';
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector';


const room = new THREE.Group();
// const surfaceFrontBackGeom = new THREE.PlaneGeometry( 100.1, 100.1 );
// const surfaceGeom = new THREE.PlaneGeometry( 100.1, 150.1 );
// const mirrorGeom = new THREE.PlaneGeometry( 100, 150 );

export const createRoom = () => {
    if(!browser) return;
    
    // ##############################
    // # walls & Floor/Ceil (6)
    // ##############################
    
    // Room Diagram 
    // --- Back ---
    // |          |
    // | Left     | Right 
    // |          |
    // -- Front ---

    const floor = createMesh(undefined, {x: -Math.PI / 2 });
    const ceiling = createMesh({ y: 100}, {x: Math.PI / 2 });
    const wallFront = createMesh({z: 75, y: 50}, {y: Math.PI }, true);
    const wallBack = createMesh({z: -75, y: 50}, undefined, true);
    const wallLeft = createMesh({x: -50, y: 50}, {y: Math.PI / 2, z: Math.PI / 2});
    const wallRight = createMesh({x: 50, y: 50}, {y: -Math.PI / 2, z: -Math.PI / 2});
    room.add( wallLeft, wallRight, wallFront, wallBack, ceiling, floor );

    
    // ##############################
    // # Mirrors (3) Back, Front, & Left
    // ##############################

     const mirrorBack = createMesh({z: -74.9, y: 50}, undefined, true, true);
     const mirrorLeft = createMesh({x: -49.9, y: 50}, {y: Math.PI / 2, z:  Math.PI / 2}, false, true); 
     const mirrorRight = createMesh({x: 49.9, y: 50}, {y: -Math.PI / 2, z: -Math.PI / 2}, false, true);
     mirrorBack.visible = mirrorLeft.visible = mirrorRight.visible = false;
     room.add( mirrorBack, mirrorLeft, mirrorRight );


    let roomObj = {
        left: { wall: wallLeft, mirror: mirrorLeft },
        right: { wall: wallRight, mirror: mirrorRight },
        back: { wall: wallBack, mirror: mirrorBack },
        front: {wall: wallFront}
    }

    return {group: room, roomObj };
}

export const createMesh = (pos=undefined, rot=undefined, isFrontBack=false, isMirror=false) => {
    const mirrorGeom = (isFrontBack) ? new THREE.PlaneGeometry( 100, 100 ) : new THREE.PlaneGeometry( 100, 150 );
    const surfaceGeom = (isFrontBack) ? new THREE.PlaneGeometry( 100, 100 ) : new THREE.PlaneGeometry( 100, 150 );
    
    const defaultWallpaperMat = new THREE.MeshPhongMaterial( { color: "#fff" } );
    // const defaultFrontMat = new THREE.MeshPhongMaterial( { color: "#b5e48c" } );
    // const defaulFloorCeilMat = new THREE.MeshPhongMaterial( { color: "#fff" } );
    
    const mirroParams = { 
        clipBias: .003,
        textureWidth: 960 * window.devicePixelRatio,
        textureHeight: 680 * window.devicePixelRatio,
        color: "#c1cbcb"
    }

    let obj = (isMirror) ? new Reflector(mirrorGeom, mirroParams) : new THREE.Mesh( surfaceGeom, defaultWallpaperMat );
    
    if(pos) {
        obj.position.x = (pos.x) ? pos.x : 0;
        obj.position.y = (pos.y) ? pos.y : 0;
        obj.position.z = (pos.z) ? pos.z : 0;
    }    
    if(rot) {
        obj.rotation.x = (rot.x) ? rot.x : 0;
        obj.rotation.y = (rot.y) ? rot.y : 0;
        obj.rotation.z = (rot.z) ? rot.z : 0;
    }  
    return obj;
}

export const createLights = (scene) => {
    const mainLight = new THREE.PointLight( 0xeeeeee, 2.5, 250, 0 );
    mainLight.position.y = 60;
    scene.add(mainLight);
}