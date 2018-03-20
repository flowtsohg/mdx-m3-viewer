import { eachAnimation, readAnimation, writeAnimation } from './animations';

/**
 * The parent class for all objects that have animated data in them.
 */
export default class AnimatedObject {
    constructor() {
        /** @member {Array<Animation>} */
        this.animations = [];
    }

    readAnimations(stream, size) {
        for (let animation of eachAnimation(stream, size)) {
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
        this.animations.push(readAnimation(stream, token));
    }

    writeAnimation(stream, name) {
        return writeAnimation(stream, this.animations, name);
    }

    getByteLength() {
        let size = 0;

        for (let animation of this.animations) {
            size += animation.getByteLength();
        }

        return size;
    }
};
