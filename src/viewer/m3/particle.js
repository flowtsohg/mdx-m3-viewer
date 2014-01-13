// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Particle() {

}

Particle.prototype = {
	reset: function (emitter, model) {
		this.alive = true;
		this.health = model.getValue(emitter.lifespan1);
		this.size = model.getValue(emitter.particleSizes1);
		this.position = [0, 0, 1];
		
		math.mat4.multVec3(model.skeleton.bones[emitter.bone].worldMatrix,this.position, this.position);
	},
	
	update: function () {
		this.health -= FRAME_TIME * ANIMATION_SCALE;
	},
};