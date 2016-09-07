const W3x = {
    initialize(env) {
        env.addHandler(Mpq);
        env.addHandler(Slk);
        env.addHandler(Geometry);
        env.addHandler(Mdx);
        env.addHandler(Blp);
    },

    get extension() {
        return ".w3x|.w3m";
    },

    get File() {
        return W3xMap;
    },

    get binaryFormat() {
        return true;
    }
};

mix(W3x, FileHandler);
