let canvas = document.createElement("canvas");

canvas.width = canvas.height = 256;

let viewer = new ModelViewer(canvas);

viewer.gl.clearColor(0.1, 0.1, 0.1, 1);

viewer.addEventListener("error", (e) => console.log(e));

viewer.addHandler(W3x);
viewer.addHandler(M3);

let testsCount = 0,
    testsPassed = 0,
    table = document.createElement("table");

document.body.appendChild(table);

function addTestResult(testResult) {
    let tr = table.insertRow(),
        name = document.createElement("td"),
        status = document.createElement("td"),
        imageA = document.createElement("td"),
        imageB = document.createElement("td"),
        value = testResult[1],
        result = value.result;

    testsCount += 1;
    testsPassed += result ? 1 : 0;

    // Name of the test
    name.textContent = testResult[0] + " ";

    // Status of the test
    status.textContent = result ? "passed" : "failed";
    status.style.color = result ? "green" : "red";

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

    // Add everything to a row
    tr.appendChild(name);
    tr.appendChild(status);
    tr.appendChild(imageA);
    tr.appendChild(imageB);
}

console.log(UnitTester);

UnitTester.run(viewer, (testResult) => {
    if (!testResult.done) {
        addTestResult(testResult.value)
    } else {
        let element = document.createElement("p");

        element.className = "item";

        if (testsPassed === testsCount) {
            element.style.color = "green";
        } else {
            element.style.color = "red";
        }

        element.appendChild(document.createTextNode(testsPassed + "/" + testsCount + " tests passed"));

        document.body.appendChild(element);
    }
});
