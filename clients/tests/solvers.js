import localOrHive from "../shared/localorhive";

export const wc3Solver = (path, params) => {
  path = localOrHive(path, params);

  // GREAT JOB BLIZZARD. AWESOME PATCHES.
  if (path.endsWith('orcbloodriderlesswyvernrider.mdx') && path.includes('hiveworkshop')) {
    path = path.replace('orcbloodriderlesswyvernrider.mdx', 'ordbloodriderlesswyvernrider.mdx');
  }

  return path;
};

export const sc2Solver = localOrHive;
