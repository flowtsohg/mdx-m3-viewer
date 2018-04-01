import JassAgent from './agent';

export default class JassRegion extends JassAgent {
    constructor(jassContext, minx, miny, maxx, maxy) {
        super(jassContext);

        this.rects = new Set();
    }
};
