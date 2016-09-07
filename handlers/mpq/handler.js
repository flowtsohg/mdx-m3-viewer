const Mpq = {
    get extension() {
        return ".mpq";
    },

    get File() {
        return MpqArchive;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Mpq, FileHandler);
