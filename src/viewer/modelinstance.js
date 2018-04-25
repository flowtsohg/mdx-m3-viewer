import Resource from './resource';
import { NotifiedNodeMixin } from './node';

/**
 * @constructor
 * @augments AsyncResource
 * @augments NotifiedNode
 * @param {Model} model
 */
export default class ModelInstance extends NotifiedNodeMixin(Resource) {
    constructor(model) {
        super(model.env);

        this.dontInheritScaling = true;

        /** @member {?ModelView} */
        this.modelView = null;
        /** @member {Model} */
        this.model = model;
        /** @member {boolean} */
        this.paused = false;
        /** @member {boolean} */
        this.rendered = true;
        /** @member {boolean} */
        this.culled = false;
        /** 
         *  Set to true if the model should always be rendered.
         * 
         * @member {boolean}
         */
        this.noCulling = false;
    }

    show() {
        this.rendered = true;
    }

    hide() {
        this.rendered = false;
    }

    shown() {
        return this.rendered;
    }

    hidden() {
        return !this.rendered;
    }

    /**
     * Detach this instance from the scene it's in.
     * 
     * @returns {boolean}
     */
    detach() {
        if (this.scene) {
            return this.scene.removeInstance(this);
        }

        return false;
    }

    updateTimers() {

    }

    update() {

    }

    modelReady() {
        if (this.model.loaded) {
            this.loaded = true;

            this.initialize();

            this.dispatchEvent({ type: 'load' });
        } else {
            this.error = true;

            this.dispatchEvent({ type: 'error', error: 'InvalidModel' });
        }

        this.dispatchEvent({ type: 'loadend' });
    }

    /**
     * Sets the scene of this instance.
     * This is equivalent to scene.addInstance(instance).
     * 
     * @param {ModelViewer.viewer.Scene} scene 
     * @returns {boolean} 
     */
    setScene(scene) {
        return scene.addInstance(this);
    }
};
