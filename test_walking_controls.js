/**
 * MDX Library Mods
 *  A number of modications need to made to the mdx code in order to be
 *  used in the context of gaming. They are listed here in the following format:
 *  <file-path>:<line number>:<reason>
 *  For example:
 *  C:\Users\Ryan\projects\3dmodel\mdx-m3-viewer\src\viewer\handlers\w3x\ 85: prevent sequence (animation) override
 */

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


let usedArrowListener;
function setArrowKeyListener(cam = window.cam, unitInstance = window.unitInstance, walkSpeed = 20) {
    console.log('setting up walking listeners');
    getFirstUnit();

    let isWalking = false;
    let seqWalk;
    let seqStand;
    unitInstance.userSetSequence = true;
    unitInstance.model.sequences.forEach((seq, i) => {
        if (seq.name.match(/walk/i)) {
            seqWalk = i;
        }
        if (seq.name.match(/stand/i) && seqStand === undefined) {
            seqStand = i;
        }
    });

    /*
    getFirstUnit(); setArrowKeyListener(); u = unitInstance;
    */

    const speed = 20;
    const negSpeed = -20;
    window.vecHeap = vec3.create();
    function move(dirX, dirY, moveSpeed, target) {
        // Allow only movement on the XY plane, and scale to moveSpeed.
        vec3.add(target, target,
          vec3.scale(
            vecHeap,
            vec3.normalize(
              vecHeap,
              vec3.set(vecHeap, dirX[0], dirX[1], 0)
            ),
            moveSpeed
          )
        );
        vec3.add(target, target,
          vec3.scale(
            vecHeap,
            vec3.normalize(
              vecHeap,
              vec3.set(vecHeap, dirY[0], dirY[1], 0)
            ),
            moveSpeed
          )
        );
        return target
    }
    function listenForArrow(e) {
        const quatHeap = window.quatHeap || quat.create();

        cam.onrotate = function(theta, phi) {
            quat.rotateZ(quatHeap, unitInstance.localRotation, theta);
            unitInstance.setRotation(quatHeap);
        }

        function stopMoving(e) {
            switch (e.keyCode) {
                case 37: // arrow key left
                    break;
                case 65: // a key
                    break;
                case 38: // arrow key up
                    break;
                case 87: // w key
                    break;
                case 39: // arrow key right
                    break;
                case 68: // d key
                    break; 
                case 40: // arrow key down
                    break;
                case 83: // s key
                    break; 
                default:
                    console.log("stop moving - default returning");
                    return;
            }
            console.log('setting stand sequence (STOP): ', seqStand);
            unitInstance.setSequence(seqStand);
            isWalking = false;
            console.log('cam postion: ', cam.position)
            console.log('cam target: ', cam.target)
            document.removeEventListener('keyup', stopMoving);
        }
        let distanceDelta = vec3.create();
        switch (e.keyCode) {
            case 37: // arrow key left
                move(cam.directionX, [0, 0], negSpeed, distanceDelta);
                cam.move(distanceDelta);
                unitInstance.move(distanceDelta);
                break;
            case 65: // a key
                move(cam.directionX, [0, 0], negSpeed, distanceDelta);
                cam.move(distanceDelta);
                unitInstance.move(distanceDelta);
                break;
            case 38: // arrow key up
                move([0, 0], cam.directionY, speed, distanceDelta);
                cam.move(distanceDelta);
                unitInstance.move(distanceDelta);
                break;
            case 87: // w key
                move([0, 0], cam.directionY, speed, distanceDelta);
                cam.move(distanceDelta);
                unitInstance.move(distanceDelta);
                break;
            case 39: // arrow key right
                move(cam.directionX, [0, 0], speed, distanceDelta);
                cam.move(distanceDelta)
                unitInstance.move(distanceDelta)
                break;
            case 68: // d key
                move(cam.directionX, [0, 0], speed, distanceDelta);
                cam.move(distanceDelta)
                unitInstance.move(distanceDelta)
                break; 
            case 40: // arrow key down
                move([0, 0], cam.directionY, negSpeed, distanceDelta);
                cam.move(distanceDelta);
                unitInstance.move(distanceDelta);
                break;
            case 83: // s key
                move([0, 0], cam.directionY, negSpeed, distanceDelta);
                cam.move(distanceDelta);
                unitInstance.move(distanceDelta);
                break; 
            default:
                console.log("default returning");
                return;
        }
        vec3.set(cam.target, cam.location[0], cam.location[1], 0);
        vec3.set(cam.target, unitInstance.localLocation[0], unitInstance.localLocation[1], 0);
        vec3.set(cam.position, cam.location[0], cam.location[1], cam.position[2]);
        // cam.distance = 410;
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

// window.removeEventListener('keydown', window.usedArrowListener)
