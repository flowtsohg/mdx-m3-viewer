/**
 * @constructor
 * @param {M3Model} model
 * @param {M3ParserBone} bone
 */
function M3Bone(model, bone) {
    let flags = bone.flags;

    mix(this, bone);

    this.inhertTranslation = flags & 0x1;
    this.inheritScale = flags & 0x2;
    this.inheritRotation = flags & 0x4;
    this.billboard1 = flags & 0x10;
    this.billboard2 = flags & 0x40;
    this.twoDProjection = flags & 0x100;
    this.animated = flags & 0x200;
    this.inverseKinematics = flags & 0x400;
    this.skinned = flags & 0x800;
    this.real = flags & 0x2000;
}
