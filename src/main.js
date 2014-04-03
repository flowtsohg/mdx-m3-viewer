// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var dom = getDom();
var urlVariables = getUrlVariables();
var mouse = {buttons: [false, false, false], x: 0, y: 0, x2: 0, y2: 0};
var showShapes = false;
var canvas = dom.canvas;

var models = {};
var textures = {};

var leoric;
/*
var tabsList = document.getElementById("tabslist");
var lis = tabsList.querySelectorAll("li");
var selectedLi = lis[0];

function onLiClick(e) {
  var li = e.target.parentElement;
  
  if (li.className !== "selected") {
    li.className = "selected";
    selectedLi.className = "";
    selectedLi = li;
  }
 
  preventEvent(e);
}

for (var i = 0, element; element = lis[i]; i++) {
    element.onclick = onLiClick;
}

var optionsButton = document.getElementById("options");
var optionsVisible = false;
var newmenu = document.getElementById("newmenu");

optionsButton.onclick = function () {
  optionsVisible = !optionsVisible;
  
  if (optionsVisible) {
    newmenu.style.visibility = "visible";
  } else {
    newmenu.style.visibility = "hidden";
  }
}
*/
function onmessage(e) {
  var type = e.type;
  var objectType = e.objectType;
  var name = e.name;
  var progress = e.progress;
  
  if ( type === "loadstart" || type === "progress" || type === "load") {
    if (objectType === "model") {
      models[name] = progress;
    } else {
      textures[name] = progress;
    }
    
    if (type == "load") {
      console.log("Finished loading " + name);
    }
  } else {
    console.log("some error", e);
  }
}
/*
function addIndex(a) {
  for (var i = 0; i < a.length; i++) {
    a[i].index = i;
  }
}

function sortByName(a, b) {
  return (a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));
}

function addOptions(element, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    var option = document.createElement("option");
    
    option.value = options[i].index;
    option.text = options[i].name;
    
    element.add(option);
  }
}

function onload(format) {
  var animations = Object.copy(viewer.getAnimations());
  var cameras = Object.copy(viewer.getCameras());
  
  addIndex(animations);
  addIndex(cameras);
  
  animations.sort(sortByName);
  cameras.sort(sortByName);
  
  addOptions(dom["animation-select"], animations);
  addOptions(dom["camera-select"], cameras);
  
  dom["menu"].style.visibility = "visible";
  
  if (format === 2) {
    dom["shaders-select"].style.visibility = "visible";
  }
}

function onerror(e) {
  console.log("Some error at some place occured");
  console.log(e);
}
*/

var urls = {
  header: function (id) {
    return "http://www.hiveworkshop.com/forums/apps.php?p=textures&id=" + id;
  },
  
  mpqFile: function (path) {
    return "http://www.hiveworkshop.com/forums/apps.php?p=mpq_file&file=" + path;
  },
  
  customTexture: function (id) {
    return "http://www.hiveworkshop.com/forums/apps.php?section=skins&p=model_file&id=" + id + "&file=skin.png";
  },
  
  customModel: function (id) {
    return "http://www.hiveworkshop.com/model_files/" + id + "/model.mdx";
  },
  
  customFile: function (path) {
    return "http://www.hiveworkshop.com/forums/" + path;
  }
};
  

var viewer = ModelViewer(canvas, urls, onmessage, urlVariables["d"]);

if (viewer) {
  /*
  var steps = 24;

  for (var i = 0; i < steps; i++) {
    var radians = (Math.PI * 2 / steps) * i;
    var distance = 220;
    var x = Math.cos(radians) * distance;
    var y = Math.sin(radians) * distance;
    var hydralisk = viewer.loadInstance("Assets/Units/Zerg/Hydralisk/Hydralisk.m3");
    
    viewer.move(hydralisk, [x, y, 0]);
    //viewer.rotate(hydralisk, [0, 0, math.toDeg(radians)]);
    viewer.scale(hydralisk, 0.3);
    viewer.playAnimation(hydralisk, 1);
  }

  for (var i = 0; i < steps; i++) {
    var radians = (Math.PI * 2 / steps) * i;
    var distance = 155;
    var x = Math.cos(radians) * distance;
    var y = Math.sin(radians) * distance;
    var baneling = viewer.loadInstance("Assets/Units/Zerg/baneling/baneling.m3");
    
    viewer.move(baneling, [x, y, 0]);
    viewer.scale(baneling, 0.3);
    //viewer.rotate(zerg, [0, 0, math.toDeg(radians)]);
    viewer.playAnimation(baneling, 0);
  }

  for (var i = 0; i < steps; i++) {
    var radians = (Math.PI * 2 / steps) * i;
    var distance = 100;
    var x = Math.cos(radians) * distance;
    var y = Math.sin(radians) * distance;
    var zerg = viewer.loadInstance("Assets/Units/Zerg/Zergling/Zergling.m3");
    
    viewer.move(zerg, [x, y, 0]);
    viewer.scale(zerg, 0.3);
    //viewer.rotate(zerg, [0, 0, math.toDeg(radians)]);
    viewer.playAnimation(zerg, 0);
  }
  */
  var ultralisk = viewer.loadInstance("Assets/Units/Zerg/Ultralisk/Ultralisk.m3");
  viewer.playAnimation(ultralisk, 0);
  viewer.setTeamColor(ultralisk, 3);
  //viewer.scale(ultralisk, 0.3);

  leoric = viewer.loadInstance("5nnbul");
  viewer.playAnimation(leoric, 1);
  viewer.setParent(leoric, ultralisk, 7);
  viewer.move(leoric, [-100, 0, 25]);
  viewer.setTeamColor(leoric, 5);
  /*
  var dwarf = viewer.loadInstance("units/human/HeroMountainKing/HeroMountainKing.mdx");
  viewer.playAnimation(dwarf, 0);
  //viewer.scale(dwarf, 0.6);
  viewer.overrideTexture(dwarf, "replaceabletextures/heromountainking/heromountainking.blp", "opmmml");
  viewer.setParent(dwarf, ultralisk, 7);
  viewer.move(dwarf, [-10, 0, 0]);
  */
  /*
  var zergling = viewer.loadInstance("Assets/Units/Zerg/Zergling/Zergling.m3");
  viewer.playAnimation(zergling, 0);
  viewer.move(zergling, [-50, 0, 0]);
  //viewer.scale(zergling, 2);
  */

  /*
  var dwarf = viewer.loadInstance("units/human/HeroMountainKing/HeroMountainKing.mdx");
  var dragon = viewer.loadInstance("Units/Creeps/AzureDragon/AzureDragon.mdx");
  var zergling = viewer.loadInstance("Units/Critters/zergling/zergling.mdx");
  var zergling2 = viewer.loadInstance("Assets/Units/Zerg/Zergling/Zergling.m3");
  var hydralisk = viewer.loadInstance("Assets/Units/Zerg/Hydralisk/Hydralisk.m3");

  viewer.playAnimation(dwarf, 0);
  viewer.playAnimation(dragon, 0);
  viewer.playAnimation(zergling, 0);
  viewer.playAnimation(hydralisk, 1);
*/
}