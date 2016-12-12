/**
 * @class
 * @classdesc An event dispatcher. Not much else to say.
 */
function EventDispatcher() {
    /** @member {Map.<string, function>} */
    this.listeners = new Map();
}
 
EventDispatcher.prototype = {
    /**
     * @method
     * @desc Add a new event listener.
     * @param {string} type The event type.
     * @param {function} listener The event listener.
     * @returns this
     */
    addEventListener(type, listener) {
        let listeners = this.listeners;

        if (!listeners.has(type)) {
            listeners.set(type, []);
        }

        listeners.get(type).push(listener);

        return this;
    },
    
    /**
     * @method
     * @desc Remove an existing event listener.
     * @param {string} type The event type.
     * @param {function} listener The event listener.
     * @returns this
     */
    removeEventListener(type, listener) {
        let listeners = this.listeners.get(type);

        if (listeners) {
            let index = listeners.indexOf(listener);

            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }

        return this;
    },
    
    /**
     * @method
     * @desc Dispatch an event.
     * @param {object} event The event object.
     */
    dispatchEvent(event) {
        if (!event.target) {
            event.target = this;
        }

        let listeners = this.listeners.get(event.type);

        if (listeners) {
            // If the original array is looped, and a callback removes a listener (e.g. a self-removing listener), the iteration logic is broken.
            listeners = listeners.slice();

            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i].call(this, event);
            }
        }

        return this;
    }
};
