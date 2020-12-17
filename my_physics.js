
  
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
  requestAnimationFrame(renderFrame);
  //* client/map/index.js
  viewer.updateAndRender();
  meter.tick();
  cellsElement.textContent = `Cells: ${viewer.worldScene.visibleCells}`;
  instancesElement.textContent = `Instances: ${viewer.worldScene.visibleInstances}`;
  particlesElement.textContent = `Particles: ${viewer.worldScene.updatedParticles}`;
  // *

  let deltaTime = clock.getDelta();
}

// Ammojs Initialization
Ammo().then(() => {
  tmpTrans = new Ammo.btTransform();
  setupPhysicsWorld();
  renderFrame();
})