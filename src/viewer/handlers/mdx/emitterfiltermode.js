export default function emitterFilterMode(filterMode, gl) {
    switch (filterMode) {
        // Blend
        case 0: return [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        // Additive
        case 1: return [gl.SRC_ALPHA, gl.ONE];
        // Modulate
        case 2: return [gl.ZERO, gl.SRC_COLOR];
        // Modulate 2X
        case 3: return [gl.DEST_COLOR, gl.SRC_COLOR];
        // Add Alpha
        case 4: return [gl.SRC_ALPHA, gl.ONE];
    }
};
