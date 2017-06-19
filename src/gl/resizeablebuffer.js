/**
 * @constructor
 * @param {WebGLRenderingContext} gl
 * @param {number=} size
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
    /**
     * Get the byte length of this buffer.
     */
    get byteLength() {
        return this.uint8array.length;
    },

    /**
     * Binds this buffer to the array buffer target.
     * 
     * @param {?number} target The WebGL buffer target enum. Defaults to GL_ARRAY_BUFFER.
     */
    bind(target) {
        let gl = this.gl;

        gl.bindBuffer(target || gl.ARRAY_BUFFER, this.buffer);
    },

    /**
     * Resizes the internal buffer.
     * 
     * @param {number} size The requested size. Actual size is the closest power of two number, that is equal or bigger than size.
     */
    resize(size) {
        size = Math.powerOfTwo(size);

        // Only bother resizing if the size isn't the same.
        if (size !== this.byteLength) {
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
        }
    },

    /**
     * If size is bigger than the current buffer size, resize.
     * 
     * @param {number} size
     */
    grow(size) {
        if (this.byteLength < size) {
            this.resize(size);
        }
    }
};
