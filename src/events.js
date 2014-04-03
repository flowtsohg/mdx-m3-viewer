// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

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
    
  return preventEvent(e);
});

addEvent(dom.canvas, "contextmenu", function (e) {
  return preventEvent(e);
});

addEvent(dom.canvas, "selectstart", function (e) {
  return preventEvent(e);
});

addEvent(dom["color-select"], "change", function (e) {
  var index = parseInt(e.target.value, 10);
  var color = viewer.setTeamColor(index);
  
  dom["color-icon"].style.backgroundColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
});

addEvent(dom["animation-button"], "click", function () {
  viewer.playAnimation(parseInt(dom["animation-select"].value, 10));
});

addEvent(dom["animation-select"], "change", function (e) {
  viewer.playAnimation(parseInt(e.target.value, 10));
});

addEvent(dom["animation-loop-button"], "click", function () {
  viewer.setLoopingMode(0);
  
  dom["animation-loop-select"].selectedIndex = 0;
});

addEvent(dom["animation-loop-select"], "change", function (e) {
  viewer.setLoopingMode(parseInt(e.target.value, 10));
});