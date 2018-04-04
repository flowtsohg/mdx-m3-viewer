import ObjModel from './model';
import ModelView from '../../modelview';
import Bucket from '../../bucket';
import ObjModelInstance from './modelinstance';

export default {
    initialize(viewer) {
        let shader = viewer.loadShader('ObjShader',
            'uniform mat4 u_mvp; uniform mat4 u_transform; attribute vec3 a_position; void main() { gl_Position = u_mvp * u_transform * vec4(a_position, 1.0); }',
            'uniform vec3 u_color; void main() { gl_FragColor = vec4(u_color, 1.0); }');

        // Returning false will not allow the handler to be added.
        // In this case, this should happen when the shader fails to compile.
        return shader.loaded;
    },

    extensions: [['.obj', 'text']],
    constructor: ObjModel,
    view: ModelView,
    bucket: Bucket,
    instance: ObjModelInstance
};
