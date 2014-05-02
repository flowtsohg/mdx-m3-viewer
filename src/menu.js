var showShapes = false;
var showTeamColors = true;

var models = {};
var instances = [];
var progressbars = {};
var statuses = {};
var textures = [];

function updateOptions() {
  var value, value2;
  
  value = viewer.getAnimationSpeed();
  
  if (value === 0.25) {
    value2 = 0;
  } else if (value === 0.5) {
    value2 = 1;
  } else if (value === 1) {
    value2 = 2;
  } else if (value === 2) {
    value2 = 3;
  } else {
    value2 = 4;
  }
  
  dom["animation-speed"].selectedIndex = value2;
  
  value = viewer.getWorldMode();
  dom["world-mode"].selectedIndex = value;
  
  showShapes = viewer.getBoundingShapesMode();
  dom["bounding-shapes"].checked = showShapes;
  
  showTeamColors = viewer.getTeamColorsMode();
  dom["team-colors"].checked = showTeamColors;
  
  value = viewer.getShader();
  dom["shader"].selectedIndex = value;
}

// Must be a member of window so it would be accessible from the HTML page
window.loadInstance = function (e) {
  var node = e.children[0];
  var value = node.value;
  
  if (value !== "") {
    viewer.loadResource(value);
  }
}

// Must be a member of window so it would be accessible from the HTML page
window.loadResource = function (e) {
  var node = e.children[0];
  var value = node.value;
  
  if (value !== "") {
    viewer.loadResource(value);
    node.value = "";
  }
}

function onloadstart(e) {
  var objectType = e.objectType;
  var source = e.source;
  var name = getFileName(source);
  
  var tr = document.createElement("tr");
  
  var td1 = document.createElement("td");

  td1.appendChild(document.createTextNode(name));

  var td2 = document.createElement("td");

  var progressbar = document.createElement("progress");

  progressbar.max = 1;
  progressbar.value = 0;

  progressbar.style.width = "100px";

  td2.appendChild(progressbar);

  var td3 = document.createElement("td");

  var status = document.createTextNode("Loading");

  td3.appendChild(status);

  td1.style.padding = "2px";
  td2.style.padding = "2px";
  td3.style.padding = "2px";
  
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  progressbars[source] = progressbar;
  statuses[source] = status;
  
  dom["resource-list"].appendChild(tr);
}

function onprogress(e) {
  var source = e.source;
  var progress = e.progress || 0;
  var progressbar = progressbars[source];
  
  progressbar.value = progress;
}

function onload(e) {
  var objectType = e.objectType;
  var i, l;
  
  if (objectType === "model" || objectType === "texture") {
    var source = e.source;
    var name = getFileName(source);
    var progressbar = progressbars[source];
    var status = statuses[source];
    
    progressbar.value = 1;
    status.textContent = "Finished";
    
    if (objectType === "model") {
      dom["add-instance"].add(createOption(source, name));
    } else if (objectType === "texture") {
      textures.push([source, name]);
      
       for (i = 0, l = instances.length; i < l; i++) {
        refreshInstanceTextureMap(instances[i]);
      }
    }
  } else if (objectType === "instance") {
    var id = e.id;
    
    instances.push(id);
    
    addInstance(id);
    
    for (i = 0, l = instances.length; i < l; i++) {
      refreshInstanceParentAndAttachments(instances[i]);
      refreshInstanceTextureMap(instances[i]);
    }
  }
}

function onerror(e) {
  var objectType = e.objectType;
  var source = e.source;
  var error = e.error;
  
  if (objectType === "model" || objectType === "texture") {
    var status = statuses[source];
    
    status.textContent = "Error (" + error + ")";
  } else if (objectType === "webglcontext") {
    if (error === "WebGLContext") {
      dom["fatal-error"].style.display = "block";
      
      if (window.WebGLRenderingContext) {
        dom["fatal-error"].innerHTML = "Error: Your graphics card does not seem to support <a href=\"http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation\">WebGL</a>. Find out how to get it <a href=\"http://get.webgl.org/\">here</a>.";
      } else {
        dom["fatal-error"].innerHTML = "Error: Your browser does not seem to support <a href=\"http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation\">WebGL</a>.<br/>Find out how to get it <a href=\"http://get.webgl.org/\">here</a>.";
      }
    } else if (error === "VertexTexture") {
      dom["fatal-error"].style.display = "block";
      dom["fatal-error"].innerHTML = "Error: Your graphics card does not seem to support vertex shader textures. Your graphics drivers might be outdated, follow <a href=\"https://support.mozilla.org/en-US/kb/upgrade-graphics-drivers-use-hardware-acceleration?redirectlocale=en-US&redirectslug=how-do-i-upgrade-my-graphics-drivers\">this</a> to update them.";
    } else if (error === "FloatTexture") {
      dom["fatal-error"].style.display = "block";
      dom["fatal-error"].innerHTML = "Error: Your graphics card does not seem to support float textures. Your graphics drivers might be outdated, follow <a href=\"https://support.mozilla.org/en-US/kb/upgrade-graphics-drivers-use-hardware-acceleration?redirectlocale=en-US&redirectslug=how-do-i-upgrade-my-graphics-drivers\">this</a> to update them.";
    }
  }
  
  console.log("Error", e);
}

function displayPage() {
  var current = this.parentNode.getAttribute("data-current");
  
  document.getElementById("tabHeader_" + current).removeAttribute("class");
  document.getElementById("tabpage_" + current).style.display="none";

  var ident = this.id.split("_")[1];
  
  this.setAttribute("class","tabActiveHeader");
  document.getElementById("tabpage_" + ident).style.display="block";
  this.parentNode.setAttribute("data-current",ident);
}

var container = document.getElementById("tabContainer");
var navitem = container.querySelector(".tabs ul li");
var ident = navitem.id.split("_")[1];
navitem.parentNode.setAttribute("data-current",ident);
navitem.setAttribute("class","tabActiveHeader");
document.getElementById("tabpage_1").style.display="block";

var tabs = container.querySelectorAll(".tabs ul li");

for (var i = 0; i < tabs.length; i++) {
  tabs[i].onclick=displayPage;
}

// Overflow handling, can't get this to work properly with CSS
var tabscontent = document.getElementsByClassName("tabscontent")[0];

tabscontent.style.overflowY = "auto";

function resizeTabsContent() {
  var height = window.innerHeight - 150;
  
  tabscontent.style.maxHeight = height + "px";
}

resizeTabsContent();

addEvent(window, "resize", resizeTabsContent);