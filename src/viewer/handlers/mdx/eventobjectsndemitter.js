import SharedEmitter from './sharedemitter';

export default class EventObjectSndEmitter extends SharedEmitter {
    constructor(modelObject) {
        super(modelObject);

        this.type = 'SND';
    }

    emit(emitterView) {

    }
};
