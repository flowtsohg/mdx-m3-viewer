import Blp from '../blp/handler';
import Tga from '../tga/handler';
import Slk from '../slk/handler';
import NativeTexture from '../nativetexture/handler';
import MdxModel from './model';
import MdxModelView from './modelview';
import MdxBucket from './bucket';
import MdxModelInstance from './modelinstance';
import MdxShaders from './shaders';

export default {
    initialize(viewer) {
        viewer.addHandler(Blp);
        viewer.addHandler(Tga);
        viewer.addHandler(Slk);
        viewer.addHandler(NativeTexture);

        let shared = viewer.sharedShaders,
            standardShader = viewer.loadShader('MdxStandardShader', shared.instanceId + shared.boneTexture + MdxShaders.vs_main, '#define STANDARD_PASS\n' + MdxShaders.ps_main),
            particleShader = viewer.loadShader('MdxParticleShader', shared.decodeFloat + MdxShaders.vs_particles, MdxShaders.ps_particles);

        // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
        return standardShader.loaded && particleShader.loaded;
    },

    extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
    constructor: MdxModel,
    view: MdxModelView,
    bucket: MdxBucket,
    instance: MdxModelInstance
};
