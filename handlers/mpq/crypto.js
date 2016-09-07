function MpqCrypto() {
    this.prepareCryptTable();
}

MpqCrypto.prototype = {
    prepareCryptTable() {
        let cryptTable = new Uint32Array(0x500),
            seed = 0x00100001,
            temp1,
            temp2;

        for (let index1 = 0; index1 < 0x100; index1++) {
            for (let index2 = index1, i = 0; i < 5; i++, index2 += 0x100) {
                seed = (seed * 125 + 3) % 0x2AAAAB;
                temp1 = (seed & 0xFFFF) << 0x10;

                seed = (seed * 125 + 3) % 0x2AAAAB;
                temp2 = (seed & 0xFFFF);

                cryptTable[index2] = temp1 | temp2;
            }
        }

        this.cryptTable = cryptTable;
    },

    hash(name, hashType) {
        let cryptTable = this.cryptTable,
            seed1 = 0x7FED7FED,
            seed2 = 0xEEEEEEEE,
            ch;

        name = name.toUpperCase();

        for (let i = 0; i < name.length ; i++) {
            ch = name.charCodeAt(i);

            seed1 = cryptTable[(hashType << 8) + ch] ^ (seed1 + seed2);
            seed2 = ch + seed1 + seed2 + (seed2 << 5) + 3;
        }

        // Convert the seed to an unsigned integer
        return seed1 >>> 0;
    },

    decryptBlock(buffer, key) {
        let cryptTable = this.cryptTable,
            seed = 0xEEEEEEEE,
            ch,
            view = new Uint32Array(buffer, 0, buffer.byteLength >>> 2);

        for (let i = 0, l = view.length; i < l; i++) {
            seed += cryptTable[0x400 + (key & 0xFF)];
            ch = view[i] ^ (key + seed);

            key = ((~key << 0x15) + 0x11111111) | (key >>> 0x0B);
            seed = ch + seed + (seed << 5) + 3;

            view[i] = ch;
        }

        return buffer;
    },

    encryptBlock(buffer, key) {
        let cryptTable = this.cryptTable,
            seed = 0xEEEEEEEE,
            ch,
            view = new Uint32Array(buffer, 0, buffer.byteLength >>> 2);

        for (let i = 0, l = view.length; i < l; i++) {
            seed += cryptTable[0x400 + (key & 0xFF)];
            ch = view[i] ^ (key + seed);

            key = ((~key << 0x15) + 0x11111111) | (key >>> 0x0B);
            seed = view[i] + seed + (seed << 5) + 3;

            view[i] = ch;
        }

        return buffer;
    }
};
