function ResizeableBuffer(gl) {
    const arraybuffer = new ArrayBuffer(32); // Arbitrary initial size

    this.gl = gl;
    this.uint8array = new Uint8Array(arraybuffer);
    this.float32array = new Float32Array(arraybuffer);
    this.buffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uint8array, gl.DYNAMIC_DRAW);
}

ResizeableBuffer.prototype = {
    get byteLength() {
        return this.uint8array.length;
    },

    bind() {
        const gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    },

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

    extend() {
        this.resize(this.uint8array.length << 1);
    },

    reduce() {
        this.resize(this.uint8array.length >> 1);
    }
};
