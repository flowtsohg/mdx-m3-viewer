function M3ModelView(model) {
    ModelView.call(this, model);

    this.textures = [];
}

mix(MdxModelView.prototype, ModelView.prototype);
