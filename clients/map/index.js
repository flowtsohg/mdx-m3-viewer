ModelViewer = ModelViewer.default;

const common = ModelViewer.common;
const glMatrix = common.glMatrix;
const vec3 = glMatrix.vec3;
const quat = glMatrix.quat;
const math = glMatrix.math;

function wc3PathSolver(src, params) {
  return localOrHive(src.toLowerCase().replace(/\\/g, '/'), params);
}

let statusElement = document.getElementById('status');
statusElement.textContent = 'Initializing the viewer';

let canvas = document.getElementById('canvas');
let viewer = new ModelViewer.viewer.handlers.War3MapViewer(canvas, wc3PathSolver);
viewer.solverParams = viewer.solverParams || {};
viewer.solverParams['reforged'] = false;
viewer.solverParams['hd'] = false;
let thingsLoading = [];

function updateStatus() {
  if (thingsLoading.length) {
    statusElement.textContent = `Loading ${thingsLoading.join(', ')}`;
  } else {
    statusElement.textContent = '';
  }
}

for (let key of viewer.promiseMap.keys()) {
  let file = key.slice(key.lastIndexOf('/') + 1);

  if (file !== '') {
    thingsLoading.push(file);
  }
}

updateStatus();

viewer.on('loadstart', ({ fetchUrl }) => {
  let file = fetchUrl.slice(fetchUrl.lastIndexOf('/') + 1);

  if (file !== '') {
    thingsLoading.push(file);
    updateStatus();
  }
});

viewer.on('loadend', ({ fetchUrl }) => {
  let file = fetchUrl.slice(fetchUrl.lastIndexOf('/' ) + 1);

  if (file !== '') {
    let index = thingsLoading.indexOf(file);

    if (index !== -1) {
      thingsLoading.splice(index, 1);
      updateStatus();
    }
  }
});

let meter = new FPSMeter({
  position: 'absolute',
  right: '10px',
  top: '10px',
  left: 'calc(100% - 130px)',
  theme: 'transparent',
  heat: 1,
  graph: 1
});

let cellsElement = document.getElementById('cells');
let instancesElement = document.getElementById('instances');
let particlesElement = document.getElementById('particles');

setupCamera(viewer.worldScene, 3000);

function step() {
  requestAnimationFrame(step);

  viewer.updateAndRender();
  meter.tick();

  cellsElement.textContent = `Cells: ${viewer.worldScene.visibleCells}`;
  instancesElement.textContent = `Instances: ${viewer.worldScene.visibleInstances}`;
  particlesElement.textContent = `Particles: ${viewer.worldScene.updatedParticles}`;
}

function handleDrop(file) { }

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  let file = e.dataTransfer.files[0];
  let name = file.name;
  let ext = name.substr(name.lastIndexOf('.')).toLowerCase();

  if (ext === '.w3m' || ext === '.w3x') {
    let reader = new FileReader();

    reader.addEventListener('loadend', e => {
      viewer.loadMap(e.target.result);

      step();


    });

    reader.readAsArrayBuffer(file);
  }
});
