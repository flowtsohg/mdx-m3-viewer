vec3 = ModelViewer.default.common.glMatrix.vec3;
quat = ModelViewer.default.common.glMatrix.quat;
createPrimitive = ModelViewer.default.utils.mdlx.createPrimitive;
primitives = ModelViewer.default.utils.mdlx.primitives;

wc3Solver = (path, params) => {
  path = localOrHive(path, params);

  // GREAT JOB BLIZZARD. AWESOME PATCHES.
  if (path.endsWith('orcbloodriderlesswyvernrider.mdx') && path.includes('hiveworkshop')) {
    path = path.replace('orcbloodriderlesswyvernrider.mdx', 'ordbloodriderlesswyvernrider.mdx');
  }

  return path;
};

sc2Solver = (path, params) => localOrHive(path, params);

new UnitTester(document.body);
