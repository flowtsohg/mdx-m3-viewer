/**
 * @class
 * @classdesc An event dispatcher. Not much else to say.
 */
function EventDispatcher() {
    /** @member {array} */
    this.listeners = [];
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
        const listeners = this.listeners;

        if (listeners[type] === undefined) {
            listeners[type] = [];
        }

        listeners[type].push(listener);

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
        const listeners = this.listeners[type];

        if (listeners !== undefined) {
            for (let i = 0, l = listeners.length; i < l; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    return;
                }
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

        const listeners = this.listeners[event.type];

        if (listeners !== undefined) {
            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i].call(this, event);
            }
        }
    }
};
