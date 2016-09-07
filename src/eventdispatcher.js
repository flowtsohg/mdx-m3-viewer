function EventDispatcher() {
    this.listeners = [];
}
 
EventDispatcher.prototype = {
    addEventListener(type, listener) {
        const listeners = this.listeners;

        if (listeners[type] === undefined) {
            listeners[type] = [];
        }

        listeners[type].push(listener);

        return this;
    },
    
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
