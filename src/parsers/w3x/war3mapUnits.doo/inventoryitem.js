function InventoryItem(stream) {
    this.slot = 0;
    this.id = '\0\0\0\0';

    if (stream) {
        this.load(stream);
    }
}

InventoryItem.prototype = {
    load(stream) {
        this.slot = stream.readInt32();
        this.id = stream.read(4);
    },

    save(stream) {
        stream.writeInt32(this.slot);
        stream.write(this.id);
    }
};

export default InventoryItem;
