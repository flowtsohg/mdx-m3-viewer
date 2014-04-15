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

function getFile(path, binary, onload, onerror, onprogress, parent) {
  var xhr = new XMLHttpRequest();
  
  if (onload) {
    if (parent) {
      onload = onload.bind(parent);
    }
    
    xhr.addEventListener("load", onload, false);
  }
  
  if (onerror) {
    if (parent) {
      onerror = onerror.bind(parent);
    }
    
    xhr.addEventListener("error", onerror, false);
  }
  
  if (onprogress) {
    if (parent) {
      onprogress = onprogress.bind(parent);
    }
    
    xhr.addEventListener("progress", onprogress, false);
  }
  
  xhr.open("GET", path, true);
  
  if (binary) {
    xhr.responseType = "arraybuffer";
  }
  
  xhr.send();
}

function addEvent(element, event, callback) {
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

function preventEvent(event) {
  event.stopPropagation();
  event.preventDefault();
  return false;
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