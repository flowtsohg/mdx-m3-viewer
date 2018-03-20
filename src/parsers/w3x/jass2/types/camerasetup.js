import JassHandle from './handle';
import JassLocation from './location';

export default class JassCameraSetup extends JassHandle {
	constructor(jassContext, whichRect, effectId) {
        super(jassContext);
        
        this.targetDistance = 0;
        this.farZ = 0;
        this.angleOfAttack = 0;
        this.fieldOfView = 0;
        this.roll = 0;
        this.rotation = 0;
        this.zOffset = 0;
        this.destPosition = new JassLocation(jassContext, 0, 0);
	}
};
