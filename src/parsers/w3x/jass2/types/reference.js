export default class JassReference {
    constructor(name, object) {
        this.name = name;
        this.object = object;
    }

    toString() {
        return this.name || this.object.toString();
    }
};
