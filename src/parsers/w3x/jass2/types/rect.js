import JassAgent from './agent';

export default class JassRect extends JassAgent {
	constructor(jassContext, minx, miny, maxx, maxy) {
        super(jassContext);
        
        this.center = new Float32Array([maxx - minx, maxy - miny]);
        this.min = new Float32Array([minx, miny]);
        this.max = new Float32Array([maxx, maxy]);
	}
};
