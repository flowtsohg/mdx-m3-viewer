ModelViewer = ModelViewer.default;

let math = ModelViewer.common.math;
let glMatrix = ModelViewer.common.glMatrix;
let geometry = ModelViewer.common.geometry;

let vec2 = glMatrix.vec2,
  vec3 = glMatrix.vec3,
  vec4 = glMatrix.vec4,
  quat = glMatrix.quat,
  mat3 = glMatrix.mat3,
  mat4 = glMatrix.mat4;


var keyboard = {};
var mouse = {buttons: [false, false, false], x: 0, y: 0, x2: 0, y2: 0};

var canvas = document.getElementById('canvas');
var viewer = new ModelViewer.viewer.ModelViewer(canvas, {alpha: true});
var model;
var instance;

viewer.on('error', (target, error, reason) => console.error(`Error: ${error}, reason: ${reason}`, target));

viewer.addHandler(ModelViewer.viewer.handlers.mdx);

viewer.gl.clearColor(0, 0, 0, 1);

let backgroundOpaque = true;
let turnTable = false;
let turnTableSpeed = 0;
let turnTableQuat = quat.create();
let isRecording = false;
let recordingFrame = 0;
let oneTimeRecord = false;
let zip = new JSZip();

let frameCounterElement = document.getElementById('frame_counter');
let sequenceNameElement = document.getElementById('sequence_name');

(function step() {
  viewer.updateAndRender();

  if (instance && instance.model.loaded) {
    instance.rotate(turnTableQuat);

    if (isRecording || oneTimeRecord) {
      oneTimeRecord = false;

      zip.file(`${recordingFrame++}_${model.name}_${Math.floor(instance.frame)}.png`, viewer.canvas.toDataURL().substring(22), {base64: true});

      frameCounterElement.textContent = recordingFrame;
    }
  }

  requestAnimationFrame(step);
}());

let scene = viewer.addScene();

setupCamera(scene, 500);

viewer.noCulling = true;

console.log('Viewer version', ModelViewer.version);

// Run the next sequence for the given instance at e.
function runNextSequence(e) {
  let instance = e.target;

  instance.setSequence((instance.sequence + 1) % instance.model.sequences.length);
}

// Log load starts to the console.
viewer.on('loadstart', (target) => {
  let path = target.fetchUrl;

  if (path) {
    console.log('Loading ' + target.fetchUrl);
  }
});

// Log load ends to the console.
viewer.on('load', (target) => {
  let path = target.fetchUrl;

  if (path) {
    console.log('Finished loading ' + target.fetchUrl);
  }
});

// Log errors to the console.
viewer.on('error', (target, error, reason) => console.log(`Error: ${error}, reason: ${reason}`, target));

function normalizePath(path) {
  return path.toLocaleLowerCase().replace(/\\/g, '/');
}

// Load a local file
function onLocalFileLoaded(name, buffer) {
  if (name.endsWith('.mdx')) {
    let pathSolver = (src) => {
      if (src === buffer) {
        return [src, '.mdx', false]
      } else {
        return [localOrHive(normalizePath(src)), src.substr(src.lastIndexOf('.')), true];
      }
    };

    turnTableSpeed = 0;
    quat.identity(turnTableQuat);
    isRecording = false;

    scene.clear();

    model = viewer.load(buffer, pathSolver),
      instance = model.addInstance();

    instance.setSequenceLoopMode(2);
    instance.setSequence(0);

    sequenceNameElement.textContent = model.sequences[0].name;

    scene.addInstance(instance);
  } else if (name.endsWith('.blp')) {
    if (model && model.loaded) {
      for (let texture of model.textures) {
        if (texture.fetchUrl.toLowerCase().endsWith(name.toLowerCase())) {
          texture.onload(buffer);
        }
      }
    }
  }
}

canvas.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

canvas.addEventListener('selectstart', function(e) {
  e.preventDefault();
});

function onFileDrop(e) {
  let file = e.dataTransfer.files[0];

  if (file) {
    let name = file.name.toLowerCase();

    if (name.endsWith('.mdx') || name.endsWith('.blp')) {
      let reader = new FileReader();

      reader.addEventListener('loadend', (e) => onLocalFileLoaded(name, e.target.result));
      reader.readAsArrayBuffer(file);
    }
  }
}

document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('dragend', (e) => {
  e.preventDefault();
  onFileDrop(e);
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  onFileDrop(e);
});

window.addEventListener('keydown', (e) => {
  let key = e.key;

  if (instance && instance.model.loaded) {
    if (key === ' ') {
      isRecording = !isRecording;
    } else if (key === 'ArrowLeft') {
      if (instance.sequence === 0) {
        instance.setSequence(model.sequences.length - 1);
      } else {
        instance.setSequence(instance.sequence - 1);
      }

      sequenceNameElement.textContent = model.sequences[instance.sequence].name;
    } else if (key === 'ArrowRight') {
      if (instance.sequence === model.sequences.length - 1) {
        instance.setSequence(0);
      } else {
        instance.setSequence(instance.sequence + 1);
      }

      sequenceNameElement.textContent = model.sequences[instance.sequence].name;
    } else if (key === 'ArrowUp') {
      turnTableSpeed += 0.2;
      quat.setAxisAngle(turnTableQuat, [0, 0, 1], math.degToRad(turnTableSpeed));
    } else if (key === 'ArrowDown') {
      turnTableSpeed -= 0.2;
      quat.setAxisAngle(turnTableQuat, [0, 0, 1], math.degToRad(turnTableSpeed));
    } else if (key === 'Enter') {
      oneTimeRecord = true;
    } else if (key === 'Escape') {
      if (recordingFrame > 0) {
        zip.generateAsync({type: 'blob'})
          .then((blob) => {
            saveAs(blob, `recorded_frames_${recordingFrame}.zip`);

            zip = new JSZip();
            recordingFrame = 0;
            frameCounterElement.textContent = '';
          });
      }

    }
  }

  if (key === 'b') {
    backgroundOpaque = !backgroundOpaque;

    if (backgroundOpaque) {
      viewer.gl.clearColor(0, 0, 0, 1);

      sequenceNameElement.style.color = 'white';
      frameCounterElement.style.color = 'white';
    } else {
      viewer.gl.clearColor(0, 0, 0, 0);

      sequenceNameElement.style.color = 'black';
      frameCounterElement.style.color = 'black';
    }
  }
});
