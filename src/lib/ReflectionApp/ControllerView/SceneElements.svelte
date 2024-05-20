<script>
    import { WallsStore, SceneStore } from '$stores/ReflectionAppStore';

    export const drawBackground = (twoInst, twoEnv) => {
        $SceneStore.room.controller = twoInst.makeRectangle(twoEnv.centerX, twoEnv.centerY, $SceneStore.room.width, $SceneStore.room.height);
        $SceneStore.room.controller.fill = '#efefef';
        $SceneStore.room.controller.noStroke();
        $SceneStore.room.controller.linewidth='3px';

        //add mask
        const maskRect = twoInst.makeRectangle(twoEnv.centerX, twoEnv.centerY, $SceneStore.room.width, $SceneStore.room.height);
        maskRect.noStroke();

        $SceneStore.lineGroup = twoInst.makeGroup(); //create layer container for lines
        $SceneStore.lineGroup.mask = maskRect;
        twoInst.update();
    }

    export const addUser = (twoInst, twoEnv) => {
        const shape = twoInst.makeCircle(0, 0, $SceneStore.user.r);
        shape.fill = '#80ED99';
        shape.noStroke();

        const vectorMarker = twoInst.makeLine( 0, 0, 0, -$SceneStore.user.r);
        $SceneStore.user.controller = twoInst.makeGroup(shape, vectorMarker);
        $SceneStore.user.controller.id = "user";
        $SceneStore.user.controller.position.set(twoEnv.centerX, $SceneStore.room.bottom);
        $SceneStore.user.controller.rotation = 0;
        twoInst.update();
    }

    export const addSubject = (twoInst, twoEnv) => {
        $SceneStore.subject.controller = twoInst.makeRectangle(twoEnv.centerX, twoEnv.centerY, $SceneStore.subject.width, $SceneStore.subject.height);
        $SceneStore.subject.controller.id = "subject";
        $SceneStore.subject.controller.fill = '#38A3A5';
        $SceneStore.subject.controller.noStroke();
        twoInst.update();
    }

    export const addReflectionHandler = (twoInst, twoEnv) => {
        $SceneStore.reflectionHandle.controller = twoInst.makeCircle($SceneStore.subject.controller.position.x - $SceneStore.reflectionHandle.dragRad, twoEnv.centerY, $SceneStore.reflectionHandle.r);
        $SceneStore.reflectionHandle.controller.id = "reflectionHandle";
        $SceneStore.reflectionHandle.controller.fill = '#57CC99';
        $SceneStore.reflectionHandle.controller.stroke = '#38A3A5';
        $SceneStore.reflectionHandle.controller.linewidth = 3;
        twoInst.update();        
    }

    export const addMask = (twoInst, twoEnv) => {
        const maskRect = twoInst.makeRectangle(twoEnv.centerX, twoEnv.centerY, $SceneStore.room.width, $SceneStore.room.height);
        maskRect.noStroke();
        $SceneStore.lineGroup = twoInst.makeGroup(); //create layer container for lines
        $SceneStore.lineGroup.mask = maskRect;
    }

    export const addMirrorToggles = (twoInst, twoEnv) => {
        $SceneStore.mirrors = {
            left: { controller: undefined, isOn: false, x: $SceneStore.room.left - ($SceneStore.mirrors.thickness / 2), y: $SceneStore.room.top + $SceneStore.room.height / 2, width: $SceneStore.mirrors.thickness, height: $SceneStore.room.height },
            right: { controller: undefined, isOn: false, x: $SceneStore.room.right + ($SceneStore.mirrors.thickness / 2), y: $SceneStore.room.top + $SceneStore.room.height / 2, width: $SceneStore.mirrors.thickness, height: $SceneStore.room.height },
            back: { controller: undefined, isOn: false, x: $SceneStore.room.left + $SceneStore.room.width / 2, y: $SceneStore.room.top - 5, width: $SceneStore.room.width + ($SceneStore.mirrors.thickness * 2), height: $SceneStore.mirrors.thickness }
        }

        for( const placement in $SceneStore.mirrors) {
            const mirror = $SceneStore.mirrors[placement].controller = twoInst.makeRectangle($SceneStore.mirrors[placement].x, $SceneStore.mirrors[placement].y, $SceneStore.mirrors[placement].width, $SceneStore.mirrors[placement].height);
            mirror.fill = '#ccc';
            mirror.noStroke();            
            twoInst.update();

            mirror._renderer.elem.addEventListener('mousedown', e => toggleMirror(e, placement, $SceneStore.mirrors[placement]), false)
            mirror._renderer.elem.addEventListener('mouseover', e => mirrorEventHandler(e, $SceneStore.mirrors[placement], true, $SceneStore.mirrors[placement]), false)
            mirror._renderer.elem.addEventListener('mouseout', e => mirrorEventHandler(e, $SceneStore.mirrors[placement], false), false)
        }
    }

    export const defineBoundingProps = (twoInst, twoEnv) => {
        twoEnv.centerX = twoInst.width / 2;
        twoEnv.centerY = twoInst.height / 2;       
        $SceneStore.room.left = twoEnv.centerX - ($SceneStore.room.width / 2);
        $SceneStore.room.right = twoEnv.centerX + ($SceneStore.room.width / 2);
        $SceneStore.room.top = twoEnv.centerY - ($SceneStore.room.height / 2);
        $SceneStore.room.bottom = twoEnv.centerY + ($SceneStore.room.height / 2);
    }

    function toggleMirror(e, placement, mirrorObj){
        mirrorObj.isOn = (mirrorObj.isOn) ? false : true;
        $WallsStore.roomObj[placement].mirror.visible = mirrorObj.isOn;
        mirrorObj.controller.fill = (mirrorObj.isOn) ? '#00b4d8' : '#ccc';
    }

    function mirrorEventHandler(e, mirrorObj, isMouseOver){
        const mirror = mirrorObj.controller;
        if(isMouseOver)
            mirror.stroke = "#333"
        else
            mirror.noStroke();
    }
</script>