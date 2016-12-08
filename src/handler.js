const Handler = {
    // Will be called when adding the handler to the viewer, with env being the viewer itself
    initialize(env) {
        return true;
    },

    get objectType() {
        throw new Error("Handler.objectType must be overriden!");
    },

    // The file extension as a string, e.g. ".png", or if it handles multiple extensions - ".png|.jpg"
    get extension() {
        throw new Error("Handler.extension must be overriden!");
    },

    // The main implementation object that this handler handles.
    // E.g. the model constructor for a model handler.
    get Constructor() {
        throw new Error("Handler.Constructor must be overriden!");
    },

    get binaryFormat() {
        return false;
    }
};
