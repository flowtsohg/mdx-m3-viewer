const Mpq = {
    initialize() {
        Mpq.HASH_TABLE_KEY = 0xC3AF3770;
        Mpq.HASH_TABLE_INDEX = 0;
        Mpq.HASH_NAME_A = 1;
        Mpq.HASH_NAME_B = 2;

        Mpq.BLOCK_TABLE_KEY = 0xEC83B3A3;

        Mpq.HASH_FILE_KEY = 3;
        Mpq.FILE_COMPRESSED = 0x00000200;
        Mpq.FILE_ENCRYPTED = 0x00010000;
        Mpq.FILE_SINGLEUNIT = 0x0100000;
        Mpq.FILE_ADJUSTED_ENCRYPTED = 0x00020000;
        Mpq.FILE_EXISTS = 0x80000000;
        Mpq.FILE_DELETED = 0x02000000;
    },

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
