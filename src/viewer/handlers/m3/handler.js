import Dds from '../dds/handler';
import Tga from '../tga/handler';
import M3Model from './model';
import TexturedModelView from '../../texturedmodelview';
import M3Bucket from './bucket';
import M3ModelInstance from './modelinstance';
import M3Shaders from './shaders';

function initializeTeamColors(viewer, shader) {
    let webgl = viewer.webgl,
        gl = viewer.gl,
        teamColors = [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]];

    webgl.useShaderProgram(shader);

    for (let i = 0; i < 14; i++) {
        let color = teamColors[i];

        gl.uniform3fv(shader.uniforms.get('u_teamColors[' + i + ']'), [color[0] / 255, color[1] / 255, color[2] / 255]);
    }
}

export default {
    initialize(viewer) {
        viewer.addHandler(Dds);
        viewer.addHandler(Tga);

        let shared = viewer.sharedShaders;

        for (let i = 0; i < 4; i++) {
            let shader = viewer.loadShader('M3StandardShader' + i,
                '#define EXPLICITUV' + i + '\n' + shared.instanceId + shared.boneTexture + M3Shaders.vs_common + M3Shaders.vs_main,
                '#define STANDARD_PASS\n' + M3Shaders.ps_common + M3Shaders.ps_main);

            // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
            if (!shader.loaded) {
                return false;
            }

            initializeTeamColors(viewer, shader);
        }

        return true;
    },

    extensions: [['.m3', 'arrayBuffer']],
    constructor: M3Model,
    view: TexturedModelView,
    bucket: M3Bucket,
    instance: M3ModelInstance,
    lightPosition: new Float32Array([0, 0, 10000])
};
