<script>
    import Two from "two.js";
	import { onMount } from "svelte";
    import { WallsStore, SceneStore } from '$stores/ReflectionAppStore';
    import { radToDeg, degToRad, mapVal } from '$utils';
    import SceneElements  from './SceneElements.svelte';

    const RATIO = 3/2, ROOM_WIDTH = 320;
    let mouse = new Two.Vector(), isMouseDwn = false, currentObject;
    let SceneEls;
    let currentWall;
    let line0, line1; 
    let twoInst, twoEnv = { controllerEl: undefined, centerX: undefined, centerY: undefined };
    $SceneStore.room = { controller: undefined, width: ROOM_WIDTH, height: ROOM_WIDTH * RATIO, left: undefined, right: undefined, top: undefined, bottom: undefined }
    $SceneStore.user = { controller: undefined, r: 15 };    
    $SceneStore.subject = { controller: undefined, width: 46, height: 45 };    
    $SceneStore.reflectionHandle = { controller: undefined, r: 10,  ang: 0, dragRad: 75 };
    $SceneStore.mirrors = { thickness: 20 }
    
    onMount(() => {
        initTwo();
    });
    
    function initTwo() {
        twoInst = new Two({
            width: twoEnv.controllerEl.clientWidth,
            height: twoEnv.controllerEl.clientHeight,
            autostart: true,
        }).appendTo(twoEnv.controllerEl);
        
        SceneEls.defineBoundingProps(twoInst, twoEnv);
        SceneEls.drawBackground(twoInst, twoEnv);  
        SceneEls.drawBackground(twoInst, twoEnv);
        SceneEls.addUser(twoInst, twoEnv);
        SceneEls.addSubject(twoInst, twoEnv);
        SceneEls.addReflectionHandler(twoInst, twoEnv);
        SceneEls.addMirrorToggles(twoInst, twoEnv);

        initEvents();
    }

    function initEvents() {
        twoEnv.controllerEl.addEventListener('mousemove', moveHandler, false);
        twoEnv.controllerEl.addEventListener('mouseup', upHandler, false);
        $SceneStore.subject.controller._renderer.elem.addEventListener('mousedown', e => downHandler(e, $SceneStore.subject.controller), false);
        // $SceneStore.user.controller._renderer.elem.addEventListener('mousedown', e => downHandler(e, user.controller), false);
        $SceneStore.reflectionHandle.controller._renderer.elem.addEventListener('mousedown', e => downHandler(e, $SceneStore.reflectionHandle.controller), false);
    }

    function downHandler(e, _currentObject) {
        isMouseDwn = true;
        currentObject = _currentObject;
        line0?.remove();
        line1?.remove();
    }

    function upHandler(e) {
        isMouseDwn = false;
        currentObject = undefined;
    }

    function moveHandler(e) {
        if(!isMouseDwn) return;
        mouse.set(e.offsetX, e.offsetY);

        if(currentObject && currentObject?.id === "reflectionHandle"){
            const dx = mouse.x - $SceneStore.subject.controller.position.x;
            const dy = mouse.y - $SceneStore.subject.controller.position.y;
            $SceneStore.reflectionHandle.ang = Math.atan2(dy, dx);
            
            currentObject.position.x = $SceneStore.subject.controller.position.x + Math.cos($SceneStore.reflectionHandle.ang) * $SceneStore.reflectionHandle.dragRad;
            currentObject.position.y = $SceneStore.subject.controller.position.y + Math.sin($SceneStore.reflectionHandle.ang) * $SceneStore.reflectionHandle.dragRad;

            drawReflectionPath();
        } else {
            //move subject
            currentObject.position.x = mouse.x;
            currentObject.position.y = mouse.y;

            const mappedX = mapVal(mouse.x, 180, 427, -31, 35)
            const mappedY = mapVal(mouse.y, 112, 493, -60, 60)
            $SceneStore.cube.position.x = mappedX; 
            $SceneStore.cube.position.z = mappedY; //2d -> y = 3d -> z

            // if subject moved, move handle
            $SceneStore.reflectionHandle.controller.position.x = $SceneStore.subject.controller.position.x - $SceneStore.reflectionHandle.dragRad;
            $SceneStore.reflectionHandle.controller.position.y = $SceneStore.subject.controller.position.y;
        }        
    }

    function drawReflectionPath() {

        //REMOVE LINES
        line0?.remove();
        line1?.remove();

        // DECLARE PRIMARY ANCHOR POINTS FOR CALCULATIONS
        const anchorPoint = $SceneStore.subject.controller.position;
        const handlePoint = new Two.Vector( $SceneStore.reflectionHandle.controller.position.x, $SceneStore.reflectionHandle.controller.position.y );

        // CALCULATION HANDLE & FIRST LINE
        // calculate intersect point of the ray and wall using known anchor and handle points
        const line0Intersect = findIntersection(anchorPoint, handlePoint);
        line0 = twoInst.makeLine( anchorPoint.x, anchorPoint.y, line0Intersect.x, line0Intersect.y);
        line0.stroke='#d62828';
        line0.linewidth = 3;
        $SceneStore.lineGroup.add(line0);

        // handle for non-mirrored wall
        if(currentWall === "bottom") return;

        // second ray
        const length = 500;
        const angLine0 = Two.Vector.angleBetween(anchorPoint, line0Intersect);
        const oppositeAng = degToRad( (currentWall === "top" || currentWall === "bottom") ? 180 : 360 ) - angLine0;
        const x2 = line0Intersect.x + length * Math.cos(oppositeAng);
        const y2 = line0Intersect.y + length * Math.sin(oppositeAng);
        line1 = twoInst.makeLine(line0Intersect.x, line0Intersect.y, x2, y2);
        line1.stroke='#d62828';
        line1.linewidth = 3;
        $SceneStore.lineGroup.add(line1);
    }
    
    function findIntersection(p0, p1) {
        const angInDeg = radToDeg($SceneStore.reflectionHandle.ang);
        let t, x, y;

        const tl = radToDeg(Two.Vector.angleBetween(new Two.Vector( $SceneStore.room.left, $SceneStore.room.top), $SceneStore.subject.controller.position));
        const tr = radToDeg(Two.Vector.angleBetween(new Two.Vector( $SceneStore.room.right, $SceneStore.room.top), $SceneStore.subject.controller.position));
        const bl = radToDeg(Two.Vector.angleBetween(new Two.Vector( $SceneStore.room.left, $SceneStore.room.bottom), $SceneStore.subject.controller.position));
        const br = radToDeg(Two.Vector.angleBetween(new Two.Vector( $SceneStore.room.right, $SceneStore.room.bottom), $SceneStore.subject.controller.position));
        
        if( (angInDeg <= tl && angInDeg >= -180) || (angInDeg <= 180 && angInDeg) >= bl)
            currentWall = "left";
        else if( angInDeg <= 0 && angInDeg >= tr || angInDeg > 0 && angInDeg <= br)
            currentWall = "right";
        else if( angInDeg > tl && angInDeg < -90 || angInDeg >= -90 && angInDeg < tr)
            currentWall = "top";
        else
            currentWall = "bottom";
    
        if(currentWall === "top" || currentWall === "bottom") {
            t = ($SceneStore.room[currentWall] - p0.y) / (p1.y - p0.y);
            x = p0.x + t * (p1.x - p0.x)
            return new Two.Vector(x, $SceneStore.room[currentWall]);
        }else{
            t = ($SceneStore.room[currentWall] - p0.x) / (p1.x - p0.x);
            y = p0.y + t * (p1.y - p0.y);
            return new Two.Vector($SceneStore.room[currentWall], y);
        }
    }
</script>

<style lang="scss">
    .controller-app {
        display: flex;
        width: 100%;
        background-color: #22577A;
    }
</style>

<SceneElements bind:this={SceneEls} />
<div class="controller-app" bind:this={twoEnv.controllerEl}></div>