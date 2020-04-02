// An orbit camera setup example.
// Left mouse button controls the orbit itself.
// The right mouse button allows to move the camera and the point it's looking at on the XY plane.
// Scrolling zooms in and out.
function setupCamera(scene, options = {}) {
  let canvas = scene.viewer.canvas;
  let camera = scene.camera;
  // Movement per pixel of movement.
  let moveSpeed = options.moveSpeed || 2;
  // Rotation in radians per pixel of movement.
  let rotationSpeed = options.rotationSpeed || (Math.PI / 180);
  // Zoom factor per scroll.
  let zoomFactor = options.zoomFactor = 0.1;
  let horizontalAngle = options.horizontalAngle || Math.PI / 2;
  let verticalAngle = options.verticalAngle || Math.PI / 4;
  let distance = options.distance || 500;
  let position = vec3.create();
  // What the camera is looking at.
  let target = options.target || vec3.create();
  // What is considered "up" to this camera.
  let worldUp = options.worldUp || vec3.fromValues(0, 0, 1);
  let mouse = { buttons: [false, false, false], x: 0, y: 0, x2: 0, y2: 0 };

  let vecHeap = vec3.create();
  let quatHeap = quat.create();

  function update() {
    // Limit the vertical angle so it doesn't flip.
    // Since the camera uses a quaternion, flips don't matter to it, but this feels better.
    verticalAngle = Math.min(Math.max(0.01, verticalAngle), Math.PI - 0.01);

    quat.identity(quatHeap);
    quat.rotateZ(quatHeap, quatHeap, horizontalAngle);
    quat.rotateX(quatHeap, quatHeap, verticalAngle);

    vec3.set(position, 0, 0, 1);
    vec3.transformQuat(position, position, quatHeap);
    vec3.scale(position, position, distance);
    vec3.add(position, position, target);

    camera.moveToAndFace(position, target, worldUp);
  }

  update();

  // Move the camera and the target on the XY plane.
  function move(x, y) {
    let dirX = camera.directionX;
    let dirY = camera.directionY;

    // Allow only movement on the XY plane, and scale to moveSpeed.
    vec3.add(target, target, vec3.scale(vecHeap, vec3.normalize(vecHeap, vec3.set(vecHeap, dirX[0], dirX[1], 0)), x * moveSpeed));
    vec3.add(target, target, vec3.scale(vecHeap, vec3.normalize(vecHeap, vec3.set(vecHeap, dirY[0], dirY[1], 0)), y * moveSpeed));

    update();
  }

  // Rotate the camera around the target.
  function rotate(x, y) {
    horizontalAngle -= x * rotationSpeed;
    verticalAngle -= y * rotationSpeed;

    update();
  }

  // Zoom the camera by changing the distance from the target.
  function zoom(factor) {
    distance *= 1 + factor * zoomFactor;

    update();
  }

  // Resize the canvas automatically and update the camera.
  function onResize() {
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    camera.setViewport(0, 0, width, height);
    camera.perspective(Math.PI / 4, width / height, 8, 20000);
  }

  window.addEventListener('resize', function (e) {
    onResize();
  });

  onResize();

  // Disable the context menu when right-clicking.
  canvas.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  canvas.addEventListener('selectstart', function (e) {
    e.preventDefault();
  });

  // Track mouse clicks.
  canvas.addEventListener('mousedown', function (e) {
    e.preventDefault();

    mouse.buttons[e.button] = true;
  });

  // And mouse unclicks.
  // On the whole document rather than the canvas to stop annoying behavior when moving the mouse out of the canvas.
  document.addEventListener('mouseup', (e) => {
    e.preventDefault();

    mouse.buttons[e.button] = false;
  });

  // Handle rotating and moving the camera when the mouse moves.
  window.addEventListener('mousemove', (e) => {
    mouse.x2 = mouse.x;
    mouse.y2 = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    let dx = mouse.x - mouse.x2;
    let dy = mouse.y - mouse.y2;

    if (mouse.buttons[0]) {
      rotate(dx, dy);
    }

    if (mouse.buttons[2]) {
      move(-dx * 2, dy * 2);
    }
  });

  // Handle zooming when the mouse scrolls.
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    let deltaY = e.deltaY;

    if (e.deltaMode === 1) {
      deltaY = deltaY / 3 * 100;
    }

    zoom(deltaY / 100);
  });

  // Get the vector length between two touches.
  function getTouchesLength(touch1, touch2) {
    let dx = touch2.clientX - touch1.clientX;
    let dy = touch2.clientY - touch1.clientY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  // Touch modes.
  let TOUCH_MODE_INVALID = -1;
  let TOUCH_MODE_ROTATE = 0;
  let TOUCH_MODE_ZOOM = 1;
  let touchMode = TOUCH_MODE_ROTATE;
  let touches = [];

  // Listen to touches.
  // Supports 1 or 2 touch points.
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();

    let targetTouches = e.targetTouches;

    if (targetTouches.length === 1) {
      touchMode = TOUCH_MODE_ROTATE;
    } else if (targetTouches.length == 2) {
      touchMode = TOUCH_MODE_ZOOM;
    } else {
      touchMode = TOUCH_MODE_INVALID;
    }

    touches.length = 0;
    touches.push(...targetTouches);
  });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();

    touchMode = TOUCH_MODE_INVALID;
  });

  canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();

    touchMode = TOUCH_MODE_INVALID;
  });

  // Rotate or zoom based on the touch mode.
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();

    let targetTouches = e.targetTouches;

    if (touchMode === TOUCH_MODE_ROTATE) {
      let oldTouch = touches[0];
      let newTouch = targetTouches[0];
      let dx = newTouch.clientX - oldTouch.clientX;
      let dy = newTouch.clientY - oldTouch.clientY;

      rotate(dx, dy);
    } else if (touchMode === TOUCH_MODE_ZOOM) {
      let len1 = getTouchesLength(touches[0], touches[1]);
      let len2 = getTouchesLength(targetTouches[0], targetTouches[1]);

      zoom((len1 - len2) / 50);
    }

    touches.length = 0;
    touches.push(...targetTouches);
  });
}
