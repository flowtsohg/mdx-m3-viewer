import mix from '../../../common/mix';
import { createTextureAtlas } from '../../../common/canvas';
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

        this.env = env;
        this.textureAtlases = {};

        return true;
    },

    loadTextureAtlas(name, textures, callback) {
        let env = this.env,
            textureAtlases = this.textureAtlases,
            atlas = textureAtlases[name];
        
        if (atlas) {
            callback(atlas);
        } else {
            // Promise that there is a future load that the code cannot know about yet, so Viewer.whenAllLoaded() isn't called prematurely.
            let promise = env.makePromise();

            // When all of the textures are loaded, it's time to construct a texture atlas
            env.whenLoaded(textures, () => {
                atlas = textureAtlases[name];

                // In case multiple models are loaded quickly, and this is called before the textures finished loading, this will stop multiple atlases from being created.
                if (atlas) {
                    callback(atlas);
                } else {
                    let atlasData = createTextureAtlas(textures.map((texture) => texture.imageData)),
                        atlas = { texture: env.load(atlasData.imageData), columns: atlasData.columns, rows: atlasData.rows };
                    
                    textureAtlases[name] = atlas;

                    callback(atlas);
                }

                // Resolve the promise.
                promise.resolve();
            });
        }
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
