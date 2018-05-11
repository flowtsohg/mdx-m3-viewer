import { vec3 } from 'gl-matrix';
import GenericObject from './genericobject';

// Heap allocations needed for this module.
let colorHeap = vec3.create(),
    ambientColorHeap = vec3.create();

export default class Light extends GenericObject {
    constructor(model, light, pivotPoints, index) {
        super(model, light, pivotPoints, index);

        this.type = light.type;
        this.attenuation = light.attenuation;
        this.color = light.color;
        this.intensity = light.intensity;
        this.ambientColor = light.ambientColor;
        this.ambientIntensity = light.ambientIntensity
    }

    getAttenuationStart(instance) {
        return this.getValue('KLAS', instance, this.attenuation[0]);
    }

    getAttenuationEnd(instance) {
        return this.getValue('KLAE', instance, this.attenuation[1]);
    }

    getIntensity(instance) {
        return this.getValue('KLAI', instance, this.intensity);
    }

    getColor(instance) {
        return this.getValue3(colorHeap, 'KLAC', instance, this.color);
    }

    getAmbientIntensity(instance) {
        return this.getValue('KLBI', instance, this.ambientIntensity);
    }

    getAmbientColor(instance) {
        return this.getValue3(ambientColorHeap, 'KLBC', instance, this.ambientColor);
    }
};
