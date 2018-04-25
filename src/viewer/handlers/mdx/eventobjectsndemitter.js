import MdxSharedEmitter from './sharedemitter';

export default class MdxEventObjectSndEmitter extends MdxSharedEmitter {
    /**
     * @param {MdxModelEventObject} modelObject
     */
    constructor(modelObject) {
        super(modelObject);

        this.type = 'SND';
    }

    fill(emitterView, scene) {

    }

    emit(emitterView) {

    }
};
