function M3StandardMaterial(model, material) {
    this.model = model;
    this.gl = model.env.gl;

    this.name = material.name.getAll();
    this.specialFlags = material.specialFlags;
    this.flags = material.flags;
    this.blendMode = material.blendMode;
    this.priority = material.priority;
    this.specularity = material.specularity;
    this.specMult = material.specMult;
    this.emisMult = material.emisMult;
    this.layerBlendType = material.layerBlendType;
    this.emisBlendType = material.emisBlendType;
    this.emisMode = material.emisMode;
    this.doubleSided = material.flags & 0x8;

    this.layers = [
        new M3Layer(this, material.diffuseLayer.get(), "diffuse", 2),
        new M3Layer(this, material.decalLayer.get(), "decal", 2),
        new M3Layer(this, material.specularLayer.get(), "specular", 2),
        new M3Layer(this, material.glossLayer.get(), "gloss", 2),
        new M3Layer(this, material.emissiveLayer.get(), "emissive", material.emisBlendType),
        new M3Layer(this, material.emissive2Layer.get(), "emissive2", material.emisMode),
        new M3Layer(this, material.evioLayer.get(), "evio", 2),
        new M3Layer(this, material.evioMaskLayer.get(), "evioMask", 2),
        new M3Layer(this, material.alphaMaskLayer.get(), "alphaMask", 2),
        new M3Layer(this, material.alphaMask2Layer.get(), "alphaMask2", 2),
        new M3Layer(this, material.normalLayer.get(), "normal", 2),
        new M3Layer(this, material.heightLayer.get(), "heightMap", 2),
        new M3Layer(this, material.lightMapLayer.get(), "lightMap", 2),
        new M3Layer(this, material.ambientOcclusionLayer.get(), "ao", 2)
    ];
}

M3StandardMaterial.prototype = {
    bindCommon() {
        const gl = this.gl;

        if (this.blendMode === 1) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);
        } else if (this.blendMode === 2) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);
        } else {
            gl.disable(gl.BLEND);
        }

        if (this.doubleSided) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
        }

        // Not sure why it was disabled, or when to disable it
        gl.enable(gl.DEPTH_TEST);
    },

    bind(shader) {
        const gl = this.gl;

        this.bindCommon();

        gl.uniform1f(shader.uniforms.get("u_specularity"), this.specularity);
        gl.uniform1f(shader.uniforms.get("u_specMult"), this.specMult);
        gl.uniform1f(shader.uniforms.get("u_emisMult"), this.emisMult);
        gl.uniform4fv(shader.uniforms.get("u_lightAmbient"), [0.02, 0.02, 0.02, 0]);

        const layers = this.layers;

        layers[0].bind(shader);
        layers[1].bind(shader);
        layers[2].bind(shader);
        layers[4].bind(shader);
        layers[5].bind(shader);
        layers[10].bind(shader);
        layers[12].bind(shader);
    },

    unbind(shader) {
        const gl = this.gl;

        gl.disable(gl.BLEND);
        gl.enable(gl.CULL_FACE);

        const layers = this.layers;

        layers[0].unbind(shader);
        layers[1].unbind(shader);
        layers[2].unbind(shader);
        layers[4].unbind(shader);
        layers[5].unbind(shader);
        layers[10].unbind(shader);
        layers[12].unbind(shader);
    },

    bindDiffuse(shader) {
        this.bindCommon();

        this.layers[0].bind(shader);
    },

    bindSpecular(shader) {
        const gl = this.gl;

        this.bindCommon();

        gl.uniform1f(shader.uniforms.get("u_specularity"), this.specularity);
        gl.uniform1f(shader.uniforms.get("u_specMult"), this.specMult);

        this.layers[2].bind(shader);
    },

    bindNormalMap(shader) {
        this.bindCommon();

        this.layers[10].bind(shader);
    },

    bindEmissive(shader) {
        this.bindCommon();

        this.gl.uniform1f(shader.uniforms.get("u_emisMult"), this.emisMult);

        this.layers[4].bind(shader);
        this.layers[5].bind(shader);
    },

    bindDecal(shader) {
        this.bindCommon();

        this.layers[1].bind(shader);
    }
};
