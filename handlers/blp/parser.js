const BlpParser = (function () {
    // Content type
    let CONTENT_JPEG = 0,
        CONTENT_PIXMAP = 1;

    // Pixmap type
    let PIXMAP_INDEXED = 1,
        PIXMAP_COMPRESSED_SAMPLE = 2,
        PIXMAP_BGRA = 3;


    function Parser(reader) {
        let version = readUint8(reader),
            content = readUint32(reader);

        this.version = version;
        this.content = content;

        if (version > 1) {
            this.pixmapType = readUint8(reader);
            this.alphaBits = readUint8(reader);
            this.sampleType = readUint8(reader);
            this.hasMipmaps = readUint8(reader);
        } else {
            this.alphaBits = readUint32(reader);
        }

        this.width = readUint32(reader);
        this.height = readUint32(reader);

        if (version < 2) {
            this.unknown = readUint32(reader);
            this.hasMipmaps = readUint32(reader);
        }

        if (version > 0) {
            this.mipmapOffsets = readUint32Array(reader, 16);
            this.mipmapSizes = readUint32Array(reader, 16);

            if (content === CONTENT_JPEG) {
                let jpegHeaderSize = readUint32(reader),
                    jpegHeader = readUint8Array(jpegHeaderSize);
            } else {
                let lutBGR = readUint8Array(1024);

            }
        }
    }
    

    Parser.prototype = {
        // Checks the parser for any errors that will not affect the viewer, but the texture when it is used in Warcraft 3.
        // For example, things that make the texture completely invalid and unloadable in the game, but work just fine in the viewer.
        sanityCheck() {
            let errors = [],
                warnings = [];

           
            return [errors, warnings];
        }
    };

    return (function (reader) {
        if (read(reader, 3) === "BLP") {
            return new Parser(reader);
        }
    });
}());
