import ModelView from './modelview';
import Model from './model';
import Bucket from './bucket';
import ModelInstance from './modelinstance';

export default {
  load(viewer) {
    let shader = viewer.loadShader('GeoStandardShader',
      viewer.sharedShaders.boneTexture + viewer.sharedShaders.instanceId + `
                uniform mat4 u_mvp;
                uniform vec2 u_uvOffset;
                uniform vec2 u_uvScale;

                attribute vec3 a_position;
                attribute vec2 a_uv;
                attribute vec2 a_uvScale;
                attribute vec4 a_color;

                varying vec2 v_uv;
                varying vec4 v_color;

                void main() {
                    v_uv = a_uv * u_uvScale + u_uvOffset;
                    v_color = a_color;

                    gl_Position = u_mvp * fetchMatrix(0.0, a_InstanceID) * vec4(a_position, 1.0);
                }
            `,
      `
                uniform sampler2D u_diffuseMap;
                uniform float u_alphaMod;
                uniform bool u_isEdge;
                uniform bool u_hasTexture;
                uniform bool u_isBGR;

                varying vec2 v_uv;
                varying vec4 v_color;

                void main() {
                    gl_FragColor = v_color;
      
                    if (u_hasTexture && !u_isEdge) {
                        vec4 texel = texture2D(u_diffuseMap, v_uv);

                        if (u_isBGR) {
                            texel = texel.bgra;
                        }

                        gl_FragColor *= texel;
                    } 
                }
            `
    );

    // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
    return shader.loaded;
  },

  extensions: [['.geo']],
  Constructor: Model,
  View: ModelView,
  Bucket: Bucket,
  Instance: ModelInstance,
};
