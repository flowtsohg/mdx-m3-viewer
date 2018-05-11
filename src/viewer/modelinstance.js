import { EventNode } from './node';

/**
 * @constructor
 * @augments AsyncResource
 * @augments NotifiedNode
 * @param {Model} model
 */
export default class ModelInstance extends EventNode {
    constructor(model) {
        super();

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
         *  Set to true if this instance should always be rendered.
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

    updateAnimations() {

    }

    updateObject(scene) {
        if (!this.paused && this.model.loaded) {
            // Update animation timers.
            this.updateTimers();
            
            if (this.rendered) {
                let visible = scene.isVisible(this) || this.noCulling || this.model.viewer.noCulling;

                this.culled = !visible;
                
                if (visible) {
                    this.updateAnimations();
                }
            }
        }
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
