interface PrimitiveShape {
  vertices: Float32Array;
  uvs: Float32Array;
  faces: Uint16Array;
  edges: Uint16Array;
  boundingRadius: number;
}

/**
 * Creates a rectangle geometry object.
 */
export function createRectangle(w: number, d: number): PrimitiveShape {
  return {
    vertices: new Float32Array([-w, d, 0, -w, -d, 0, w, -d, 0, w, d, 0]),
    uvs: new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]),
    faces: new Uint16Array([0, 1, 2, 0, 2, 3]),
    edges: new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0]),
    boundingRadius: Math.hypot(w, d),
  };
}

/**
 * Creates a unit rectangle geometry object.
 */
export function createUnitRectangle(): PrimitiveShape {
  return createRectangle(1, 1);
}

/**
 * Creates a cube geometry object.
 */
export function createCube(w: number, d: number, h: number): PrimitiveShape {
  return {
    vertices: new Float32Array([-w, -d, -h, -w, -d, h, -w, d, -h, -w, d, h, w, d, -h, w, d, h, w, -d, -h, w, -d, h]),
    uvs: new Float32Array([0, 0, 0, 1, 0.25, 0, 0.25, 1, 0.5, 0, 0.5, 1, 0.75, 0, 0.75, 1]),
    faces: new Uint16Array([0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6, 5, 7, 6, 6, 7, 0, 7, 1, 0, 0, 2, 4, 0, 4, 6, 1, 5, 3, 1, 7, 5]),
    edges: new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 2, 4, 4, 6, 6, 0, 1, 3, 3, 5, 5, 7, 7, 1]),
    boundingRadius: Math.hypot(w, d, h),
  };
}

/**
 * Creates a unit cube geometry object.
 */
export function createUnitCube(): PrimitiveShape {
  return createCube(1, 1, 1);
}

/**
 * Creates a sphere geometry object.
 */
export function createSphere(radius: number, stacks: number, slices: number): PrimitiveShape {
  const points = (stacks + 1) * (slices + 1);
  const vertices = new Float32Array(points * 3);
  const uvs = new Float32Array(points * 2);
  const faces = new Uint16Array(stacks * slices * 6);
  const edges = new Uint16Array(stacks * slices * 6);

  for (let stack = 0, vOffset = 0, uOffset = 0; stack <= stacks; stack++) {
    const theta = stack * Math.PI / stacks;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let slice = 0; slice <= slices; slice += 1, vOffset += 3, uOffset += 2) {
      const phi = slice * 2 * Math.PI / slices;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      vertices[vOffset + 0] = cosPhi * sinTheta * radius;
      vertices[vOffset + 1] = sinPhi * sinTheta * radius;
      vertices[vOffset + 2] = cosTheta * radius;

      uvs[uOffset + 0] = slice / slices;
      uvs[uOffset + 1] = 1 - (stack / stacks);
    }
  }

  for (let stack = 0, fOffset = 0; stack < stacks; stack++) {
    for (let slice = 0; slice < slices; slice += 1, fOffset += 6) {
      const first = (stack * (slices + 1)) + slice;
      const second = first + slices + 1;

      // Faces
      faces[fOffset + 0] = first;
      faces[fOffset + 1] = second;
      faces[fOffset + 2] = first + 1;

      faces[fOffset + 3] = second;
      faces[fOffset + 4] = second + 1;
      faces[fOffset + 5] = first + 1;

      // Edges
      edges[fOffset + 0] = first;
      edges[fOffset + 1] = second;

      edges[fOffset + 2] = first;
      edges[fOffset + 3] = first + 1;

      edges[fOffset + 4] = second;
      edges[fOffset + 5] = second + 1;
    }
  }

  return {
    vertices: vertices,
    uvs: uvs,
    faces: faces,
    edges: edges,
    boundingRadius: radius,
  };
}

/**
 * Creates a unit sphere geometry object.
 */
export function createUnitSphere(stacks: number, slices: number): PrimitiveShape {
  return createSphere(1, stacks, slices);
}

/**
 * Creates a cylinder geometry object.
 */
