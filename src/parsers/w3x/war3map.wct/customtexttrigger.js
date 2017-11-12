function CustomTextTrigger(stream) {
    this.text = '';

    if (stream) {
        this.load(stream);
    }
}

CustomTextTrigger.prototype = {
    load(stream) {
        let textLength = stream.readInt32();
        
        if (textLength) {
            this.text = stream.read(textLength - 1);
            stream.skip(1);
        }
    },

    save(stream) {
        let text = this.text;

        if (text.length) {
            stream.writeInt32(this.text.length + 1);
            stream.write(`${this.text}\0`);
        } else {
            stream.writeInt32(0);
        }
    },

    calcSize() {
        let size = 4,
            textLength = this.text.length;

        if (textLength) {
            size += textLength + 1;
        }

        return size;
    }
};

export default CustomTextTrigger;
