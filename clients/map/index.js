ModelViewer = ModelViewer.default;

const common = ModelViewer.common;
const glMatrix = common.glMatrix;
const vec3 = glMatrix.vec3;
const quat = glMatrix.quat;
const math = glMatrix.math;

function wc3PathSolver(src, params) {
  let finalSrc = localOrHive(src.toLowerCase().replace(/\\/g, '/'), params);

  return [finalSrc, src.substr(src.lastIndexOf('.')), true];
}

let statusElement = document.getElementById('status');
statusElement.textContent = 'Initializing the viewer';

let canvas = document.getElementById('canvas');
let viewer = new ModelViewer.viewer.handlers.War3MapViewer(canvas, wc3PathSolver);

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

viewer.on('loadstart', target => {
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

viewer.on('loadend', target => {
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

function handleDrop(file) {}

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

      viewer.once('idle', () => step());

      // viewer.once('idle', () => {
      //   console.log('FINISHED LOADING STUFF LELEOLSEOFSOGDRIGMKIDRJGH')

      //   let cubeModel = viewer.load({geometry: ModelViewer.common.geometry.createUnitCube(), material: {renderMode: 1}}, (src) => [src, '.geo', false]);
      // let sphereModel = viewer.load({geometry: ModelViewer.common.geometry.createUnitSphere(12, 12), material: {renderMode: 1}}, (src) => [src, '.geo', false]);

      // for (let unit of viewer.units) {
      //   let model = unit.model;

      //   setTimeout(() => {
      //     let bounds = model.bounds;
      //     let instance = unit.instance;

      //     let cubeInstance = cubeModel.addInstance();
      //     let sphereInstance = sphereModel.addInstance();

      //     cubeInstance.dontInheritRotation = true;
      //     sphereInstance.dontInheritRotation = true;

      //     cubeInstance.setParent(instance);
      //     sphereInstance.setParent(instance);

      //     cubeInstance.uniformScale(bounds.r);
      //     //cubeInstance
      //     //cubeInstance.scale([sizeX / 2, sizeY / 2, sizeZ]);
      //     //cubeInstance.scale(instance.worldScale);

      //     //cubeInstance.uniform

      //     //sphereInstance.move([bounds.x, bounds.y, 0]);
      //     sphereInstance.uniformScale(bounds.r);

      //     // viewer.scene.addInstance(cubeInstance);
      //     // viewer.scene.addInstance(sphereInstance);
      //   }, 2000);
      // }

      //   setTimeout(() => {
      //     let tree = viewer.scene.grid;
      //     let cellSize = tree.cellSize;
      //     let i = 0;
      //     for (let cell of tree.cells) {
      //       let instance = cubeModel.addInstance();
      //       let w = (cell.right - cell.left) / 2;
      //       let h = (cell.top - cell.bottom) / 2;
      //       instance.setLocation([cell.left + w, cell.bottom + h, 201]);
      //       instance.scale([cellSize[0] / 2 - 5, cellSize[1] / 2 - 5, 200]);
      //       instance.setEdgeColor([i * (255 / 16) + 10, i * (255 / 16) + 10, i * (255 / 16) + 10, 255]);

      //       viewer.scene.addInstance(instance);

      //       i++;
      //     }
      //   }, 1000);
      // })
    });

    reader.readAsArrayBuffer(file);
  }
});
