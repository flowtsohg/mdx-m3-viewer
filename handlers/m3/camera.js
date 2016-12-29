function M3Camera(camera) {
    this.bone = camera.bone;
    this.name = camera.name.getAll().join("");

    /// TODO: Add animated getters, much like the Mdx structures.
    /*
    this.fieldOfView = new AnimationReference(reader, readFloat32);
    this.farClip = new AnimationReference(reader, readFloat32);
    this.nearClip = new AnimationReference(reader, readFloat32);
    this.clip2 = new AnimationReference(reader, readFloat32);
    this.focalDepth = new AnimationReference(reader, readFloat32);
    this.falloffStart = new AnimationReference(reader, readFloat32);
    this.falloffEnd = new AnimationReference(reader, readFloat32);
    this.depthOfField = new AnimationReference(reader, readFloat32);
    */
}
