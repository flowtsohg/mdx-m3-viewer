const Slk = {
    get extension() {
        return ".slk";
    },

    get Constructor() {
        return SlkFile;
    }
};

mix(Slk, FileHandler);
