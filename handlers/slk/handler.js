const Slk = {
    get extension() {
        return ".slk";
    },

    get File() {
        return SlkFile;
    }
};

mix(Slk, FileHandler);
