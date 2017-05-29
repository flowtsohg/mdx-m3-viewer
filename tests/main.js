let testsCount = 0,
    testsPassed = 0;

function addTestResult(testResult) {
    let div = document.createElement("div"),
        name = document.createElement("p"),
        status = document.createElement("p"),
        value = testResult[1],
        data = value.data,
        misMatchPercentage = Math.round(data.rawMisMatchPercentage),
        result = misMatchPercentage === 0; // allow no mismtach

    testsCount += 1;
    testsPassed += result ? 1 : 0;

    name.textContent = testResult[0] + " ";
    name.className = "item";

    status.textContent = result ? "passed" : "failed";
    status.style.color = result ? "green" : "red";
    status.className = "item";

    div.appendChild(name);
    div.appendChild(status);

    let results = document.createElement("p");

    results.className = "item";

    let a = document.createElement("a");
    a.href = value.a;
    a.textContent = "a";
    a.className = "item";
    a.target = "_blank";
    results.appendChild(a);

    let b = document.createElement("a");
    b.href = value.b;
    b.textContent = "b";
    b.className = "item";
    b.target = "_blank";
    results.appendChild(b);

    div.appendChild(results);

    document.body.appendChild(div);
}

let canvas = document.createElement("canvas");

canvas.width = canvas.height = 256;

let viewer = new ModelViewer(canvas);

viewer.gl.clearColor(0.1, 0.1, 0.1, 1);

viewer.addEventListener("error", (e) => console.log(e));

viewer.addHandler(W3x);
viewer.addHandler(M3);

let scene = new Scene();

viewer.addScene(scene);

let camera = scene.camera;

camera.setViewport([0, 0, canvas.width, canvas.height]);
camera.setPerspective(Math.PI / 4, 1, 8, 100000);

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
