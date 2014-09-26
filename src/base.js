function mixin(source, target) {
  source.call(target.prototype);
}

function getNamesFromObjects(objects) {
  var names = [],
        i,
        l;
  
  if (objects) {
    for (i = 0, l = objects.length; i < l; i++) {
      names[i] = objects[i].name;
    }
  }
  
  return names;
}

function encodeFloat2(x, y) {
  return x + y * 256;
}

function decodeFloat2(f) {
  var v = [];
  
  v[1] = Math.floor(f / 256);
  v[0] = Math.floor(f - v[1] * 256);
  
  return v;
}

function encodeFloat3(x, y, z) {
  return x + y * 256 + z * 65536;
}

function decodeFloat3(f) {
  var v = [];
  
  v[2] = Math.floor(f / 65536);
  v[1] = Math.floor((f - v[2] * 65536) / 256);
  v[0] = Math.floor(f - v[2] * 65536 - v[1] * 256);
  
  return v;
}

function getFileName(source) {
  var tokens = source.split(/[\\\/]/g);
  
  return tokens[tokens.length - 1];
}

function getFileExtension(source) {
  var tokens = source.split(".");
  
  return tokens[tokens.length - 1];
}


if (typeof String.prototype.endsWith !== "function") {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

if (!window.requestAnimationFrame ) {
  window.requestAnimationFrame = (function() {
    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
  }());
}

function getUrlVariables() {
  var urlMap = {};
  var searchstr = window.location.search.substring(1);
  var variables = searchstr.split("&");
  var i, l, keyval;
    
  for (i = 0, l = variables.length; i < l; i++){
      keyval = variables[i].split("=");
      
      urlMap[keyval[0]] = keyval[1] || 1;
  }
  
  return urlMap;
}
      
function getDom() {
  var dom = {};
  var elements = document.getElementsByTagName("*");
  var i, element;
    
  for (i = elements.length; i--;) {
    element = elements[i];
    
    if (element.id) {
      dom[element.id] = element;
    }
  }
  
  return dom;
}

function getFile(path, binary, onload, onerror, onprogress) {
  var xhr = new XMLHttpRequest();
  
  if (onload) {
    xhr.addEventListener("load", onload, false);
  }
  
  if (onerror) {
    xhr.addEventListener("error", onerror, false);
  }
  
  if (onprogress) {
    xhr.addEventListener("progress", onprogress, false);
  }
  
  xhr.open("GET", path, true);
  
  if (binary) {
    xhr.responseType = "arraybuffer";
  }
  
  xhr.send();
}

function addEvent(element, event, callback) {
  // No mousewheel in Firefox
  if (event === "mousewheel") {
    element.addEventListener("DOMMouseScroll", callback, false);
  }
  
  element.addEventListener(event, callback, false);
}

function removeEvent(element, event, callback) {
  if (event === "mousewheel") {
    element.removeEventListener("DOMMouseScroll", callback, false);
  }
  
  element.removeEventListener(event, callback, false);
}

function preventDefault(e) {
  e.preventDefault();
}

String.hashCode = function(s) {
  var hash = 0;
  
  for (var i = 0, l = s.length; i < l; i++) {
    hash = hash * 31 + s.charCodeAt(i);
    hash = hash & hash;
  }
  
  return hash;
};

if (typeof String.prototype.startsWith != "function") {
  String.prototype.startsWith = function (what) {
    return this.lastIndexOf(what, 0) === 0;
  };
}

Object.copy = function (object) {
  var keys = Object.keys(object);
  var newObj = (object instanceof Array) ? [] : {};
  var i, l, key;
    
  for (i = 0, l = keys.length; i < l; i++) {
    key = keys[i];
    
    if (typeof key === "object") {
      newObj[key] = Object.copy(object[key]);
    } else {
      newObj[key] = object[key];
    }
  }

  return newObj;
};

Array.equals = function (a, b) {
  var i, l;
  
  if (!a || !b || a.length !== b.length) {
    return false;
  }
  
  for (i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  
  return true;
};

Array.copy = function (a) {
  var newArray = [];
  var i, l;
  
  for (i = 0, l = a.length; i < l; i++) {
    newArray[i] = a[i];
  }
  
  return newArray;
};