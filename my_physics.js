window.getEulerAngles = function getEulerAngles(q) {
  function rad2Deg(rad) { return rad * (180 / Math.PI); }
  q = q || viewer.worldScene.camera.rotation;
  const [q0, q1, q2, q3] = q;
  const phi = Math.atan2(2*(q0*q1 + q2*q3), 1 - 2*(q1**2 + q2**2));
  const theta = Math.asin(2*(q0*q2 - q3*q1));
  const psi = Math.atan2(2*(q0*q3 + q1*q2), 1 - 2*(q2**2 + q3**2));
  console.log({ phi: rad2Deg(phi), theta: rad2Deg(theta), psi: rad2Deg(psi) });
  return [phi, theta, psi];
};
window.getQuat = function getQuat(eulerAngles) {
  const [phi, theta, psi] = eulerAngles;
  const { cos, sin } = Math;
  return [
      cos(phi/2)*cos(theta/2)*cos(psi/2) + sin(phi/2)*sin(theta/2)*sin(psi/2),
      sin(phi/2)*cos(theta/2)*cos(psi/2) - cos(phi/2)*sin(theta/2)*sin(psi/2),
      cos(phi/2)*sin(theta/2)*cos(psi/2) + sin(phi/2)*cos(theta/2)*sin(psi/2),
      cos(phi/2)*cos(theta/2)*sin(psi/2) - sin(phi/2)*sin(theta/2)*cos(psi/2)
  ];
};
window.quatMul = function quatMul(q1, q2) {a
  const [w1, x1, y1, z1] = q1;
  const [w2, x2, y2, z2] = q2;
  return [
      (-x1*x2) - (y1*y2) - (z1*z2) + (w1*w2),
      (x1*w2)  + (y1*z2) - (z1*y2) + (w1*x2),
      (-x1*z2) + (y1*w2) + (z1*x2) + (w1*y2),
      (x1*y2)  - (y1*x2) + (z1*w2) + (w1*z2),
  ];
};

class Unit {
  constructor(map, model, row, unit) {
    let instance = model.addInstance();
    instance.move(unit.location);
    instance.rotateLocal(glMatrix.quat.setAxisAngle(glMatrix.quat.create(), ModelViewer.common.glMatrixAddon.VEC3_UNIT_Z, unit.angle));
    instance.scale(unit.scale);
    instance.setTeamColor(unit.player);
    instance.setScene(map.worldScene);
    if (row) {
      heapZ[2] = row.moveHeight;
      instance.move(heapZ);
      instance.setVertexColor([row.red / 255, row.green / 255, row.blue / 255, 1]);
      instance.uniformScale(row.modelScale);
    }
    this.instance = instance;
    this.row = row;
  }
}

class Clock {
  /** autoStart: boolean;
	 * If set, starts the clock automatically when the first update is called.
	 * @default true
	 */
	constructor( autoStart ) {
    this.autoStart = ( autoStart !== undefined ) ? autoStart : true;
    /** startTime: number;
     * When the clock is running, It holds the starttime of the clock.
     * This counted from the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
     * @default 0
    */
    this.startTime = 0;
    /** oldTime: number
	  * When the clock is running, It holds the previous time from a update.
	  * This counted from the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
	  * @default 0
	  */
    this.oldTime = 0;
    /** elapsedTime: number;
     * When the clock is running, It holds the time elapsed between the start of the clock to the previous update.
     * This parameter is in seconds of three decimal places.
     * @default 0
    */
		this.elapsedTime = 0;
		this.running = false;
	}

	start() {
    this.startTime = ( typeof performance === 'undefined' ? Date : performance ).now(); // see #10732
		this.oldTime = this.startTime;
		this.elapsedTime = 0;
		this.running = true;
	}

	stop() {
		this.getElapsedTime();
		this.running = false;
		this.autoStart = false;
	}
	/**
	 * Get the seconds passed since the clock started.
	*/
	getElapsedTime() {
		this.getDelta();
		return this.elapsedTime;
	}

  /**
	 * Get the seconds passed since the last call to this method.
	*/
	getDelta() {
		let diff = 0;
		if ( this.autoStart && ! this.running ) {
			this.start();
			return 0;
		}
		if ( this.running ) {
			const newTime = ( typeof performance === 'undefined' ? Date : performance ).now();
			diff = ( newTime - this.oldTime ) / 1000;
			this.oldTime = newTime;
			this.elapsedTime += diff;
		}
		return diff;
	}
}

// variable delcaration
let physicsWorld;
let clock;
// the rigidBodies array will serve as a collection for all 3d rendered objects that have an associated physics object and that should be updated at each render loop.
let rigidBodies = [];
// tmpTrans is for temporary ammo.js transform object that we will be reusing.
let tmpTrans;
// this defines the collision groups we’ll be using
let colGroupPlane = 1, colGroupBlackBall = 2, colGroupGreenBall = 4;
const DISABLE_DEACTIVATION = 4;
function setupPhysicsWorld() {
  let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
  dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
  overlappingPairCache    = new Ammo.btDbvtBroadphase(),
  solver                  = new Ammo.btSequentialImpulseConstraintSolver();

  physicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

  // I moved clock initialization to here
  clock = new Clock();
}

/* combining code from client/map/index.js and ammojs tutorial */
function renderFrame() {
  //* client/map/index.js
  meter.tick();
  cellsElement.textContent = `Cells: ${viewer.worldScene.visibleCells}`;
  instancesElement.textContent = `Instances: ${viewer.worldScene.visibleInstances}`;
  particlesElement.textContent = `Particles: ${viewer.worldScene.updatedParticles}`;
  // *

  let deltaTime = clock.getDelta();
  //new line of code
  updatePhysics( deltaTime );
  viewer.updateAndRender();
  requestAnimationFrame( renderFrame );
}


