import animationMap from './animationmap';

/**
 * The parent class for all objects that have animated data in them.
 */
export default class AnimatedObject {
    constructor() {
        /** @member {Array<Animation>} */
        this.animations = [];
    }

    readAnimations(stream, size) {
        while (size > 0) {
            let name = stream.read(4),
                animation = new animationMap[name][1]();
    
            animation.readMdx(stream, name);
    
            size -= animation.getByteLength();
    
            this.animations.push(animation);
        }
    }

    writeAnimations(stream) {
        for (let animation of this.animations) {
            animation.writeMdx(stream);
        }
    }

    // A wrapper around readBlock() which merges static tokens.
    // E.g.: static Color
    // This makes the condition blocks in the parent objects linear and simple.
    *readAnimatedBlock(stream) {
        for (let token of stream.readBlock()) {
            if (token === 'static') {
                yield `static ${stream.read()}`
            } else {
                yield token;
            }
        }
    }

    readAnimation(stream, token) {
        let animation = new animationMap[token][1]();

        animation.readMdl(stream, token);

        this.animations.push(animation);
    }

    writeAnimation(stream, name) {
        for (let animation of this.animations) {
            if (animation.name === name) {
                animation.writeMdl(stream, animationMap[name][0]);
                return true;
            }
        }
    
        return false;
    }

    getByteLength() {
        let size = 0;

        for (let animation of this.animations) {
            size += animation.getByteLength();
        }

        return size;
    }
};
