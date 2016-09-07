const Handler = {
    // Will be called when adding the handler to the viewer, with env being the viewer itself
    initialize(env) {

    },

    get objectType() {
        throw "Handler.objectType must be overriden!";
    },

    // The file extension as a string, e.g. ".png", or if it handles multiple extensions - ".png|.jpg"
    get extension() {
        throw "Handler.extension must be overriden!";
    },

    get binaryFormat() {
        return false;
    }
};
