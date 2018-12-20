// An orbit camera setup example.
// Left mouse button controls the orbit itself.
// The right mouse button allows to move the camera and the point it's looking at in the XY plane.
// The scroll moves the camera forward and backward.
function setupCamera(scene, initialDistance) {
  let canvas = scene.viewer.canvas;
  let camera = scene.camera;
  let MOVE_SPEED = 2;
  let ZOOM_SPEED = 120;
  let ROTATION_SPEED = 1 / 200;
  let mouse = {buttons: [false, false, false], x: 0, y: 0, x2: 0, y2: 0};
  let right = vec3.create();
  let up = vec3.create();
  let horizontalAngle = -Math.PI / 2;
  let verticalAngle = -Math.PI / 4;
  let cameraTarget = vec3.create(); // What the camera orbits.

  // Initial setup, go back a bit and look forward.
  camera.move([0, -initialDistance, 0]);
  camera.setRotationAroundAngles(horizontalAngle, verticalAngle, cameraTarget);

  // Move the camera and the target on the XY plane.
  function move(x, y) {
    let dirX = camera.directionX;
    let dirY = camera.directionY;

    // Allow only movement on the XY plane, and scale to  MOVE_SPEED.
    vec3.scale(right, vec3.normalize(right, [dirX[0], dirX[1], 0]), x * MOVE_SPEED);
    vec3.scale(up, vec3.normalize(up, [dirY[0], dirY[1], 0]), y * MOVE_SPEED);

    camera.move(right);
    camera.move(up);

    // And also move the camera target to update the orbit.
    vec3.add(cameraTarget, cameraTarget, right);
    vec3.add(cameraTarget, cameraTarget, up);
  }

  // Rotate the camera around the target.
  function rotate(dx, dy) {
    // Update rotations, and limit the vertical angle so it doesn't flip.
    // Since the camera uses a quaternion, flips don't matter to it, but this feels better.
    horizontalAngle += dx * ROTATION_SPEED;
    verticalAngle = Math.max(-Math.PI + 0.01, Math.min(verticalAngle + dy * ROTATION_SPEED, -0.01));

    camera.setRotationAroundAngles(horizontalAngle, verticalAngle, cameraTarget);
  }

  // Zoom the camera by moving forward or backwards.
  function zoom(factor) {
    // Get the forward vector.
    let dirZ = camera.directionZ;

    camera.move(vec3.scale([], dirZ, factor * ZOOM_SPEED));
  }

  // Resize the canvas automatically and update the camera.
  function onResize() {
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    camera.viewport([0, 0, width, height]);
    camera.perspective(Math.PI / 4, width / height, 8, 100000);
  }

  window.addEventListener('resize', function(e) {
    onResize();
  });

  onResize();

  // Disable the context menu when right-clicking.
  canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  canvas.addEventListener('selectstart', function(e) {
    e.preventDefault();
  });

  // Track mouse clicks.
  canvas.addEventListener('mousedown', function(e) {
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
