import Resource from './resource';

export default class PromiseResource extends Resource {
    resolve() {
        this.finalizeLoad();
    }
};
