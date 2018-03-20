let stringRegex = /STRING\s+(\d+)\s*{\s*([\s\S]+?)\s*}/g,
    newLineRegex = /\r\n/g,
    newLineLiteralRegex = /\\n/g;

export default class War3MapWts {
    /**
     * @param {?string} buffer 
     */
    constructor(buffer) {
        this.stringMap = new Map();

        if (buffer) {
            this.load(buffer);
        }
    }

    load(buffer) {
        buffer = buffer.substring(3); // ???

        let match;

        while ((match = stringRegex.exec(buffer))) {
            // praseInt to consistently support numbers such as 1 and 001.
            this.stringMap.set(parseInt(match[1]), match[2].replace(newLineRegex, '\\n'));
        }
    }

    save() {
        let buffer = 'ï»¿'; // ???
        
        for (let [key, value] in this.stringMap) {
            buffer += `STRING ${key}\n{\n${value.replace(newLineLiteralRegex, '\n')}\n}\n`
        }

        return buffer;
    }

    set(key, value) {
        this.stringMap.set(key, value);
    }

    get(key) {
        return this.stringMap.get(key);
    }
};