function createBlock() {
  let pos = { x: 0, y: 0, z: 0 };
  // let scale = { x: window.mapWidth, y: window.mapDepth, z: 10 };
  // need to invert y and z axis
  let scale = { x: window.mapWidth, y: window.mapDepth, z: 1 };
  console.log('map/block scale: ', scale)
  console.log('created at origin: ', pos)
  let quat = { x: 0, y: 0, z: 0, w: 1 };
  let mass = 0;

  //mdx-m3-viewer section
  /* dont need to do anything, wc3 map is already loaded */


  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.z, pos.y ) );
  transform.setRotation( new Ammo.btQuaternion( quat.x, quat.z, quat.y, quat.w ) );
  let motionState = new Ammo.btDefaultMotionState( transform );

  let colShape = new Ammo.btBoxShape(new Ammo.btVector3( scale.x , scale.z , scale.y  ) );
  colShape.setMargin( 0.05 );

  let localInertia = new Ammo.btVector3( 0, 0, 0 );
  colShape.calculateLocalInertia( mass, localInertia );

  let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
  let body = new Ammo.btRigidBody( rbInfo );
  const friction = 1;
  body.setFriction(friction);

  // body belongs to group 'colGroupPlane' and collides with 'colGroupBlackBall'
  // physicsWorld.addRigidBody( body, colGroupPlane, colGroupBlackBall );
  physicsWorld.addRigidBody( body );
  // body.setActivationState(DISABLE_DEACTIVATION); // freezes object
}


async function createBall() {
  let pos = {x: -100, y: 0, z: 100};
  let radius = 20;
  // let radius = 2;
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let mass = 1;

  //mdx-m3-viewer Section
  window.texture = viewer.load('textures/shockwave_ice1.blp');
  window.spherePrimitive = ModelViewer.utils.mdx.primitives.createSphere(20,20,20);
  window.sphereModel = await ModelViewer.utils.mdx.createPrimitive(viewer, spherePrimitive , { texture });
  window.sphereInstance = sphereModel.addInstance();
  // window.Unit = Object.getPrototypeOf(viewer.units[0]).constructor;
  window.testUnitInfo = { "location":[0,0,0],"rotation":[0,0,0,1],"player":0,"scale":[1,1,1] };
  viewer.units.push(new Unit(viewer, sphereModel , undefined, testUnitInfo ));
  viewer.worldScene.addInstance(sphereInstance);
  sphereInstance.move([pos.x, pos.y, pos.z]);

  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.z, pos.y ) );
  transform.setRotation( new Ammo.btQuaternion( quat.x, quat.z, quat.y, quat.w ) );
  let motionState = new Ammo.btDefaultMotionState( transform );

  let colShape = new Ammo.btSphereShape( radius );
  colShape.setMargin( 0.05 );

  let localInertia = new Ammo.btVector3( 0, 0, 0 );
  colShape.calculateLocalInertia( mass, localInertia );

  let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
  let body = new Ammo.btRigidBody( rbInfo );
  body.setFriction(4);
  body.setRollingFriction(10);
  window.ball = window.sphereInstance;
  // body belongs to group 'colGroupBlackBall' and collides with 'colGroupPlane'
  // physicsWorld.addRigidBody( body, colGroupBlackBall, colGroupPlane );
  physicsWorld.addRigidBody( body );
  // body.setActivationState(DISABLE_DEACTIVATION); //freezes object
  ball.userData = {}
  ball.userData.physicsBody = body;
  rigidBodies.push(ball);
}

function updatePhysics( deltaTime ) {
  // Step world
  physicsWorld.stepSimulation( deltaTime, 10 );
  // Update rigid bodies
  for ( let i = 0; i < rigidBodies.length; i++ ) {
      let mdxM3Obj = rigidBodies[ i ];
      let objAmmo = mdxM3Obj.userData.physicsBody;
      let ms = objAmmo.getMotionState();
      if ( ms ) {
          ms.getWorldTransform( tmpTrans );
          let p = tmpTrans.getOrigin();
          let q = tmpTrans.getRotation();
          // console.log(Math.round(p.x()), Math.round(p.z()), Math.round(p.y()))
          // need to invert y and z axis
          mdxM3Obj.setLocation([ p.x(), p.z(), p.y() ]);
          mdxM3Obj.setRotation([ q.x(), q.z(), q.y(), q.w() ]);

      }
  }
}

window.rotateZWithMouseCursor = function rotateZWithMouseCursor(unit, angle) {
  const rotationQuat = quat.rotateZ([0,0,0,0], unit.localRotation, angle);
  unit.setRotation(rotationQuat);
};

// Wait for map to load (user must chose a map first)
const prom = new Promise((resolve) => {
  const intervalTimer = setInterval(() => {
    if (window.mapLoaded === true) {
      clearInterval(intervalTimer);
      window.mapWidth = viewer.worldScene.grid.width;
      window.mapDepth = viewer.worldScene.grid.depth;
      resolve();
    }
  }, 50);
});
prom.then(() => {
// Ammojs Initialization
  async function setup() {
    window.stopUsingStep = true;
    tmpTrans = new Ammo.btTransform();
    setupPhysicsWorld();
    createBlock();
    window.texture = viewer.load('textures/shockwave_ice1.blp');
    const pos = [0,0,0]
    const zCoord = heightAt(pos.slice(0,2));
    pos[2] = zCoord;
    window.u = await addGruntUnit(pos);
    await addSphere(20, window.texture, pos);
    // await createBall();
    renderFrame();
  }
  if (!Ammo.ready) {
    Ammo().then(setup);
  } else {
    setup();
  }
  
});

//http-server -p 3000 --cors
//getFirstUnit(); setArrowKeyListener(); u = unitInstance;