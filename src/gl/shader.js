function ShaderUnit(gl, src, type, hash) {
    const id = gl.createShader(type);

    this.loaded = false;
    this.webglResource = id;
    this.src = src;
    this.shaderType = type;
    this.hash = hash;

    gl.shaderSource(id, src);
    gl.compileShader(id);

    if (gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
        this.loaded = true;
    } else {
        let error = gl.getShaderInfoLog(id),
            lines = src.split("\n");

        console.log(error);

        let regex = /:(\d+):/g,
            lineNumber = regex.exec(error);

        while (lineNumber) {
            const integer = parseInt(lineNumber[1]);

            console.error(integer + ": " + lines[integer - 1]);

            lineNumber = regex.exec(error);
        }
    }
}

function ShaderProgram(gl, vertexShader, fragmentShader) {
    const id = gl.createProgram(),
        uniforms = new Map(),
        attribs = new Map();

    this.loaded = false;
    this.webglResource = id;
    this.shaders = [vertexShader, fragmentShader];
    this.uniforms = uniforms;
    this.attribs = attribs;

    gl.attachShader(id, vertexShader.webglResource);
    gl.attachShader(id, fragmentShader.webglResource);
    gl.linkProgram(id);

    if (gl.getProgramParameter(id, gl.LINK_STATUS)) {
        for (let i = 0, l = gl.getProgramParameter(id, gl.ACTIVE_UNIFORMS) ; i < l; i++) {
            const object = gl.getActiveUniform(id, i),
                location = gl.getUniformLocation(id, object.name);

            uniforms.set(object.name, location);

            if (object.name.endsWith("[0]")) {
                let base = object.name.substr(0, object.name.length - 3),
                    index = 1,
                    name = base + "[" + index + "]",
                    location = gl.getUniformLocation(id, name);

                while (location) {
                    uniforms.set(name, location);

                    index += 1;
                    name = base + "[" + index + "]",
                    location = gl.getUniformLocation(id, name);
                }
            }
        }

        for (let i = 0, l = gl.getProgramParameter(id, gl.ACTIVE_ATTRIBUTES) ; i < l; i++) {
            const object = gl.getActiveAttrib(id, i),
                location = gl.getAttribLocation(id, object.name);

            attribs.set(object.name, location);

            if (object.name.endsWith("[0]")) {
                let base = object.name.substr(0, object.name.length - 3),
                    index = 1,
                    name = base + "[" + index + "]",
                    location = gl.getAttribLocation(id, name);

                while (location) {
                    attribs.set(name, location);

                    index += 1;
                    name = base + "[" + index + "]",
                    location = gl.getAttribLocation(id, name);
                }
            }
        }
           
        this.loaded = true;
    } else {
        console.warn(gl.getProgramInfoLog(id));
    }
}
