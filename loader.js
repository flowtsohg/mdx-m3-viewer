function getJSON(path, onLoad) {
    let request = new XMLHttpRequest();

    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 300) {
            onLoad(request);
        } else {
            throw new Error("SOMETHING BAD HAPPENED!");
        }
    });

    request.open("GET", path, true);
    request.responseType = "json";
    request.send();
}

function loadScript(src) {
    let body = document.body,
        script = document.createElement("script");

    script.src = src;

    if (script.async) {
        script.async = false;
    }

    body.appendChild(script);
}

function loadScripts(path, files) {
    for (let file of files) {
        loadScript(path + file + ".js");
    }
}

function loadScriptBatches(relativePath, whatToLoad, entryPoint) {
    getJSON(relativePath + "viewer.json", function (request) {
        let response = request.response;

        for (let thing of whatToLoad) {
            let batch = response[thing];

            if (batch) {
                let path = batch.path;

                loadScripts(relativePath + "external/", batch.external_files);
                loadScripts(relativePath + path, batch.internal_files);
            }
        }

        loadScript(entryPoint);
    });
}

function loadViewer(relativePath, entryPoint) {
    loadScriptBatches(relativePath, ["BASE", "SLK", "MPQ", "PNG", "BMP", "BLP", "DDS", "TGA", "GEO", "W3X", "MDX", "M3", "OBJ"], entryPoint);
}

function loadUnitTests(relativePath, entryPoint) {
    loadScriptBatches(relativePath, ["BASE", "SLK", "MPQ", "PNG", "BMP", "BLP", "DDS", "TGA", "GEO", "W3X", "MDX", "M3", "OBJ", "UNIT_TESTS"], entryPoint);
}
