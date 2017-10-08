import mix from '../../mix';
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

        let teamColors = [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]];
        
        this.teamColors = 14;

        let webgl = env.webgl,
            gl = env.gl;

        webgl.useShaderProgram(standardShader);

        for (let i = 0; i < 14; i++) {
            let color = teamColors[i];

            gl.uniform3fv(standardShader.uniforms.get('u_teamColors[' + i + ']'), [color[0] / 255, color[1] / 255, color[2] / 255]);
        }

        this.replaceableIdToName = {
            1: 'TeamColor/TeamColor00',
            2: 'TeamGlow/TeamGlow00',
            11: 'Cliff/Cliff0',
            21: '', // Used by all cursor models (HumanCursor, OrcCursor, UndeadCursor, NightElfCursor)
            31: 'LordaeronTree/LordaeronSummerTree',
            32: 'AshenvaleTree/AshenTree',
            33: 'BarrensTree/BarrensTree',
            34: 'NorthrendTree/NorthTree',
            35: 'Mushroom/MushroomTree',
            36: 'RuinsTree/RuinsTree',
            37: 'OutlandMushroomTree/MushroomTree'
        };

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
