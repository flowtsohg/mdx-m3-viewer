function encodeFloat2(x, y) {
  return x + y * 256.0;
}

function decodeFloat2(f) {
  var v = [];
  
  v[1] = Math.floor(f / 256.0);
  v[0] = Math.floor(f - v[1] * 256.0);
  
  return v;
}

function encodeFloat3(x, y, z) {
  return x + y * 256.0 + z * 65536;
}

function decodeFloat3(f) {
  var v = [];
  
  v[2] = Math.floor(f / 65536.0);
  v[1] = Math.floor((f - v[2] * 65536.0) / 256.0);
  v[0] = Math.floor(f - v[2] * 65536.0 - v[1] * 256.0);
  
  return v;
}

function numberCompareFn(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};

function binarySearchInterval(arr, target) {
  var left = 0;
  var right = arr.length; 
  var found;
  var middle;
  var compareResult;
  
  if (target < arr[0]) {
    return [right, 0];
  } else if (target > arr[right - 1]) {
    return [right - 1, right];
  }
  
  while (left < right) {
    middle = (left + right) >> 1;
    compareResult = numberCompareFn(target, arr[middle]);
    
    if (compareResult === 0) {
      return [middle, middle + 1];
    } else if (compareResult === 1 && arr[middle + 1] > target) {
      return [middle, middle + 1];
    } else if (compareResult === -1 && arr[middle - 1] < target) {
      return [middle - 1, middle];
    }
    
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }
};

function getFileName(source) {
  var tokens = source.split("/");
  
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

function getHiddenProperty() {
  var i, property, prefixes = ["webkit", "moz", "ms", "o"];

  if (document["hidden"]) {
    return "hidden";
  }

  for (i = 0; i < 4; i++) {
    property = prefixes[i] + "Hidden";

    if (document[property]) {
      return property;
    }
  }

  return null;
}

function isHidden() {
  var property = getHiddenProperty();
  
  if (property) {
    return document[property];
  }
  
  return false;
}

function addVisibilityListener(listener) {
  var property = getHiddenProperty();
  
  if (property) {
    document.addEventListener(property.substr(0, property.length - 6) + "visibilitychange", listener, false);
  }
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
  
    if (!a || !b) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (i = 0, l = a.length; i < l; i++) {
        if (a[i] instanceof Array && b[i] instanceof Array) {
            if (!Array.equals(a[i], b[i])) {
              return false;
            }
        } else if (a[i] !== b[i]) {
          return false;
        }
    }
    
    return true;
};