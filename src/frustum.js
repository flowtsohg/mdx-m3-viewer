function Frustum() {
    // Left, right, top, bottom, near, far
    this.planes = [quat.create(), quat.create(), quat.create(), quat.create(), quat.create(), quat.create()];
}

Frustum.prototype = {
    /*
plane.distanceToPoint = function (p, v) {
    return p[0] * v[0] + p[1] * v[1] + p[2] * v[2] + p[3];
};

plane.classifyPoint = function (plane, point) {
    let d = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] + plane[3];

    if (d < 0) {
        return -1;
    } else if (d > 0) {
        return 1;
    }

    return 0;
};
     */

    /// NOTE: NOT SCALING RADIUS
    testIntersectionSphere(boundingShape) {
        const TEST_INSIDE = 2,
            TEST_INTERSECT = 1,
            TEST_OUTSIDE = 0;

        let worldLocation = boundingShape.worldLocation,
            worldScale = boundingShape.worldScale,
            planes = this.planes,
            radius = boundingShape.radius;

        for (let i = 0; i < 6; i++) {
            let plane = planes[i],
                d = plane[0] * worldLocation[0] + plane[1] * worldLocation[1] + plane[2] * worldLocation[2] + plane[3];

            if (d < -radius) {
                return TEST_OUTSIDE;
            }

            if (Math.abs(d) < radius) {
                return TEST_INTERSECT;
            }
        }

        return TEST_INSIDE;
    },

    testIntersectionAABB(boundingShape) {
        const TEST_INSIDE = 2,
            TEST_INTERSECT = 1,
            TEST_OUTSIDE = 0;

        let worldLocation = boundingShape.worldLocation,
            worldScale = boundingShape.worldScale,
            planes = this.planes,
            result = TEST_INSIDE,
            v = vec3.heap;

        for (let i = 0; i < 6; i++) {
            let plane = planes[i],
                a = plane[0],
                b = plane[1],
                c = plane[2],
                d = plane[3],
                v2 = [];
               
            // Positive vertex
            boundingShape.getPositiveVertex(v, plane);
            vec3.mulAndAdd(v2, v, worldScale, worldLocation);
            if ((a * v2[0] + b * v2[1] + c * v2[2] + d) < 0) {
                return TEST_OUTSIDE;
            }

            // Negative vertex
            boundingShape.getNegativeVertex(v, plane);
            vec3.mulAndAdd(v2, v, worldScale, worldLocation);
            if ((a * v2[0] + b * v2[1] + c * v2[2] + d) < 0) {
                result = TEST_INTERSECT;
            }

        }

        return result;
    },

    recalculateFrustum(m) {
        let a00 = m[0], a01 = m[4], a02 = m[8], a03 = m[12],
            a10 = m[1], a11 = m[5], a12 = m[9], a13 = m[13],
            a20 = m[2], a21 = m[6], a22 = m[10], a23 = m[14],
            a30 = m[3], a31 = m[7], a32 = m[11], a33 = m[15],
            planes = this.planes,
            plane;

        // Left clipping plane
        plane = planes[0];
        plane[0] = a30 + a00;
        plane[1] = a31 + a01;
        plane[2] = a32 + a02;
        plane[3] = a33 + a03;

        // Right clipping plane
        plane = planes[1];
        plane[0] = a30 - a00;
        plane[1] = a31 - a01;
        plane[2] = a32 - a02;
        plane[3] = a33 - a03;

        // Top clipping plane
        plane = planes[2];
        plane[0] = a30 - a10;
        plane[1] = a31 - a11;
        plane[2] = a32 - a12;
        plane[3] = a33 - a13;

        // Bottom clipping plane
        plane = planes[3];
        plane[0] = a30 + a10;
        plane[1] = a31 + a11;
        plane[2] = a32 + a12;
        plane[3] = a33 + a13;

        // Near clipping plane
        plane = planes[4];
        plane[0] = a30 + a20;
        plane[1] = a31 + a21;
        plane[2] = a32 + a22;
        plane[3] = a33 + a23;

        // Far clipping plane
        plane = planes[5];
        plane[0] = a30 - a20;
        plane[1] = a31 - a21;
        plane[2] = a32 - a22;
        plane[3] = a33 - a23;

        /*
        quat.normalize(planes[0], planes[0]);
        quat.normalize(planes[1], planes[1]);
        quat.normalize(planes[2], planes[2]);
        quat.normalize(planes[3], planes[3]);
        quat.normalize(planes[4], planes[4]);
        quat.normalize(planes[5], planes[5]);
        */
    }
};
