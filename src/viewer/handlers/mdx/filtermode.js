export function layerFilterMode(filterMode, gl) {
    switch (filterMode) {
        // Blend
        case 2: return [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        // Additive
        case 3: return [gl.ONE, gl.ONE];
        // Add alpha
        case 4: return [gl.SRC_ALPHA, gl.ONE];
        // Modulate
        case 5: return [gl.ZERO, gl.SRC_COLOR];
        // Modulate 2X
        case 6: return [gl.DST_COLOR, gl.SRC_COLOR];
    }
};

export function emitterFilterMode(filterMode, gl) {
    switch (filterMode) {
        // Blend
        case 0: return [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        // Add alpha
        case 1: return [gl.SRC_ALPHA, gl.ONE];
        // Modulate
        case 2: return [gl.ZERO, gl.SRC_COLOR];
        // Modulate 2X
        case 3: return [gl.DEST_COLOR, gl.SRC_COLOR];
        // Add alpha
        case 4: return [gl.SRC_ALPHA, gl.ONE];
    }
};
