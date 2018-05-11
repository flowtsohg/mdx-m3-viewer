import Resource from '../../resource';
import SlkParser from '../../../parsers/slk/file';

export default class SlkFile extends Resource {
    /**
     * @param {Object} resourceData
     */
    constructor(resourceData) {
        super(resourceData);

        this.file = null;
    }

    load(src) {
        this.file = new SlkParser(src);
    }

    getRow(key) {
        return this.file.getRowByKey(key);
    }
};
