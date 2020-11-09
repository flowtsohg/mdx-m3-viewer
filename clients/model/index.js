const handlers = ModelViewer.default.viewer.handlers;
const common = ModelViewer.default.common;
const glMatrix = common.glMatrix;
const vec3 = glMatrix.vec3;
const quat = glMatrix.quat;

let canvas = document.getElementById('canvas');

canvas.width = 800;
canvas.height = 600;

let viewer = new ModelViewer.default.viewer.ModelViewer(canvas);
let scene = viewer.addScene();

setupCamera(scene);

viewer.on('error', (target, error, reason) => console.log(target, error, reason));

viewer.addHandler(handlers.mdx);
viewer.addHandler(handlers.blp);
viewer.addHandler(handlers.tga);
viewer.addHandler(handlers.dds);

function pathSolver(src) {
  if (typeof src === 'string' && src.length < 120) {
    return localOrHive(src);
  }

  return src;
}

viewer.load('Units/Human/Footman/Footman.mdx', pathSolver)
  .then((model) => {
    let instance = model.addInstance();

    instance.setScene(scene);
    instance.setSequence(0);
    instance.setSequenceLoopMode(2);
  });

(function step() {
  requestAnimationFrame(step);

  viewer.updateAndRender();
})();

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  let files = e.dataTransfer.files;

  if (files.length) {
    let reader = new FileReader();

    reader.addEventListener('loadend', (e) => {
      viewer.load(e.target.result, pathSolver)
        .then((model) => {
          if (model) {
            scene.clear();

            let instance = model.addInstance();

            instance.setScene(scene);
            instance.setSequence(0);
            instance.setSequenceLoopMode(2);
          }
        });
    });

    reader.readAsArrayBuffer(files[0]);
  }
});
