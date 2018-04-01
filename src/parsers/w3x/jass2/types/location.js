import JassAgent from './agent';

export default class JassLocation extends JassAgent {
    constructor(jassContext, x, y) {
        super(jassContext);

        this.x = x;
        this.y = y;
        this.z = 0;
    }
};
