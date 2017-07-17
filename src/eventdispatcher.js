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

            // If the original array is looped, and a callback removes a listener (e.g. a self-removing listener), the iteration logic is broken.
            // Therefore, the array is cloned, and the clone is iterated instead.
            // This isn't ideal, however I don't have a fix yet.
            // Iterating backwards breaks listener logic (listeners have to be called in the order they were registered).
            listeners = listeners.slice();

            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i].call(this, event);
            }
        }

        return this;
    }
};

module.exports = EventDispatcher;
