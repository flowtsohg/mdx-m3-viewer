var generateColor = (function () {
    var i = 1;

    return function () {
        var a = i % 10,
              b = Math.floor(i / 10) % 10,
              c = Math.floor(i / 100) % 10;

        i += 1;

        return [a / 10, b / 10, c / 10];
    };
}());

function colorString(color) {
    var r = Math.floor(color[0] * 255),
          g = Math.floor(color[1] * 255),
          b = Math.floor(color[2] * 255);

    return "" + r + g + b;
}

/**
 * Mixes one object onto another.
 * If the destination already defines a property, it wont be copied from the source.
 *
 * @param {object} mixer The source.
 * @param {object} mixed The destination.
 */
function mixin(mixer, mixed) {
    var properties = Object.getOwnPropertyNames(mixer),
          property,
          i,
          l;

    for (i = 0, l = properties.length; i < l; i++) {
        property = properties[i];

        // Allow the target to override properties
        if (!mixed[property]) {
            mixed[property] = mixer[property];
        }
    }
}

function extend(base, properties) {
    var prototype = Object.create(base),
          keys = Object.keys(properties),
          key,
          i,
          l;
    
    for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        prototype[key] = properties[key];
    }
    
    return prototype;
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

/**
 * Encodes two 0-255 numbers into one.
 *
 * @param {number} x The first number.
 * @param {number} y The second number.
 * @returns {number} The encoded number.
 */
function encodeFloat2(x, y) {
    return x + y * 256;
}

/**
 * Decodes a previously encoded number into the two original numbers.
 *
 * @param {number} f The input.
 * @returns {array} The two decoded numbers.
 */
function decodeFloat2(f) {
    var v = [];

    v[1] = Math.floor(f / 256);
    v[0] = Math.floor(f - v[1] * 256);

    return v;
}

/**
 * Encodes three 0-255 numbers into one.
 *
 * @param {number} x The first number.
 * @param {number} y The second number.
 * @param {number} z The third number.
 * @returns {number} The encoded number.
 */
function encodeFloat3(x, y, z) {
    return x + y * 256 + z * 65536;
}

/**
 * Decodes a previously encoded number into the three original numbers.
 *
 * @param {number} f The input.
 * @returns {array} The three decoded numbers.
 */
function decodeFloat3(f) {
    var v = [];

    v[2] = Math.floor(f / 65536);
    v[1] = Math.floor((f - v[2] * 65536) / 256);
    v[0] = Math.floor(f - v[2] * 65536 - v[1] * 256);

    return v;
}

/**
 * Gets the file name from a file path.
 *
 * @param {string} source The file path.
 * @returns {string} The file name.
 */
function getFileName(source) {
    var tokens = source.split(/[\\\/]/g);

    return tokens[tokens.length - 1];
}

/**
 * Gets the file extention from a file path.
 *
 * @param {string} source The file path.
 * @returns {string} The file extension.
 */
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

/**
 * Parses all of the url parameters and returns a map.
 *
 * @returns {string} The parameters map.
 */
function getUrlVariables() {
    var urlMap = {},
          searchstr = window.location.search.substring(1),
          variables = searchstr.split("&"),
          keyval,
          i, 
          l;

    for (i = 0, l = variables.length; i < l; i++) {
        keyval = variables[i].split("=");

        urlMap[keyval[0]] = keyval[1] || 1;
    }

    return urlMap;
}

/**
 * Goes over the DOM, and returns a map of all the elements with IDs, such that map[elementId]=element.
 *
 * @returns {object} The DOM map.
 */
function getDom() {
    var dom = {},
          elements = document.getElementsByTagName("*"),
          element,
          i;

    for (i = elements.length; i--;) {
        element = elements[i];

        if (element.id) {
            dom[element.id] = element;
        }
    }

    return dom;
}

/**
 * Sends an XHR2 request.
 *
 * @param {string} path The url to request.
 * @param {boolean} binary If true, the request type will be arraybuffer.
 * @param {function} onload onload callback.
 * @param {function} onerror onerror callback.
 * @param {function} onprogress onprogress callback.
 */
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

/**
 * A very simple string hashing algorithm.
 *
 * @param {string} s String to hash.
 * @returns {number} The string hash.
 */
String.hashCode = function(s) {
    var hash = 0,
          i,
          l;

    for (i = 0, l = s.length; i < l; i++) {
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

/**
 * A deep Object copy.
 *
 * @param {object} object The object to copy.
 * @returns {object} The copied object.
 */
Object.copy = function (object) {
    var keys = Object.keys(object),
          key,
          newObj = (object instanceof Array) ? [] : {},
          i, 
          l;

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

/**
 * A shallow Array copy.
 *
 * @param {array} a The array to copy.
 * @returns {array} The copied array.
 */
Array.copy = function (a) {
    var newArray = [],
          i,
          l;

    for (i = 0, l = a.length; i < l; i++) {
        newArray[i] = a[i];
    }

    return newArray;
};