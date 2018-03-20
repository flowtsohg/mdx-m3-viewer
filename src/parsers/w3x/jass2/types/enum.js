import JassHandle from './handle';

export default class JassEnum extends JassHandle {
    constructor(jassContext, value) {
        super(jassContext);

        this.handleId = value;
    }
};
