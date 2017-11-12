import BinaryStream from '../../../common/binarystream';
import Region from './region';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapW3r(buffer) {
   this.version = 0;
   this.regions = [];

   if (buffer) {
       this.load(buffer);
   }
}

War3MapW3r.prototype = {
   load(buffer) {
       let stream = new BinaryStream(buffer);

       this.version = stream.readInt32();

       for (let i = 0, l = stream.readUint32(); i < l; i++) {
           this.regions[i] = new Region(stream);
       }
   },

   save() {
       let buffer = new ArrayBuffer(this.calcSize()),
           stream = new BinaryStream(buffer);

       stream.writeInt32(this.version);
       stream.writeUint32(this.regions.length);

       for (let region of this.regions) {
           region.save(stream);
       }

       return buffer;
   },

   calcSize() {
       let size = 8;

       for (let regions of this.regions) {
           size += regions.calcSize();
       }

       return size;
   }
};

export default War3MapW3r;
