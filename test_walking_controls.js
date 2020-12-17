/**
 * MDX Library Mods
 *  A number of modications need to made to the mdx code in order to be
 *  used in the context of gaming. They are listed here in the following format:
 *  <file-path>:<line number>:<reason>
 *  For example:
 *  C:\Users\Ryan\projects\3dmodel\mdx-m3-viewer\src\viewer\handlers\w3x\ 85: prevent sequence (animation) override
 */



// window.viewer = viewer;
let unitType = 'Grunt';
function getFirstUnit(opts = { 'comment(s)': unitType ? unitType : 'bandit' }) {
    window.viewer = viewer;
    window.cam = viewer.scenes[0].camera;
    const usedKey = Object.keys(opts)[0];
    const n = window.viewer.units.length;
    for (let i = 0; i < n; i++) {
        const unit = window.viewer.units[i]
        if (unit.row && unit.row[usedKey] === opts[usedKey]) {
            window.unitInstance = unit.instance;
            return;
        }
    }
}
// getFirstUnit();
// window.cam = viewer.scenes[0].camera;

function vec3Diff(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function vec4Diff(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];
}

function vec3Add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vec4Add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
}

function vec3Mul(a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

function vec4Mul(a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2], a[3] * b[3]];
}

function setLocation(cam, unitInstance) {
    const dL = [-288.5068359375, 59.1123046875, 650.3361206054688];
    cam.setLocation(vec3Add(unitInstance.worldLocation, dL));
}
// setLocation();

function setRotation(cam, unitInstance) {
    const dr =  [0.29586392641067505, -0.28571242094039917, -0.729546494781971, -0.4804251044988632];
    cam.setRotation(vec4Add(dr, unitInstance.worldRotation))
}
// setRotation();
let usedArrowListener;
function setArrowKeyListener(cam = window.cam, unitInstance = window.unitInstance, walkSpeed = 20) {
    console.log('setting up walking listeners');
    getFirstUnit();
    const speed = [walkSpeed, walkSpeed, 0];
    const negSpeed = [-walkSpeed, -walkSpeed, 0];
    let isWalking = false;
    let seqWalk;
    let seqStand;
    let lastKeyCode;
    unitInstance.userSetSequence = true;
    unitInstance.model.sequences.forEach((seq, i) => {
        if (seq.name.match(/walk/i)) {
            seqWalk = i;
        }
        if (seq.name.match(/stand/i) && seqStand === undefined) {
            seqStand = i;
        }
    })
    function listenForArrow(e) {
        function stopMoving(e) {
            // if (e.keyCode !== lastKeyCode) {
            if (e.keyCode < 37 || e.keyCode > 40) {
                return;
            }
            console.log('setting stand sequence (STOP): ', seqStand);
            unitInstance.setSequence(seqStand);
            isWalking = false;
            document.removeEventListener('keyup', stopMoving);
        }
        switch (e.keyCode) {
            case 37: 
                cam.move(vec3Mul(cam.directionX, negSpeed));
                unitInstance.move(vec3Mul(cam.directionX, negSpeed));
                break; 
            case 38: 
                cam.move(vec3Mul(cam.directionY, speed));
                unitInstance.move(vec3Mul(cam.directionY, speed));
                break; 
            case 39: 
                cam.move(vec3Mul(cam.directionX, speed));
                unitInstance.move(vec3Mul(cam.directionX, speed));
                break; 
            case 40: 
                cam.move(vec3Mul(cam.directionY, negSpeed));
                unitInstance.move(vec3Mul(cam.directionY, negSpeed));
                break;
            default:
                console.log("default returning");
                return;
        }
        lastKeyCode = e.keyCode;

        if (!isWalking) {
            console.log('setting walk sequence: ', seqWalk);
            unitInstance.setSequenceLoopMode(2);
            // unitInstance.setSequenceLoopMode(0);
            unitInstance.setSequence(seqWalk);
            document.addEventListener('keyup', stopMoving);
            isWalking = true;
            unitInstance.isWalking = isWalking;
        }
    }
    document.addEventListener('keydown', listenForArrow);
    window.listenForArrow = listenForArrow;
}
// setArrowKeyListener();

// setSequence(e){
//     let t=this.model.sequences;
//     return this.sequence=e,e<0||e>t.length-1? (this.sequence=-1,this.frame=0,this.allowParticleSpawn=!1):this.frame=t[e].interval[0],this.resetEventEmitters(),this.forced=!0,this
// }
// window.removeEventListener('keydown', window.usedArrowListener)

window.texture = viewer.load('textures/shockwave_ice1.blp');
window.spherePrimitive = ModelViewer.utils.mdx.primitives.createSphere(20,20,20);
(async()=> {
window.sphereModel = await ModelViewer.utils.mdx.createPrimitive(viewer, spherePrimitive , { texture });
window.sphereInstance = sphereModel .addInstance();
window.Unit = Object.getPrototypeOf(viewer.units[0]).constructor;
window.testUnitInfo = { "location":[0,0,100],"rotation":[0,0,0,1],"player":0,"scale":[1,1,1] };
viewer.units.push(new Unit(viewer, sphereModel , undefined, testUnitInfo ));
viewer.scenes[0].addInstance(sphereInstance)
})();