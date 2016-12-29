let testsCount = 0,
    testsPassed = 0;

function addTestResult(testResult) {
    let div = document.createElement("div"),
        name = document.createElement("p"),
        status = document.createElement("p"),
        value = testResult[1],
        data = value.data,
        misMatchPercentage = Math.round(data.rawMisMatchPercentage),
        result = misMatchPercentage <= 1; // allow 1% mismatch

    testsCount += 1;
    testsPassed += result ? 1 : 0;

    console.log(misMatchPercentage);
    name.textContent = testResult[0] + " ";
    name.className = "item";

    status.textContent = result ? "passed" : "failed";
    status.style.color = result ? "green" : "red";
    status.className = "item";

    div.appendChild(name);
    div.appendChild(status);

    if (!result) {
        let mismatch = document.createElement("p");

        mismatch.className = "item";

        mismatch.appendChild(document.createTextNode(" with "));

        let span = document.createElement("span");

        span.textContent = misMatchPercentage + " percent";
        span.style.color = "red";

        mismatch.appendChild(span);
        mismatch.appendChild(document.createTextNode(" mismatch"));

        let a = document.createElement("a");
        a.href = value.a;
        a.textContent = "a";
        a.className = "item";
        mismatch.appendChild(a);

        let b = document.createElement("a");
        b.href = value.b;
        b.textContent = "b";
        b.className = "item";
        mismatch.appendChild(b);

        div.appendChild(mismatch);
    }

    document.body.appendChild(div);
}

let canvas = document.createElement("canvas");

canvas.width = canvas.height = 256;

let viewer = new ModelViewer(canvas);

viewer.gl.clearColor(0.1, 0.1, 0.1, 1);

viewer.addEventListener("error", (e) => console.log(e));

viewer.addHandler(W3x);
viewer.addHandler(M3);

document.body.appendChild(canvas);

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
