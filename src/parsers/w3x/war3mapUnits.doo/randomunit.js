function RandomUnit(stream) {
    this.id = '\0\0\0\0'
    this.chance = 0;
 
    if (stream) {
        this.load(stream);
    }
 }
 
 RandomUnit.prototype = {
     load(stream) {
         this.id = stream.read(4);
         this.chance = stream.readInt32();
     },
 
     save(stream) {
         stream.write(this.id);
         stream.writeInt32(this.chance);
     }
 };

export default RandomUnit;
