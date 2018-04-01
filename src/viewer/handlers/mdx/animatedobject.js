import { vec3, quat } from 'gl-matrix';
import MdxSd from './sd';

export default class AnimatedObject {
    /**
     * @param {MdxModel} model
     * @param {MdxParserNode} node
     */
    constructor(model, object) {
        this.model = model;
        this.animations = {};

        for (let animation of object.animations) {
            this.animations[animation.name] = new MdxSd(model, animation);
        }
    }

    getValues(name) {
        let animation = this.animations[name];

        if (animation) {
            return animation.getValues();
        }

        return [];
    }

    getValueUnsafe(name, instance, defval) {
        let animation = this.animations[name];

        if (animation) {
            return animation.getValueUnsafe(instance);
        }

        return defval;
    }

    getValue(name, instance, defval) {
        return this.getValueUnsafe(name, instance, defval);
    }

    getValue3(out, name, instance, defval) {
        let unsafeHeap = this.getValueUnsafe(name, instance, defval);

        out[0] = unsafeHeap[0];
        out[1] = unsafeHeap[1];
        out[2] = unsafeHeap[2];

        return out;
    }

    getValue4(out, name, instance, defval) {
        let unsafeHeap = this.getValueUnsafe(name, instance, defval);

        out[0] = unsafeHeap[0];
        out[1] = unsafeHeap[1];
        out[2] = unsafeHeap[2];
        out[3] = unsafeHeap[3];

        return out;
    }

    getKeyframe(name, instance) {
        let animation = this.animations[name];

        if (animation) {
            return animation.getKeyframe(instance);
        }

        return 0;
    }

    isVariant(name, sequence) {
        let animation = this.animations[name];

        if (animation) {
            return animation.isVariant(sequence);
        }

        return false;
    }
};
