let testsCount = 0,
    testsPassed = 0,
    testsElement = document.getElementById("tests"),
    resultElement = document.getElementById("result");

function addTestResult(testResult) {
    let tr = testsElement.insertRow(),
        name = document.createElement("td"),
        status = document.createElement("td"),
        imageA = document.createElement("td"),
        imageB = document.createElement("td"),
        value = testResult[1],
        result = value.result;

    testsCount += 1;
    testsPassed += result ? 1 : 0;

    // Name of the test
    name.textContent = testResult[0];

    // Status of the test
    status.textContent = result ? "passed" : "failed";
    status.className = result ? "success" : "failure";

    // The rendered image
    let a = document.createElement("a");
    a.href = value.a.src;
    a.target = "_blank";

    a.appendChild(value.a);
    value.a.style.width = "16px";

    // The comparison image
    let b = document.createElement("a");
    b.href = value.b.src;
    b.target = "_blank";

    b.appendChild(value.b);
    value.b.style.width = "16px";

    imageA.appendChild(a);
    imageB.appendChild(b);

    imageA.className = "centered";
    imageB.className = "centered";

    // Add everything to a row
    tr.appendChild(name);
    tr.appendChild(status);
    tr.appendChild(imageA);
    tr.appendChild(imageB);
}

let unitTester = new UnitTester();

document.getElementById("version").textContent = "Viewer version " + unitTester.viewer.version;

console.log("Viewer version", unitTester.viewer.version);

unitTester.add(geoTests);
unitTester.add(mdxTests);
unitTester.add(m3Tests);
unitTester.add(baseTests);

let runElement = document.getElementById("run"),
    downloadElement = document.getElementById("download");

function enableButtons() {
    runElement.disabled = false;
    downloadElement.disabled = false;
}

function disableButtons() {
    runElement.disabled = true;
    downloadElement.disabled = true;
}


runElement.addEventListener("click", () => {
    disableButtons();

    unitTester.run((entry) => {
        if (!entry.done) {
            addTestResult(entry.value);
        } else {
            resultElement.textContent = testsPassed + "/" + testsCount + " tests passed";
            resultElement.className = (testsPassed === testsCount) ? "success" : "failure";

            enableButtons();
        }
    });
});

downloadElement.addEventListener("click", () => {
    disableButtons();

    unitTester.downloadTestResults((entry) => {
        if (entry.done) {
            enableButtons();
        }
    });
});
