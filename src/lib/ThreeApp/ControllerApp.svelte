<script>
    import Two from "two.js";
    import { WallsStore } from '$stores/ThreeAppStore';
	import { onMount } from "svelte";
    import { MathUtils } from "three";


    const RATIO = 3/2;
    const ROOM_WIDTH = 320;

    let twoInst;
    let mouse = new Two.Vector(), isMouseDwn = false;
    let currentObject;


    let twoEnv = { controllerEl: undefined, centerX: undefined, centerY: undefined };
    let room = { controller: undefined, width: ROOM_WIDTH, height: ROOM_WIDTH * RATIO, left: undefined, right: undefined, top: undefined, bottom: undefined }

    let user = { controller: undefined, r: 15 };    
    let subject = { controller: undefined, width: 46, height: 95 };    
    let reflectionHandle = { controller: undefined, r: 10,  ang: 0, dragRad: 75 };
    
    let lineGroup;

    let mirrors = {}
    
    onMount(() => {
        console.log($WallsStore);
        initTwo();
    });
    
    function initTwo() {
        twoInst = new Two({
            width: twoEnv.controllerEl.clientWidth,
            height: twoEnv.controllerEl.clientHeight,
            autostart: true,  //if false, use two.play()
        }).appendTo(twoEnv.controllerEl);

        defineBoundingProps();
        drawBackground();
        addUser();
        addSubject();
        addReflectionHandler();
        addMirrorToggles();
        initEvents();
    }

    function initEvents() {
        twoEnv.controllerEl.addEventListener('mousemove', moveHandler, false);
        twoEnv.controllerEl.addEventListener('mouseup', upHandler, false);
        subject.controller._renderer.elem.addEventListener('mousedown', e => downHandler(e, subject.controller), false);
        // user.controller._renderer.elem.addEventListener('mousedown', e => downHandler(e, user.controller), false);
        reflectionHandle.controller._renderer.elem.addEventListener('mousedown', e => downHandler(e, reflectionHandle.controller), false);
    }

    function defineBoundingProps() {
        twoEnv.centerX = twoInst.width / 2;
        twoEnv.centerY = twoInst.height / 2;       
        room.left = twoEnv.centerX - (room.width / 2);
        room.right = twoEnv.centerX + (room.width / 2);
        room.top = twoEnv.centerY - (room.height / 2);
        room.bottom = twoEnv.centerY + (room.height / 2);
    }

    function drawBackground() {
        room.controller = twoInst.makeRectangle(twoEnv.centerX, twoEnv.centerY, room.width, room.height);
        room.controller.fill = '#efefef';
        // room.controller.stroke = '#777';
        room.controller.noStroke();
        room.controller.linewidth='3px';

        const maskRect = twoInst.makeRectangle(twoEnv.centerX, twoEnv.centerY, room.width, room.height);
        maskRect.noStroke();

        //create layer container for lines
        lineGroup = twoInst.makeGroup();
        lineGroup.mask = maskRect;

        twoInst.update();
    }

    function addUser() {
        const shape = twoInst.makeCircle(0, 0, user.r);
        shape.fill = '#80ED99';
        shape.noStroke();

        const vectorMarker = twoInst.makeLine( 0, 0, 0, -user.r);
        user.controller = twoInst.makeGroup(shape, vectorMarker);
        user.controller.id = "user";
        user.controller.position.set(twoEnv.centerX, room.bottom);
        user.controller.rotation = 0;
        twoInst.update();
    }

    function addSubject() {
        subject.controller = twoInst.makeRectangle(twoEnv.centerX, twoEnv.centerY, subject.width, subject.height);
        subject.controller.id = "subject";
        subject.controller.fill = '#22577A';
        subject.controller.noStroke();
        twoInst.update();
    }

    function addReflectionHandler() {
        reflectionHandle.controller = twoInst.makeCircle(subject.controller.position.x - reflectionHandle.dragRad, twoEnv.centerY, reflectionHandle.r);
        reflectionHandle.controller.id = "reflectionHandle";
        reflectionHandle.controller.fill = '#80ED99';
        reflectionHandle.controller.stroke = '#38A3A5';
        reflectionHandle.controller.linewidth = 3;
        twoInst.update();        
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
        // drawReflectionPath();
    }

    function moveHandler(e) {
        if(!isMouseDwn) return;
        mouse.set(e.offsetX, e.offsetY);

        if(currentObject && currentObject?.id === "reflectionHandle"){
            const dx = mouse.x - subject.controller.position.x;
            const dy = mouse.y - subject.controller.position.y;
            reflectionHandle.ang = Math.atan2(dy, dx);
            
            currentObject.position.x = subject.controller.position.x + Math.cos(reflectionHandle.ang) * reflectionHandle.dragRad;
            currentObject.position.y = subject.controller.position.y + Math.sin(reflectionHandle.ang) * reflectionHandle.dragRad;

            drawReflectionPath();
        } else {
            //move subject
            currentObject.position.x = mouse.x;
            currentObject.position.y = mouse.y;

            // if subject moved, move handle
            reflectionHandle.controller.position.x = subject.controller.position.x - reflectionHandle.dragRad;
            reflectionHandle.controller.position.y = subject.controller.position.y;
        }
        
    }

    let line0, line1; 
    
    function drawReflectionPath() {

        //REMOVE LINES
        line0?.remove();
        line1?.remove();

        //DECLARE POINTS TO B USED FOR CALCULATIONS
        const anchorPoint = subject.controller.position;
        const handlePoint = new Two.Vector( reflectionHandle.controller.position.x, reflectionHandle.controller.position.y );

        // CALCULATION HANDLE & FIRST LINE
        // calculate intersect point of the ray and wall using known anchor and handle points
        const line0Intersect = findIntersection(anchorPoint, handlePoint, room);
        line0 = twoInst.makeLine( anchorPoint.x, anchorPoint.y, line0Intersect.x, line0Intersect.y);
        line0.linewidth = 3;
        lineGroup.add(line0);

        //second ray
        const length = 500;
        const angLine0 = Two.Vector.angleBetween(anchorPoint, line0Intersect);
        const oppositeAng = MathUtils.degToRad(360) - angLine0;
        const x2 = line0Intersect.x + length * Math.cos(oppositeAng);
        const y2 = line0Intersect.y + length * Math.sin(oppositeAng);
        line1 = twoInst.makeLine(line0Intersect.x, line0Intersect.y, x2, y2);
        line1.stroke='#f00';
        line1.linewidth = 3;
        lineGroup.add(line1);

    }

    function findIntersection(p0, p1, surface) {
        const angInDeg = MathUtils.radToDeg(reflectionHandle.ang);
        let wall, t, x, y;

        const tl = MathUtils.radToDeg(Two.Vector.angleBetween(new Two.Vector( room.left, room.top), subject.controller.position));
        const tr = MathUtils.radToDeg(Two.Vector.angleBetween(new Two.Vector( room.right, room.top), subject.controller.position));
        const bl = MathUtils.radToDeg(Two.Vector.angleBetween(new Two.Vector( room.left, room.bottom), subject.controller.position));
        const br = MathUtils.radToDeg(Two.Vector.angleBetween(new Two.Vector( room.right, room.bottom), subject.controller.position));

        if( angInDeg <= tl && angInDeg >= -180 || angInDeg <= 180 && angInDeg >= bl)
            wall = "left";
        else if( angInDeg <= 0 && angInDeg >= tr || angInDeg > 0 && angInDeg <= br)
            wall = "right";
        else if( angInDeg > tl && angInDeg < -90 || angInDeg >= -90 && angInDeg < tr)
            wall = "top";
        else
            wall = "bottom";
        

        if(wall === "top" || wall === "bottom") {
            t = (room[wall] - p0.y) / (p1.y - p0.y);
            x = p0.x + t * (p1.x - p0.x)
            return new Two.Vector(x, room[wall]);
        }else{
            t = (room[wall] - p0.x) / (p1.x - p0.x);
            y = p0.y + t * (p1.y - p0.y);
            return new Two.Vector(room[wall], y);
        }
    }

    

    function addMirrorToggles() {
        mirrors = {
            left: { controller: undefined, isOn: false, x: room.left-6, y: room.top + room.height/2, width: 10, height: room.height },
            right: { controller: undefined, isOn: false, x: room.right+6, y: room.top + room.height/2, width: 10, height: room.height },
            back: { controller: undefined, isOn: false, x: room.left + room.width/2, y: room.top - 6, width: room.width + 23, height: 10 }
        }

        for( const placement in mirrors) {
            console.log(room.left);
            const mirror = mirrors[placement].controller = twoInst.makeRectangle(mirrors[placement].x, mirrors[placement].y, mirrors[placement].width, mirrors[placement].height);
            mirror.fill = '#caf0f8';
            mirror.noStroke();
            mirror.opacity = 1;

            // mirror.stroke = '#777';
            // mirror.linewidth='3px';
            
            twoInst.update();
            mirrors[placement].controller._renderer.elem.addEventListener('mousedown', e => toggleMirror(e, placement, mirrors[placement]), false)
            // console.log(mirrors[placement].controller._renderer.elem);
        };
         
    }

    function toggleMirror(e, placement, mirrorObj){
        //sveltekit store call "toggleMirro"
        console.log(placement);
    }
</script>

<style lang="scss">
    .controller-app {
        display: flex;
        width: 100%;
        background-color: #333;
    }
</style>

<div class="controller-app" bind:this={twoEnv.controllerEl}></div>