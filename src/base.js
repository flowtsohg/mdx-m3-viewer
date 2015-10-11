// Compute the spherical coordinates of a vector (end - start).
// The returned values are [radius, azimuthal angle, polar angle].
// See mathworld.wolfram.com/SphericalCoordinates.html
function computeSphericalCoordinates(start, end) {
    var v = vec3.sub([], start, end),
        r = vec3.len(v),
        theta = Math.atan2(v[1], v[0]),
        phi = Math.acos(v[2] / r);
    
    return [r, theta, phi];
}

// A simple incrementing ID generator
var generateID = (function () {
    var i = -1;

    return function () {
        i += 1;

        return i;
    };
}());

/**
 * Mixes one object onto another.
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

        mixed[property] = mixer[property];
    }
    
    return mixed;
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
function fileNameFromPath(path) {
    var input = path.replace(/^.*[\\\/]/, "")
    
    return input.substr(0, input.lastIndexOf(".")) || input;
}

/**
 * Gets the file extention from a file path.
 *
 * @param {string} source The file path.
 * @returns {string} The file extension.
 */
function fileTypeFromPath(path) {
    var input = path.replace(/^.*[\\\/]/, ""),
        output = input.substring(input.lastIndexOf(".")) || "";
    
    return output.toLowerCase();
}

if (!window.requestAnimationFrame ) {
    window.requestAnimationFrame = (function() {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
    }());
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
function getRequest(path, binary, onload, onerror, onprogress) {
    var xhr = new XMLHttpRequest();

    if (onload) {
        xhr.addEventListener("load", onload);
    }

    if (onerror) {
        xhr.addEventListener("error", onerror);
    }

    if (onprogress) {
        xhr.addEventListener("progress", onprogress);
    }

    xhr.open("GET", path, true);

    if (binary) {
        xhr.responseType = "arraybuffer";
    }

    xhr.send();
    
    return xhr;
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
Array.copy = function (array) {
    var newArray = [],
        i,
        l;

    for (i = 0, l = array.length; i < l; i++) {
        newArray[i] = array[i];
    }

    return newArray;
};

Array.clear = function (array) {
    while (array.length) {
      array.pop();
    }
    
    return array;
};
