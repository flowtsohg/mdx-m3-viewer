import { basename, extname } from "../../src/common/path";
import War3MapViewer from '../../src/viewer/handlers/w3x/viewer';
import { setupCamera } from "../shared/camera";
import localOrHive from "../shared/localorhive";

let statusElement = document.getElementById('status');
statusElement.textContent = 'Initializing the viewer';

let canvas = document.getElementById('canvas');

// true because the Reforged Hive API is used in localOrHive.
let viewer = new War3MapViewer(canvas, localOrHive, true);

let thingsLoading = [];

function updateStatus() {
  if (thingsLoading.length) {
    statusElement.textContent = `Loading ${thingsLoading.join(', ')}`;
  } else {
    statusElement.textContent = '';
  }
}

for (let key of viewer.promiseMap.keys()) {
  thingsLoading.push(basename(key));
}

updateStatus();

viewer.on('loadstart', ({ fetchUrl }) => {
  thingsLoading.push(basename(fetchUrl));
  updateStatus();
});

viewer.on('loadend', ({ fetchUrl }) => {
  let file = basename(fetchUrl);
  let index = thingsLoading.indexOf(file);

  if (index !== -1) {
    thingsLoading.splice(index, 1);
    updateStatus();
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

(function step() {
  requestAnimationFrame(step);

  viewer.updateAndRender();
  meter.tick();

  cellsElement.textContent = `Cells: ${viewer.visibleCells}`;
  instancesElement.textContent = `Instances: ${viewer.visibleInstances}`;
  particlesElement.textContent = `Particles: ${viewer.updatedParticles}`;
}());

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  if (viewer.loadedBaseFiles) {
    let file = e.dataTransfer.files[0];
    let name = file.name;
    let ext = extname(name);

    if (ext === '.w3m' || ext === '.w3x') {
      let reader = new FileReader();

      reader.addEventListener('loadend', e => {
        viewer.loadMap(e.target.result);

        setupCamera(viewer.map.worldScene, { distance: 3000 });
      });

      reader.readAsArrayBuffer(file);
    }
  }
});
