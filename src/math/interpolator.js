const Interpolator = {
    heap3: vec3.create(),
    heap4: quat.create(),

    scalar(a, b, c, d, t, type) {
        if (type === 0) {
            return a;
        } else if (type === 1) {
            return Math.lerp(a, d, t);
        } else if (type === 2) {
            return Math.hermite(a, b, c, d, t);
        } else if (type === 3) {
            return Math.bezier(a, b, c, d, t);
        }

        return 0;
    },

    vector(out, a, b, c, d, t, type) {
        if (type === 0) {
            return a;
        } else if (type === 1) {
            return vec3.lerp(out, a, d, t);
        } else if (type === 2) {
            return vec3.hermite(out, a, b, c, d, t);
        } else if (type === 3) {
            return vec3.bezier(out, a, b, c, d, t);
        }

        return vec3.copy(out, vec3.ZERO);
    },

    quaternion(out, a, b, c, d, t, type) {
        if (type === 0) {
            return a;
        } else if (type === 1) {
            return quat.nlerp(out, a, d, t);
        } else if (type === 2 || type === 3) {
            return quat.nquad(out, a, b, c, d, t);
        }

        return quat.copy(out, quat.ZERO);
    },

    interpolate(a, b, c, d, t, type) {
        const length = a.length;

        if (length === 3) {
            return this.vector(this.heap3, a, b, c, d, t, type);
        } else if (length === 4) {
            return this.quaternion(this.heap4, a, b, c, d, t, type);
        } else {
            return this.scalar(a, b, c, d, t, type);
        }
    }
};
