import mix from '../../../common/mix';
import ModelHandler from '../../modelhandler';
import TexturedModelView from '../../texturedmodelview';
import Blp from '../blp/handler';
import Tga from '../tga/handler';
import Slk from '../slk/handler';
import NativeTexture from '../nativetexture/handler';
import MdxBucket from './bucket';
import MdxModel from './model';
import MdxModelInstance from './modelinstance';
import MdxShaders from './shaders';

const Mdx = {
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

    get extensions() {
        return [
            ['.mdx', true]
        ];
    },

    get Constructor() {
        return MdxModel;
    },

    get ModelView() {
        return TexturedModelView;
    },

    get Instance() {
        return MdxModelInstance;
    },

    get Bucket() {
        return MdxBucket;
    }
};

mix(Mdx, ModelHandler);

export default Mdx;
