/**
 * @constructor
 */
function EventDispatcher() {
    /** @member {Map<string, function(Event)>} */
    this.listeners = new Map();
}
 
EventDispatcher.prototype = {
    /**
     * Add a new event listener.
     * 
     * @param {string} type The event type.
     * @param {function(Event)} listener The event listener to add.
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
     * Remove an existing event listener.
     * 
     * @param {string} type The event type.
     * @param {function(Event)} listener The event listener to remove.
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
     * Dispatch an event.
     * 
     * @param {object} event The event object to dispatch.
     */
    dispatchEvent(event) {
        let listeners = this.listeners.get(event.type);

        if (listeners) {
            if (!event.target) {
                event.target = this;
            }

            // Looping backwards, in case of a self-removing listener.
            // If the loop would go forwards and a listener removes itself, the iteration logic breaks.
            let i = listeners.length;

            while (i--) {
                listeners[i].call(this, event);
            }
        }

        return this;
    }
};

module.exports = EventDispatcher;
