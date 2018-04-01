import GenericObject from './genericobject';

export default class CollisionShape extends GenericObject {
    constructor() {
        super(0x2000);

        /** @member {number} */
        this.type = -1;
        /** @member {Array<Float32Array>} */
        this.vertices = [new Float32Array(3), new Float32Array(3)];
        /** @member {number} */
        this.boundsRadius = 0;
    }

    readMdx(stream) {
        super.readMdx(stream);

        this.type = stream.readUint32();

        stream.readFloat32Array(this.vertices[0]);

        if (this.type !== 2) {
            stream.readFloat32Array(this.vertices[1]);
        }

        if (this.type === 2 || this.type === 3) {
            this.boundsRadius = stream.readFloat32();
        }
    }

    writeMdx(stream) {
        super.writeMdx(stream);

        stream.writeUint32(this.type);
        stream.writeFloat32Array(this.vertices[0]);

        if (this.type !== 2) {
            stream.writeFloat32Array(this.vertices[1]);
        }

        if (this.type === 2 || this.type === 3) {
            stream.writeFloat32(this.boundsRadius);
        }
    }

    readMdl(stream) {
        for (let token of super.readMdl(stream)) {
            if (token === 'Plane') {
                this.type = 0;
            } else if (token === 'Box') {
                this.type = 1;
            } else if (token === 'Sphere') {
                this.type = 2;
            } else if (token === 'Cylinder') {
                this.type = 3;
            } else if (token === 'Vertices') {
                let count = stream.readInt();

                stream.read(); // {

                stream.readFloatArray(this.vertices[0]);

                if (count === 2) {
                    stream.readFloatArray(this.vertices[1]);
                }

                stream.read(); // }
            } else if (token === 'BoundsRadius') {
                this.boundsRadius = stream.readFloat();
            } else {
                throw new Error(`Unknown token in CollisionShape: "${token}"`);
            }
        }
    }

    writeMdl(stream) {
        stream.startObjectBlock('CollisionShape', this.name);
        this.writeGenericHeader(stream);

        let type,
            vertices = 2,
            boundsRadius = false;

        if (this.type === 0) {
            type = 'Plane';
        } else if (this.type === 1) {
            type = 'Box';
        } else if (this.type === 2) {
            type = 'Sphere';
            vertices = 1;
            boundsRadius = true;
        } else if (this.type === 3) {
            type = 'Cylinder';
            boundsRadius = true;
        }

        stream.writeFlag(type);
        stream.startBlock('Vertices', vertices);
        stream.writeArray(this.vertices[0]);

        if (vertices === 2) {
            stream.writeArray(this.vertices[1]);
        }

        stream.endBlock();

        if (boundsRadius) {
            stream.writeAttrib('BoundsRadius', this.boundsRadius);
        }

        this.writeGenericAnimations(stream);
        stream.endBlock();
    }

    getByteLength() {
        let size = 16 + super.getByteLength();

        if (this.type !== 2) {
            size += 12;
        }

        if (this.type === 2 || this.type === 3) {
            size += 4;
        }

        return size;
    }
};
