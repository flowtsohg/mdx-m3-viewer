import Blp from '../blp/handler';
import Tga from '../tga/handler';
import Slk from '../slk/handler';
import NativeTexture from '../nativetexture/handler';
import MdxModel from './model';
import TexturedModelView from '../../texturedmodelview';
import MdxBucket from './bucket';
import MdxModelInstance from './modelinstance';
import MdxShaders from './shaders';

export default {
    initialize(env) {
        env.addHandler(Blp);
        env.addHandler(Tga);
        env.addHandler(Slk);
        env.addHandler(NativeTexture); // Needed for texture atlases

        let standardShader = env.webgl.createShaderProgram(env.sharedShaders.instanceId + env.sharedShaders.boneTexture + MdxShaders.vs_main, '#define STANDARD_PASS\n' + MdxShaders.ps_main);
        let particleShader = env.webgl.createShaderProgram(env.sharedShaders.decodeFloat + MdxShaders.vs_particles, MdxShaders.ps_particles);

        // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
        if (!standardShader.loaded || !particleShader.loaded) {
            return false;
        }

        env.shaderMap.set('MdxStandardShader', standardShader);
        env.shaderMap.set('MdxParticleShader', particleShader);

        return true;
    },

    extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
    constructor: MdxModel,
    view: TexturedModelView,
    bucket: MdxBucket,
    instance: MdxModelInstance
};
