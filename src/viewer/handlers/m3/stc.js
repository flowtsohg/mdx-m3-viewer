import M3SdContainer from './sd';

export default class M3Stc {
    /**
     * @param {M3ParserStc} stc
     */
    constructor(stc) {
        const animIds = stc.animIds.getAll();

        this.name = stc.name.getAll().join('');
        this.runsConcurrent = stc.runsConcurrent;
        this.priority = stc.priority;
        this.stsIndex = stc.stsIndex;

        const animRefs = new Uint16Array(stc.animRefs.getAll().buffer);

        this.animRefs = [];

        // Allows direct checks instead of loops
        for (let i = 0, l = animIds.length; i < l; i++) {
            this.animRefs[animIds[i]] = [animRefs[i * 2 + 1], animRefs[i * 2]];
        }

        this.sd = stc.sd.map((sd) => new M3SdContainer(sd.getAll()));
    }

    getValueUnsafe(animRef, instance) {
        const ref = this.animRefs[animRef.animId];

        if (ref) {
            return this.sd[ref[0]].getValueUnsafe(ref[1], animRef, instance.frame, this.runsConcurrent);
        }

        return animRef.initValue;
    }
};
