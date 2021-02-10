Ammo().then(function(Ammo) {
  
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
  // - Global variables -
  var DISABLE_DEACTIVATION = 4;
  var TRANSFORM_AUX = new Ammo.btTransform();
  var ZERO_QUATERNION = {x: 0, y: 0, z: 0, w: 1};;
  let clock;
  // Physics variables
  var collisionConfiguration;
  var dispatcher;
  var broadphase;
  var solver;
  var physicsWorld;

  var syncList = [];
  const DISABLE_DEACTIVATION = 4;

  function initPhysics() {

      // Physics configuration
      collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
      dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
      broadphase = new Ammo.btDbvtBroadphase();
      solver = new Ammo.btSequentialImpulseConstraintSolver();
      physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
      physicsWorld.setGravity( new Ammo.btVector3( 0, -9.82, 0 ) );

    // I moved clock initialization to here
    clock = new Clock();
  }

  /* combining code from client/map/index.js and ammojs tutorial */
  function tick() {
    requestAnimationFrame( tick );

    //* client/map/index.js
    meter.tick();
    cellsElement.textContent = `Cells: ${viewer.worldScene.visibleCells}`;
    instancesElement.textContent = `Instances: ${viewer.worldScene.visibleInstances}`;
    particlesElement.textContent = `Particles: ${viewer.worldScene.updatedParticles}`;
    // *
    var dt = clock.getDelta();
    for (var i = 0; i < syncList.length; i++)
      syncList[i](dt);

    //new line of code
    physicsWorld.stepSimulation( dt, 10 );
    viewer.updateAndRender();
  }

  // MAKE GROUND
  function createBox(pos = { x: 0, y: 0, z: 0 }, quat, w, l, h, mass, friction) {
    // let scale = { x: window.mapWidth, y: 301, z: window.mapDepth };
    var geometry = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 0.5, h * 0.5));
    /* dont need to do anything, wc3 map is the box */
    // var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);

    if(!mass) mass = 0;
    if(!friction) friction = 1;
    
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    var motionState = new Ammo.btDefaultMotionState(transform);

    var localInertia = new Ammo.btVector3(0, 0, 0);
    geometry.calculateLocalInertia(mass, localInertia);

    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    body.setFriction(friction);
    //body.setRestitution(.9);
    //body.setDamping(0.2, 0.2);

    physicsWorld.addRigidBody( body );

    if (mass > 0) {
      body.setActivationState(DISABLE_DEACTIVATION);
      // Sync physics and graphics
      function sync(dt) {
        var ms = body.getMotionState();
        if (ms) {
          ms.getWorldTransform(TRANSFORM_AUX);
          var p = TRANSFORM_AUX.getOrigin();
          var q = TRANSFORM_AUX.getRotation();
          // console.log(p.x(), p.z(), p.y())
          // need to invert y and z axis
          mdxM3Obj.setLocation([ p.x(), p.z(), p.y() ]);
          mdxM3Obj.setRotation([ q.x(), q.z(), q.y(), q.w() ]);
        }
      }

      syncList.push(sync);
    }

  }


  async function createBall(r) {
                  
    let pos = {x: 0, y: 4, z: 0};
    let radius = r || 2;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    // //threeJS Section
    // let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));

    // ball.position.set(pos.x, pos.y, pos.z);
    
    // ball.castShadow = true;
    // ball.receiveShadow = true;
  
    // scene.add(ball);

  //mdx-m3-viewer Section
    window.texture = viewer.load('textures/shockwave_ice1.blp');
    window.spherePrimitive = ModelViewer.utils.mdx.primitives.createSphere(20,20,20);
    await (async ()=> {
      window.sphereModel = await ModelViewer.utils.mdx.createPrimitive(viewer, spherePrimitive , { texture });
      window.sphereInstance = sphereModel .addInstance();
      window.Unit = Object.getPrototypeOf(viewer.units[0]).constructor;
      window.testUnitInfo = { "location":[0,0,0],"rotation":[0,0,0,1],"player":0,"scale":[1,1,1] };
      viewer.units.push(new Unit(viewer, sphereModel , undefined, testUnitInfo ));
      viewer.worldScene.addInstance(sphereInstance);
      sphereInstance.move([pos.x, pos.z, pos.y]);
    })();

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btSphereShape( radius );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(4);
    body.setRollingFriction(10);


    physicsWorld.addRigidBody( body );
    
    body.setActivationState(DISABLE_DEACTIVATION);
    // Sync physics and graphics
    function sync(dt) {
      var ms = body.getMotionState();
      if (ms) {
        ms.getWorldTransform(TRANSFORM_AUX);
        var p = TRANSFORM_AUX.getOrigin();
        var q = TRANSFORM_AUX.getRotation();
        ms.getWorldTransform( TRANSFORM_AUX );
        mdxM3Obj.setLocation([ p.x(), p.z(), p.y() ]);
        mdxM3Obj.setRotation([ q.x(), q.z(), q.y(), q.w() ]);
      }
    }
    syncList.push(sync);
  }
}

// Wait for map to load (user must chose a map first)
const prom = new Promise((resolve) => {
  const intervalTimer = setInterval(() => {
    if (window.mapLoaded === true) {
      clearInterval(intervalTimer);
      resolve();
    }
  }, 50);
});
prom.then(() => {
// Ammojs Initialization
  Ammo().then(async (Ammo) => {
    initPhysics();
    createBlock();
    await createBall();
    window.stopUsingStep = true;
    renderFrame();
  });
});
