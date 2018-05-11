import Blp from '../blp/handler';
import Tga from '../tga/handler';
import Slk from '../slk/handler';
import NativeTexture from '../nativetexture/handler';
import Model from './model';
import ModelView from './modelview';
import Bucket from './bucket';
import ModelInstance from './modelinstance';
import shaders from './shaders';

export default {
    load(viewer) {
        viewer.addHandler(Blp);
        viewer.addHandler(Tga);
        viewer.addHandler(Slk);
        viewer.addHandler(NativeTexture);

        let shared = viewer.sharedShaders,
            standardShader = viewer.loadShader('MdxStandardShader', shared.instanceId + shared.boneTexture + shaders.vs_main, '#define STANDARD_PASS\n' + shaders.ps_main),
            particleShader = viewer.loadShader('MdxParticleShader', shared.decodeFloat + shaders.vs_particles, shaders.ps_particles);

        // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
        return standardShader.loaded && particleShader.loaded;
    },

    extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
    constructor: Model,
    view: ModelView,
    bucket: Bucket,
    instance: ModelInstance
};
