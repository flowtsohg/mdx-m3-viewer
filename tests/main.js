let testsCount = 0;
let testsPassed = 0;
let testsElement = document.getElementById('tests');
let resultElement = document.getElementById('result');

/**
 * @param {object} testResult
 */
function addTestResult(testResult) {
  let tr = testsElement.insertRow();
  let name = document.createElement('td');
  let status = document.createElement('td');
  let imageA = document.createElement('td');
  let imageB = document.createElement('td');
  let testName = testResult.name;
  let testImage = testResult.testImage;
  let comparisonImage = testResult.comparisonImage;
  let result = testResult.result;
  let passed = result < 1;

  testsCount += 1;
  testsPassed += passed ? 1 : 0;

  // Name of the test
  name.textContent = testName;

  // Status of the test
  status.textContent = passed ? 'passed' : 'failed';
  status.className = passed ? 'success' : 'failure';

  // The rendered image
  let a = document.createElement('a');
  a.href = testImage.src;
  a.target = '_blank';

  a.appendChild(testImage);
  testImage.style.width = '16px';

  imageA.appendChild(a);

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
}

let unitTester = new UnitTester();

document.getElementById('version').textContent = 'Viewer version ' + ModelViewer.version;

console.log('Viewer version', ModelViewer.version);

unitTester.add(mdxTests);
unitTester.add(m3Tests);
unitTester.add(geoTests);
unitTester.add(baseTests);

let runElement = document.getElementById('run');
let downloadElement = document.getElementById('download');

/**
 * Enable the buttons.
 */
function enableButtons() {
  runElement.disabled = false;
  downloadElement.disabled = false;
}

/**
 * Disable the buttons.
 */
function disableButtons() {
  runElement.disabled = true;
  downloadElement.disabled = true;
}

runElement.addEventListener('click', () => {
  disableButtons();

  console.log('Starting to test');

  unitTester.test((entry) => {
    if (!entry.done) {
      console.log(`Tested ${entry.value.name}`);

      addTestResult(entry.value);
    } else {
      resultElement.textContent = testsPassed + '/' + testsCount + ' tests passed';
      resultElement.className = (testsPassed === testsCount) ? 'success' : 'failure';

      console.log('Finished testing');

      enableButtons();
    }
  });
});

downloadElement.addEventListener('click', () => {
  disableButtons();

  console.log('Starting to download');

  unitTester.download((entry) => {
    if (!entry.done) {
      console.log(`Downloaded ${entry.value.name}`);
    } else {
      console.log('Finished downloading');

      enableButtons();
    }
  });
});
