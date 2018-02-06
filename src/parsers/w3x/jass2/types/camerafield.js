import JassHandle from './handle';

export default class JassCameraField extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'CAMERA_FIELD_TARGET_DISTANCE';
            case 1: return 'CAMERA_FIELD_FARZ';
            case 2: return 'CAMERA_FIELD_ANGLE_OF_ATTACK';
            case 3: return 'CAMERA_FIELD_FIELD_OF_VIEW';
            case 4: return 'CAMERA_FIELD_ROLL';
            case 5: return 'CAMERA_FIELD_ROTATION';
            case 6: return 'CAMERA_FIELD_ZOFFSET';
        }
    }
};
