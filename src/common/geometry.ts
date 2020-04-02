/**
 * Creates a rectangle geometry object.
 */
export function createRectangle(w: number, d: number) {
  return {
    vertices: new Float32Array([-w, d, 0, -w, -d, 0, w, -d, 0, w, d, 0]),
    uvs: new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]),
    faces: new Uint8Array([0, 1, 2, 0, 2, 3]),
    edges: new Uint8Array([0, 1, 1, 2, 2, 3, 3, 0]),
    boundingRadius: Math.max(w, d),
  };
}

/**
 * Creates a unit rectangle geometry object.
 */
export function createUnitRectangle() {
  return createRectangle(1, 1);
}

/**
 * Creates a cube geometry object.
 */
export function createCube(w: number, d: number, h: number) {
  return {
    vertices: new Float32Array([-w, -d, -h, -w, -d, h, -w, d, -h, -w, d, h, w, d, -h, w, d, h, w, -d, -h, w, -d, h]),
    uvs: new Float32Array([0, 0, 0, 1, 0.25, 0, 0.25, 1, 0.5, 0, 0.5, 1, 0.75, 0, 0.75, 1]),
    faces: new Uint8Array([0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6, 5, 7, 6, 6, 7, 0, 7, 1, 0, 0, 2, 4, 0, 4, 6, 1, 5, 3, 1, 7, 5]),
    edges: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 2, 4, 4, 6, 6, 0, 1, 3, 3, 5, 5, 7, 7, 1]),
    boundingRadius: Math.max(w, d, h),
  };
}

/**
 * Creates a unit cube geometry object.
 */
export function createUnitCube() {
  return createCube(1, 1, 1);
}

/**
 * Create a typed array for index buffers based on the biggest possible index
 */
function createIndexArray(size: number, biggestIndex: number) {
  if (biggestIndex < 0xFF) {
    return new Uint8Array(size);
  } else if (biggestIndex < 0xFFFF) {
    return new Uint16Array(size);
  } else {
    return new Uint32Array(size);
  }
}

/**
 * Creates a sphere geometry object.
 */
export function createSphere(radius: number, stacks: number, slices: number) {
  let points = (stacks + 1) * (slices + 1);
  let vertices = new Float32Array(points * 3);
  let uvs = new Float32Array(points * 2);
  let faces = createIndexArray(stacks * slices * 6, points);
  let edges = createIndexArray(stacks * slices * 6, points);

  for (let stack = 0, vOffset = 0, uOffset = 0; stack <= stacks; stack++) {
    let theta = stack * Math.PI / stacks;
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let slice = 0; slice <= slices; slice += 1, vOffset += 3, uOffset += 2) {
      let phi = slice * 2 * Math.PI / slices;
      let sinPhi = Math.sin(phi);
      let cosPhi = Math.cos(phi);

      vertices[vOffset + 0] = cosPhi * sinTheta * radius;
      vertices[vOffset + 1] = sinPhi * sinTheta * radius;
      vertices[vOffset + 2] = cosTheta * radius;

      uvs[uOffset + 0] = slice / slices;
      uvs[uOffset + 1] = 1 - (stack / stacks);
    }
  }

  for (let stack = 0, fOffset = 0; stack < stacks; stack++) {
    for (let slice = 0; slice < slices; slice += 1, fOffset += 6) {
      let first = (stack * (slices + 1)) + slice;
      let second = first + slices + 1;

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
export function createUnitSphere(stacks: number, slices: number) {
  return createSphere(1, stacks, slices);
}

/**
 * Creates a cylinder geometry object.
 */
export function createCylinder(radius: number, height: number, slices: number) {
  slices = Math.max(slices, 3);

  let points = (slices + 1) * 2 + 2;
  let vertices = new Float32Array(points * 3);
  let uvs = new Float32Array(points * 2);
  let faces = createIndexArray(slices * 12, points);
  let edges = createIndexArray(slices * 10, points);
  let step = (Math.PI * 2) / slices;
  let vOffset = 0;
  let uOffset = 0;

  for (let slice = 0; slice < slices + 1; slice += 1, vOffset += 6, uOffset += 4) {
    let x = Math.cos(step * slice) * radius;
    let y = Math.sin(step * slice) * radius;
    let u = slice / slices;

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
    let first = slice * 2;

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
    boundingRadius: Math.max(radius, height),
  };
}

/**
 * Creates a unit cylinder geometry object.
 */
export function createUnitCylinder(slices: number) {
  return createCylinder(1, 1, slices);
}

/**
 * Create a furstum geometry.
 */
export function createFrustum(fieldOfView: number, aspectRatio: number, nearClipPlane: number, farClipPlane: number) {
  let tanFov = 2 * Math.tan(fieldOfView / 2);
  let nearHeight = (tanFov * nearClipPlane) / 2;
  let nearWidth = (nearClipPlane * aspectRatio) / 2;
  let farHeight = (tanFov * farClipPlane) / 2;
  let farWidth = (farClipPlane * aspectRatio) / 2;

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
    faces: new Uint8Array([0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6, 5, 7, 6, 6, 7, 0, 7, 1, 0, 0, 2, 4, 0, 4, 6, 1, 5, 3, 1, 7, 5]),
    edges: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 2, 4, 4, 6, 6, 0, 1, 3, 3, 5, 5, 7, 7, 1]),
    boundingRadius: Math.max(farWidth, farHeight),
  };
}
