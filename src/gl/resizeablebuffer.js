/**
 * @class
 * @classdesc A class that emulates a resizeable WebGL buffer.
 * @param {WebGLRenderingContext} gl The WebGL context.
 * @param {?number} size The initial buffer size. Defaults to 32.
 */
function ResizeableBuffer(gl, size) {
    let buffer = new ArrayBuffer(size || 32); // Arbitrary default size

    /** @member {WebGLRenderingContext} */
    this.gl = gl;
    /** @member {Uint8Array} */
    this.uint8array = new Uint8Array(buffer);
    /** @member {Float32Array} */
    this.float32array = new Float32Array(buffer);
    /** @member {WebGLBuffer} */
    this.buffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uint8array, gl.DYNAMIC_DRAW);
}

ResizeableBuffer.prototype = {
    get byteLength() {
        return this.uint8array.length;
    },

    /**
     * @method
     * @desc Binds this buffer to the array buffer target.
     * @param {?number} target The WebGL buffer target enum. Defaults to GL_ARRAY_BUFFER.
     */
    bind(target) {
        let gl = this.gl;

        gl.bindBuffer(target || gl.ARRAY_BUFFER, this.buffer);
    },

    /**
     * @method
     * @desc Resizes the internal buffer.
     * @param {number} size The requested size. Actual size is the closest power of two number, that is equal or bigger than size.
     */
    resize(size) {
        size = Math.powerOfTwo(size);

        let gl = this.gl,
            array = new Uint8Array(size),
            oldArray = this.uint8array;

        if (oldArray.byteLength <= size) {
            array.set(oldArray);
        } else {
            array.set(oldArray.subarray(0, size - 1));
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);

        this.uint8array = array;
        this.float32array = new Float32Array(array.buffer);
    },

    /**
     * @method
     * @desc Double the buffer size.
     */
    extend() {
        this.resize(this.uint8array.length << 1);
    },

    /**
     * @method
     * @desc Halve the buffer size.
     */
    reduce() {
        this.resize(this.uint8array.length >> 1);
    }
};
