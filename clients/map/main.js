ModelViewer = ModelViewer.default;

const common = ModelViewer.common;
const math = common.math;
const glMatrix = common.glMatrix;
const vec3 = glMatrix.vec3;
const quat = glMatrix.quat;

function wc3PathSolver(src) {
  src = localOrHive(src.toLowerCase().replace(/\\/g, '/'));

  return [src, src.substr(src.lastIndexOf('.')), true];
}

let statusElement = document.getElementById('status');
statusElement.textContent = 'Initializing the viewer';

let canvas = document.getElementById('canvas');
let viewer = new ModelViewer.viewer.handlers.w3x.MapViewer(canvas, wc3PathSolver);

let thingsLoading = [];

function updateStatus() {
  if (thingsLoading.length) {
    statusElement.textContent = `Loading ${thingsLoading.join(', ')}`;
  } else {
    statusElement.textContent = '';
  }
}

for (let resource of viewer.resourcesLoading) {
  let path = resource.fetchUrl;
  let file = path.slice(path.lastIndexOf('/') + 1);

  if (file !== '') {
    thingsLoading.push(file);
  }
}

updateStatus();

viewer.on('loadstart', (target) => {
  let path = target.fetchUrl;

  // PromiseResource has no path, nor does it need to be tracked.
  if (path) {
    let file = path.slice(path.lastIndexOf('/') + 1);

    if (file !== '') {
      thingsLoading.push(file);
      updateStatus();
    }
  }
});

viewer.on('loadend', (target) => {
  let path = target.fetchUrl;

  // PromiseResource has no path, nor does it need to be tracked.
  if (path) {
    let file = path.slice(path.lastIndexOf('/') + 1);

    if (file !== '') {
      let index = thingsLoading.indexOf(file);

      if (index !== -1) {
        thingsLoading.splice(index, 1);
        updateStatus();
      }
    }
  }
});

let meter = new FPSMeter({position: 'absolute', right: '10px', top: '10px', left: 'calc(100% - 130px)', theme: 'transparent', heat: 1, graph: 1});

setupCamera(viewer.scene, 3000);

(function step() {
  requestAnimationFrame(step);

  viewer.updateAndRender();
  meter.tick();
}());

function handleDrop(file) {

}

document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('dragend', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();

  let file = e.dataTransfer.files[0];
  let name = file.name;
  let ext = name.substr(name.lastIndexOf('.')).toLowerCase();

  if (ext === '.w3m' || ext === '.w3x') {
    let reader = new FileReader();

    reader.addEventListener('loadend', (e) => {
      viewer.loadMap(e.target.result);
    });

    reader.readAsArrayBuffer(file);
  }
});