export function createCylinder(radius: number, height: number, slices: number): PrimitiveShape {
  slices = Math.max(slices, 3);

  const points = (slices + 1) * 2 + 2;
  const vertices = new Float32Array(points * 3);
  const uvs = new Float32Array(points * 2);
  const faces = new Uint16Array(slices * 12);
  const edges = new Uint16Array(slices * 10);
  const step = (Math.PI * 2) / slices;
  let vOffset = 0;
  let uOffset = 0;

  for (let slice = 0; slice < slices + 1; slice += 1, vOffset += 6, uOffset += 4) {
    const x = Math.cos(step * slice) * radius;
    const y = Math.sin(step * slice) * radius;
    const u = slice / slices;

    vertices[vOffset + 0] = x;
    vertices[vOffset + 1] = y;
    vertices[vOffset + 2] = height;
    vertices[vOffset + 3] = x;
    vertices[vOffset + 4] = y;
    vertices[vOffset + 5] = -height;

    uvs[uOffset + 0] = u;
    uvs[uOffset + 1] = 1;
    uvs[uOffset + 2] = u;
    uvs[uOffset + 3] = 0;
  }

  // Poles
  vertices[vOffset + 0] = 0;
  vertices[vOffset + 1] = 0;
  vertices[vOffset + 2] = height;

  vertices[vOffset + 3] = 0;
  vertices[vOffset + 4] = 0;
  vertices[vOffset + 5] = -height;

  uvs[uOffset + 0] = 0;
  uvs[uOffset + 1] = 1;

  uvs[uOffset + 2] = 0;
  uvs[uOffset + 3] = 0;

  for (let slice = 0, fOffset = 0, eOffset = 0; slice < slices; slice += 1, fOffset += 12, eOffset += 10) {
    const first = slice * 2;

    // Faces
    faces[fOffset + 0] = first + 0;
    faces[fOffset + 1] = first + 1;
    faces[fOffset + 2] = (first + 3) % (points - 2);

    faces[fOffset + 3] = first + 0;
    faces[fOffset + 4] = (first + 3) % (points - 2);
    faces[fOffset + 5] = (first + 2) % (points - 2);

    faces[fOffset + 6] = first + 0;
    faces[fOffset + 7] = (first + 2) % (points - 2);
    faces[fOffset + 8] = points - 2;

    faces[fOffset + 9] = first + 1;
    faces[fOffset + 10] = (first + 3) % (points - 2);
    faces[fOffset + 11] = points - 1;

    // Edges
    edges[eOffset + 0] = first + 0;
    edges[eOffset + 1] = first + 1;

    edges[eOffset + 2] = first + 0;
    edges[eOffset + 3] = (first + 2) % (points - 2);

    edges[eOffset + 4] = first + 1;
    edges[eOffset + 5] = (first + 3) % (points - 2);

    edges[eOffset + 6] = first + 0;
    edges[eOffset + 7] = points - 2;

    edges[eOffset + 8] = first + 1;
    edges[eOffset + 9] = points - 1;
  }

  return {
    vertices: vertices,
    uvs: uvs,
    faces: faces,
    edges: edges,
    boundingRadius: Math.hypot(radius, height),
  };
}

/**
 * Creates a unit cylinder geometry object.
 */
export function createUnitCylinder(slices: number): PrimitiveShape {
  return createCylinder(1, 1, slices);
}

/**
 * Create a furstum geometry.
 */
export function createFrustum(fieldOfView: number, aspectRatio: number, nearClipPlane: number, farClipPlane: number): PrimitiveShape {
  const tanFov = 2 * Math.tan(fieldOfView / 2);
  const nearHeight = (tanFov * nearClipPlane) / 2;
  const nearWidth = (nearClipPlane * aspectRatio) / 2;
  const farHeight = (tanFov * farClipPlane) / 2;
  const farWidth = (farClipPlane * aspectRatio) / 2;

  return {
    vertices: new Float32Array([
      -nearWidth, -nearHeight, nearClipPlane,
      -nearWidth, nearHeight, nearClipPlane,
      -farWidth, -farHeight, farClipPlane,
      -farWidth, farHeight, farClipPlane,
      farWidth, -farHeight, farClipPlane,
      farWidth, farHeight, farClipPlane,
      nearWidth, -nearHeight, nearClipPlane,
      nearWidth, nearHeight, nearClipPlane]),
    uvs: new Float32Array([0, 0, 0, 1, 0.25, 0, 0.25, 1, 0.5, 0, 0.5, 1, 0.75, 0, 0.75, 1]),
    faces: new Uint16Array([0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6, 5, 7, 6, 6, 7, 0, 7, 1, 0, 0, 2, 4, 0, 4, 6, 1, 5, 3, 1, 7, 5]),
    edges: new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 2, 4, 4, 6, 6, 0, 1, 3, 3, 5, 5, 7, 7, 1]),
    boundingRadius: Math.hypot(farWidth, farHeight),
  };
}
