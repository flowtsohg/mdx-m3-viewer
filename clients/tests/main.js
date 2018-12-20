ModelViewer = ModelViewer.default;
glMatrix = ModelViewer.common.glMatrix;
vec2 = glMatrix.vec2;
vec3 = glMatrix.vec3;
vec4 = glMatrix.vec4;
quat = glMatrix.quat;
mat3 = glMatrix.mat3;
mat4 = glMatrix.mat4;
UnitTester = ModelViewer.utils.UnitTester;
geometry = ModelViewer.common.geometry;
math = ModelViewer.common.math;

geoSolver = (src) => {
  return [src, '.geo', false];
};

wc3Solver = (path) => {
  path = localOrHive(path);

  // GREAT JOB BLIZZARD. AWESOME PATCHES.
  if (path.endsWith('orcbloodriderlesswyvernrider.mdx') && path.includes('hiveworkshop')) {
    path = path.replace('orcbloodriderlesswyvernrider.mdx', 'ordbloodriderlesswyvernrider.mdx');
  }

  return [path, path.substr(path.lastIndexOf('.')), true];
};

sc2Solver = (path) => {
  path = localOrHive(path, 'starcraft2');

  return [path, path.substr(path.lastIndexOf('.')), true];
};

function addTestResult(table, testResult) {
  let tr = table.insertRow();
  let name = document.createElement('td');
  let status = document.createElement('td');
  let imageA = document.createElement('td');
  let imageB = document.createElement('td');
  let testName = testResult.name;
  let testImage = testResult.testImage;
  let comparisonImage = testResult.comparisonImage;
  let result = testResult.result;
  let passed = result < 1;

  // Name of the test
  name.textContent = testName;

  // Status of the test
  status.textContent = passed ? 'passed' : 'failed';
  status.className = passed ? 'success' : 'failure';

  if (testImage) {
    // The rendered image
    let a = document.createElement('a');
    a.href = testImage.src;
    a.target = '_blank';

    a.appendChild(testImage);
    testImage.style.width = '16px';

    imageA.appendChild(a);
  }

  if (comparisonImage) {
    // The comparison image
    let b = document.createElement('a');
    b.href = comparisonImage.src;
    b.target = '_blank';

    b.appendChild(comparisonImage);
    comparisonImage.style.width = '16px';

    imageB.appendChild(b);
  }

  imageA.className = 'centered';
  imageB.className = 'centered';

  // Add everything to a row
  tr.appendChild(name);
  tr.appendChild(status);
  tr.appendChild(imageA);
  tr.appendChild(imageB);

  return passed;
}

let testsCount = 0;
let testsPassed = 0;
let testsElement = document.getElementById('tests');
let resultElement = document.getElementById('result');
let unitTester = new UnitTester();

document.getElementById('version').textContent = 'Viewer version ' + ModelViewer.version;

console.log('Viewer version', ModelViewer.version);

unitTester.add(mdxTests);
unitTester.add(m3Tests);
unitTester.add(geoTests);
unitTester.add(baseTests);

let runElement = document.getElementById('run');
let downloadElement = document.getElementById('download');

runElement.addEventListener('click', () => {
  runElement.disabled = true;
  downloadElement.disabled = true;

  console.log('Starting to test');

  unitTester.test((entry) => {
    if (!entry.done) {
      console.log(`Tested ${entry.value.name}`);

      let passed = addTestResult(testsElement, entry.value);

      testsCount += 1;
      testsPassed += passed ? 1 : 0;
    } else {
      resultElement.textContent = testsPassed + '/' + testsCount + ' tests passed';
      resultElement.className = (testsPassed === testsCount) ? 'success' : 'failure';

      console.log('Finished testing');

      runElement.disabled = false;
      downloadElement.disabled = false;
    }
  });
});

downloadElement.addEventListener('click', () => {
  runElement.disabled = true;
  downloadElement.disabled = true;

  console.log('Starting to download');

  unitTester.download((entry) => {
    if (!entry.done) {
      console.log(`Downloaded ${entry.value.name}`);
    } else {
      console.log('Finished downloading');

      runElement.disabled = false;
      downloadElement.disabled = false;
    }
  });
});
