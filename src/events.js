var mouse = {buttons: [false, false, false], x: 0, y: 0, x2: 0, y2: 0};
var touchesCount = 0;
var touches = [];

addEvent(dom.canvas, "touchstart", function (e) {
  for (var i = 0, l = e.changedTouches.length; i < l; i++) {
    var touch = e.changedTouches[i];
    
    touches[i] = [touch.clientX, touch.clientY];
  }
  
  touchesCount = e.touches.length;
  
  preventDefault(e);
});

addEvent(dom.canvas, "touchend", function (e) {
  for (var i = 0, l = e.changedTouches.length; i < l; i++) {
    var touch = e.changedTouches[i];
    
    touches[i] = null;
  }
  
  touchesCount = e.touches.length;
  
  preventDefault(e);
});

addEvent(dom.canvas, "touchmove", function (e) {
  if (touchesCount === 1) {
    if (touches[0]) {
      var xdiff = touches[0][0] - e.changedTouches[0].clientX;
      var ydiff = touches[0][1] - e.changedTouches[0].clientY;
      
      viewer.rotateCamera(-ydiff / 6, -xdiff / 2);
    }
  } else if (touchesCount === 2) {
    if (touches[0] && touches[1]) {
      var diff1 = [];
      var diff2 = [];
      
      math.vec2.subtract(touches[0], touches[1], diff1);
      math.vec2.subtract([e.changedTouches[0].clientX, e.changedTouches[0].clientY], [e.changedTouches[1].clientX, e.changedTouches[1].clientY], diff2);
      
      var dist1 = math.vec2.magnitude(diff1);
      var dist2 = math.vec2.magnitude(diff2);
      var diff = dist1 - dist2;
      var factor = 0.94;
      
      // Zoom in if touch events move away, otherwise zoom out
      if (diff > 0) {
        factor = 1.06;
      }
      
      viewer.zoomCamera(factor);
    }
  } else if (touchesCount === 3) {
    if (touches[0] && touches[1] && touches[2]) {
      var xdiff = touches[0][0] - e.changedTouches[0].clientX;
      var ydiff = touches[0][1] - e.changedTouches[0].clientY;
      
      viewer.panCamera(xdiff, ydiff);
    }
  }
  
  for (var i = 0, l = e.changedTouches.length; i < l; i++) {
    var touch = e.changedTouches[i];
    
    touches[i] = [touch.clientX, touch.clientY];
  }
  
  preventDefault(e);
});

addEvent(window, "keydown", function (e) {
  var key = e.keyCode;
  
  if (key === 33) {
    viewer.zoomCamera(0.85);
  } else if (key === 34) {
    viewer.zoomCamera(1.15);
  }
});

addEvent(dom.canvas, "mousedown", function (e) {
  mouse.buttons[e.button] = true;
  
  if (e.button === 1) {
    var id = viewer.selectInstance(e.clientX - 35, e.clientY - 35);
    
    if (id !== -1) {
      selectInstance(id);
    }
  }
  
  preventDefault(e);
});

addEvent(window, "mouseup", function (e) {
  mouse.buttons[e.button] = false;
});

addEvent(window, "mousemove", function (e) {
  mouse.x2 = mouse.x;
  mouse.y2 = mouse.y;
  mouse.x = e.screenX;
  mouse.y = e.screenY;
  
  var xdiff = mouse.x - mouse.x2, ydiff = mouse.y - mouse.y2;
  
  if (mouse.buttons[0]) {
    viewer.rotateCamera(ydiff, xdiff);
  }
  
  if (mouse.buttons[2]) {
    viewer.panCamera(xdiff, ydiff);
  }
});

addEvent(dom.canvas, "mousewheel", function (e) {
  var wheel = e.detail ? e.detail * (-1/3) : e.wheelDelta / 120;
  var factor = (wheel > 0) ? 0.85 : 1.15;
  
  viewer.zoomCamera(factor);
    
  preventDefault(e);
});

addEvent(dom.canvas, "contextmenu", function (e) {
  preventDefault(e);
});

addEvent(dom.canvas, "selectstart", function (e) {
  preventDefault(e);
});

addEvent(dom["animation-speed"], "change", function (e) {
  viewer.setAnimationSpeed(parseFloat(e.target.value));
});

addEvent(dom["world-mode"], "change", function (e) {
  viewer.setWorldMode(parseInt(e.target.value, 10));
});

addEvent(dom["bounding-shapes"], "click", function () {
  showShapes = !showShapes;
  
  viewer.setBoundingShapesMode(showShapes);
});

addEvent(dom["team-colors"], "click", function () {
  showTeamColors = !showTeamColors;
  
  viewer.setTeamColorsMode(showTeamColors);
});

addEvent(dom["shader"], "change", function (e) {
  viewer.setShader(parseInt(e.target.value, 10));
});

addEvent(dom["save-scene"], "click", function (e) {
  var json = viewer.saveScene();
  // [& is added before the scene because otherwise vBulletin ruins the first instance of [ for some reason
  dom["scene"].value = "http://www.hiveworkshop.com/model_viewer/?[&s=" + json.replace(/&/g, "%26").replace(/\?/g, "%3F").replace(/=/g, "%3D");
});