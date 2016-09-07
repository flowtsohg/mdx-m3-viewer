var createTextureAtlas = (function () {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    /// TODO: Select a dynamic size based on the inputs
    canvas.width = canvas.height = 256;

    return function (src) {
        var textureWidth = src[0].width;
        var textureHeight = src[0].height;
        var texturesPerRow = 256 / textureWidth;

        for (var i = 0, l = src.length; i < l; i++) {
            var x = (i % texturesPerRow) * textureHeight;
            var y = Math.floor(i / texturesPerRow) * textureHeight;

            ctx.putImageData(src[i], x, y);
        }

        return { texture: ctx.getImageData(0, 0, canvas.width, canvas.height), columns: texturesPerRow, rows: texturesPerRow };
    }
}());

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

function TagToUint(tag) {
    return (tag.charCodeAt(0) << 24) + (tag.charCodeAt(1) << 16) + (tag.charCodeAt(2) << 8) + tag.charCodeAt(3);
}

function UintToTag(uint) {
    return String.fromCharCode((uint >> 24) & 0xff, (uint >> 16) & 0xff, (uint >> 8) & 0xff, uint & 0xff);
}

function mix(dst, ...args) {
    for (let arg of args) {
        /*/
        const properties = Object.getOwnPropertyNames(arg);

        for (let i = 0, l = properties.length; i < l; i++) {
            const property = properties[i];

            if (!dst[property]) {
                dst[property] = arg[property];
            }
        }
        */

        const keys = Reflect.ownKeys(arg);

        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            
            if (!Reflect.has(dst, key)) {
                Reflect.defineProperty(dst, key, Reflect.getOwnPropertyDescriptor(arg, key))
            }
        }
    }

    return dst;
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
    var v = new Float32Array(2);

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
    var v = new Float32Array(3);

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

function get(path, binary, onprogress) {
    var xhr = new XMLHttpRequest();

    var promise = new Promise(function (resolve, reject) {
        xhr.addEventListener("load", function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr);
            } else {
                reject(xhr);
            }
        });

        xhr.addEventListener("error", function () {
            reject(xhr);
        });

        if (onprogress) {
            xhr.addEventListener("progress", onprogress);
        }

        xhr.open("GET", path, true);

        if (binary) {
            xhr.responseType = "arraybuffer";
        }

        xhr.send();
    });

    return promise;
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
function GET(path, binary, onload, onerror, onprogress) {
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
    var hash = 0;

    for (var i = 0, l = s.length; i < l; i++) {
        hash = hash * 31 + s.charCodeAt(i);
        hash = hash & hash;
    }

    return hash;
};

Array.hashCode = function (a) {
    var hash = 0;

    for (var i = 0, l = a.length; i < l; i++) {
        var n = a[i];

        if (n === 0) {
            n = 1;
        }

        hash = hash * 31 + n;
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
        newObj = (object instanceof Array) ? [] : {};

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

/**
 * A shallow Array copy.
 *
 * @param {array} a The array to copy.
 * @returns {array} The copied array.
 */
Array.copy = function (array) {
    var newArray = [];

    for (var i = 0, l = array.length; i < l; i++) {
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

Array.areEqual = function (a, b) {
    if (a === b) {
        return true;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (var i = 0, l = a.length; i < l; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
};

Array.prototype.unique = function () {
    return this.reverse().filter(function (e, i, arr) {
        return arr.indexOf(e, i + 1) === -1;
    }).reverse();
}

String.prototype.reverse = function () {
    return [...this].reverse().join("");
};