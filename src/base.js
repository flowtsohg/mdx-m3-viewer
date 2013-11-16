// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function fileName(path) {
    return path.replace(/^.*[\\\/]/, "").replace(/\..*/, "");
}

if (!window.requestAnimationFrame ) {
  window.requestAnimationFrame = (function() {
    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) { window.setTimeout(callback, 1000 / 60); };
  })();
}

function getHiddenProperty() {
  var prefixes = ["webkit", "moz", "ms", "o"];

  if ("hidden" in document) {
    return "hidden";
  }

  for (var i = 0; i < prefixes.length; i++) {
    var property = prefixes[i] + "Hidden";

    if (property in document) {
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
  
  for (var i = 0, l = variables.length; i < l; i++){
      var keyval = variables[i].split("=");
      
      urlMap[keyval[0]] = keyval[1] || 1;
  }
  
  return urlMap;
}
      
function getDom() {
  var dom = {};
  var elements = document.getElementsByTagName("*");
    
  for (var i = elements.length; i--;) {
    var element = elements[i];
    
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
  if (event === "mousewheel") {
    element.addEventListener("DOMMouseScroll", callback, false);
  }
  
  element.addEventListener(event, callback, false);
}
/*
function removeEvent(element, event, callback) {
  if (element.removeEventListener) {
    if (event === "mousewheel") {
      element.removeEventListener("DOMMouseScroll", callback, false);
    }
    
    element.removeEventListener(event, callback, false);
  } else if (element.detachEvent) {
    element.detachEvent("on" + event, callback );
  } else {
    element["on" + event] = null;
  }
}
*/
function preventEvent(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
  
  if (event.preventDefault) {
    event.preventDefault();
  }
  
  event.cancelBubble = true;
  event.cancel = true;
  event.returnValue = false;
  
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

Object.copy = function (object) {
  var keys = Object.keys(object);
  var newObj = (object instanceof Array) ? [] : {};
  
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    
    if (typeof key === "object") {
      newObj[key] = Object.copy(object[key]);
    } else {
      newObj[key] = object[key];
    }
  }

  return newObj;
};

Array.equals = function (a, b) {
    if (!a || !b) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (var i = 0, l = a.length; i < l; i++) {
        if (a[i] instanceof Array && b[i] instanceof Array) {
            if (!Array.equals(a[i], b[i])) {
              return false;
            }
        } else if (a[i] !== b[i]) {
          return false;
        }
    }
    
    return true;
}