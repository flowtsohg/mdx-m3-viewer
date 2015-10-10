function EventDispatcher() {
    this.listeners = [];
}
 
EventDispatcher.prototype = {
    addEventListener: function (type, listener) {
        var listeners = this.listeners;

        if (listeners[type] === undefined){
            listeners[type] = [];
        }

        listeners[type].push(listener);
    },
    
    removeEventListener: function (type, listener) {
        var listeners = this.listeners;

        if (listeners[type] !== undefined) {
            var _listeners = listeners[type];
            
            for (var i = 0, l = _listeners.length; i < l; i++) {
                if (_listeners[i] === listener) {
                    _listeners.splice(i, 1);
                    return;
                }
            }
        }
    },
    
    dispatchEvent: function (event) {
        if (typeof event === "string") {
            event = {type: event};
        }
        
        if (!event.target) {
            event.target = this;
        }

        if (!event.type) {
            return;
        }

        var listeners = this.listeners;

        if (listeners[event.type] !== undefined) {
            var _listeners = listeners[event.type];
            
            for (var i = 0, l = _listeners.length; i < l; i++) {
                _listeners[i].call(this, event);
            }
        }
    }
};