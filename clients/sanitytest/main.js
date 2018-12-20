ModelViewer = ModelViewer.default;

let math = ModelViewer.common.math;
let glMatrix = ModelViewer.common.glMatrix;
let vec2 = glMatrix.vec2;
let vec3 = glMatrix.vec3;
let vec4 = glMatrix.vec4;
let quat = glMatrix.quat;
let mat3 = glMatrix.mat3;
let mat4 = glMatrix.mat4;
let geometry = ModelViewer.common.geometry;
let handlers = ModelViewer.viewer.handlers;

let testsElement = document.getElementById('tests');

let statusElement = document.getElementById('status');
statusElement.textContent = 'Drop any combination of models (.mdl, .mdx), textures (.blp), or maps (.w3m, .w3x) to test them.'

console.log('Viewer version', ModelViewer.version);

let canvas = document.getElementById('canvas');
let viewer = new ModelViewer.viewer.ModelViewer(canvas);

viewer.gl.clearColor(0.7, 0.7, 0.7, 1);
viewer.noCulling = true;

viewer.addHandler(handlers.mdx); // Will add BLP too.
viewer.addHandler(handlers.geo);

viewer.on('error', (target, error, reason) => {
  let parts = [error];

  if (reason) {
    parts.push(reason);
  }

  if (target.fetchUrl) {
    parts.push(target.fetchUrl);
  }

  console.error('ERROR', parts.join(' '));
});

let scene = viewer.addScene();

setupCamera(scene, 500);

(function step() {
  requestAnimationFrame(step);

  viewer.updateAndRender();
}());

let textureModel = viewer.load({
  geometry: geometry.createUnitRectangle(),
  material: {renderMode: 0, twoSided: true, isBGR: true}
}, src => [src, '.geo', false]);

function nodeName(node) {
  let name = [node.objectType];

  if (typeof node.index === 'number') {
    name.push(node.index);
  }

  if (typeof node.name === 'string') {
    name.push(`'${node.name}'`);
  }

  return name.join(' ');
}

function nodeTooltip(node) {
  let message = node.message;

  if (message.startsWith('No opening') || message.startsWith('No closing')) {
    return 'Having no tracks at the beginning or ending of an animation can sometimes cause weird animations.\nThis can usually be ignored.'
  } else if (message.startsWith('Number of sequence extents')) {
    return 'Having more extents than sequences will cause Magos to crash.\nI am not sure if any program is affected by having too few.\nThe game does not care either way.';
  } else if (message.endsWith('is not in any sequence')) {
    return 'This track seems to be useless.';
  } else if (message.includes('empty animation file')) {
    return 'The animation file path is probably a leftover from the beta.\nWE crashes when it is not empty.';
  }
}

function addTooltip(element, node) {
  let tooltip = nodeTooltip(node);

  if (tooltip) {
    element.className += ' tooltip';
    element.title = tooltip;
  }
}

function handleTestNode(stream, node) {
  if (node.warnings || node.errors || node.uses === 0) {
    let name = nodeName(node);

    if (node.errors) {
      stream.error(name);
    } else if (node.warnings) {
      stream.warn(name);
    } else if (node.uses === 0) {
      stream.unused(name);
    }

    stream.br();
    stream.indent();

    if (node.uses === 0) {
      stream.unused('Not used');
      stream.br();
    }

    if (node.children) {
      for (let child of node.children) {
        handleTestNode(stream, child);
      }
    }

    stream.unindent();
  } else if (node.type === 'warning') {
    let element = stream.warn(node.message);

    addTooltip(element, node);

    stream.br();
  } else if (node.type === 'error') {
    let element = stream.error(node.message);

    addTooltip(element, node);

    stream.br();
  }
}

function renderModelTest(name, model) {
  let stream = new LogStream(document.createElement('div'));
  let result = ModelViewer.utils.mdxSanityTest(model);
  let header = stream.start();
  let body = null;

  stream.info(`${name}: `);

  if (result.errors || result.warnings || result.unused) {
    let added = false;

    if (result.errors) {
      stream.error(`${result.errors} error${result.errors === 1 ? '' : 's'}`);
      added = true;
    }

    if (result.warnings) {
      if (added) {
        stream.info(', ');
      }

      stream.warn(`${result.warnings} warning${result.warnings === 1 ? '' : 's'}`);

      added = true;
    }

    if (result.unused) {
      if (added) {
        stream.info(', ');
      }

      stream.unused(`${result.unused} unused`);
    }

    stream.commit();

    body = stream.start();
    stream.indent();

    for (let node of result.nodes) {
      handleTestNode(stream, node);
    }

    stream.commit();

  } else {
    stream.log('Passed');

    stream.commit();
  }

  return {container: stream.container, header, body};
}

function renderTextureTest(name, texture) {
  let stream = new LogStream(document.createElement('div'));
  let results = ModelViewer.utils.blpSanityTest(texture);
  let header = stream.start();
  let body = null;

  stream.info(`${name}: `);

  if (results.length) {
    stream.warn(`${results.length} warning${results.length === 1 ? '' : 's'}`)

    stream.commit();

    body = stream.start();
    stream.indent();

    for (let result of results) {
      stream.warn(result);
      stream.br();
    }

    stream.commit();
  } else {
    stream.log('Passed');

    stream.commit();
  }

  return {container: stream.container, header, body};
}

class TestInstance {
  constructor(container, header, body, instance, sourceMapContainer) {
    this.container = container;
    this.header = header;
    this.body = body;
    this.instance = instance;
    this.rendered = false;
    this.sourceMapContainer = sourceMapContainer || null;

    this.hide();
  }

  show() {
    this.rendered = true;
    this.header.classList.remove('closed');
    this.header.classList.add('opened');

    if (this.body) {
      this.body.style.display = 'initial';
    }

    this.instance.show();
  }

  hide() {
    this.rendered = false;
    this.header.classList.remove('opened');
    this.header.classList.add('closed');

    if (this.body) {
      this.body.style.display = 'none';
    }

    this.instance.hide();
  }
}

let allTests = [];
let visibleTest = null;

function showTest(test) {
  if (visibleTest) {
    visibleTest.hide();
  }

  visibleTest = test;
  visibleTest.show();

  if (viewedElement) {
    viewedElement.className = 'sourceMapName';
  }

  // Clear the source map and view.
  sourceMapElement.innerHTML = '';
  sourceViewElement.innerHTML = '';

  // Add or replace the source map.
  if (visibleTest.sourceMapContainer) {
    sourceMapElement.appendChild(visibleTest.sourceMapContainer);
  }
}

function addTest(container, header, body, instance, sourceMapContainer) {
  container.style.paddingBottom = '3px';

  testsElement.appendChild(container);

  let test = new TestInstance(container, header, body, instance, sourceMapContainer);

  header.addEventListener('click', (e) => {
    if (!test.rendered) {
      header.classList.remove('closed');
      header.classList.add('opened');

      if (body) {
        body.style.display = 'initial';
      }

      showTest(test);
    }
  });

  allTests.push(test);
}

function addModelTest(name, ext, buffer, pathSolver) {
  let model = new ModelViewer.parsers.mdlx.Model();

  model.load(buffer);

  let {container, header, body} = renderModelTest(name, model);

  let viewerModel = viewer.load(buffer, (src) => {
    if (src === buffer) {
      return [src, ext, false]
    } else if (pathSolver) {
      // If an external path solver is given, this is a Hive resource, and it will handle custom textures.
      return pathSolver(src);
    } else {
      return [localOrHive(src), src.substr(src.lastIndexOf('.')), true];
    }
  });

  let instance = viewerModel.addInstance();

  instance.setScene(scene);

  instance.setSequence(0);

  instance.on('seqend', () => {
    let sequence = instance.sequence + 1;

    if (sequence === model.sequences.length) {
      sequence = 0;
    }

    instance.setSequence(sequence);
  });

  addTest(container, header, body, instance, handleSourceMap(model.saveMdl()));
}

function addTextureTest(name, ext, buffer) {
  let texture = new ModelViewer.parsers.blp.Texture();

  texture.load(buffer);

  let {container, header, body} = renderTextureTest(name, texture);

  let viewerTexture = viewer.load(buffer, (src) => {
    return [src, ext, false]
  });

  let instance = textureModel.addInstance().uniformScale(128).rotate(quat.setAxisAngle([], [0, 0, 1], Math.PI / 2));

  instance.setTexture(null, viewerTexture);

  instance.setScene(scene);

  viewerTexture.whenLoaded()
    .then(() => {
      // Don't really care about the size of the texture instance, just the proportions.
      instance.scale([viewerTexture.width / viewerTexture.height, 1, 1]);
    });

  addTest(container, header, body, instance);
}

function addMapTest(buffer) {
  let map = new ModelViewer.parsers.w3x.Map();

  map.load(buffer);

  for (let name of map.getImportNames()) {
    let file = map.get(name);
    let ext = name.substr(name.lastIndexOf('.')).toLowerCase();

    if (ext === '.mdx') {
      addModelTest(name, ext, file.arrayBuffer());
    } else if (ext === '.mdl') {
      addModelTest(name, ext, file.text());
    } else if (ext === '.blp') {
      addTextureTest(name, ext, file.arrayBuffer());
    }
  }
}

function onLocalFileLoaded(name, ext, buffer, pathSolver) {
  if (ext === '.mdx' || ext === '.mdl') {
    addModelTest(name, ext, buffer, pathSolver);
  } else if (ext === '.blp') {
    addTextureTest(name, ext, buffer);
  } else if (ext === '.w3x' || ext === '.w3m') {
    addMapTest(buffer);
  } else {
    return;
  }

  if (allTests.length) {
    statusElement.textContent = '';

    showTest(allTests[allTests.length - 1])
  } else {
    statusElement.textContent = `Nothing to check for ${name}!`;
  }
}

function handleDrop(dataTransfer) {
  for (let file of dataTransfer.files) {
    let name = file.name;
    let ext = name.substr(name.lastIndexOf('.')).toLowerCase();

    if (ext === '.mdx' || ext === '.mdl' || ext === '.blp' || ext === '.w3x' || ext === '.w3m') {
      let reader = new FileReader();

      reader.addEventListener('loadend', (e) => onLocalFileLoaded(name, ext, e.target.result));

      if (ext === '.mdl') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  }
}

document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('dragend', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();

  handleDrop(e.dataTransfer);
});

function getUrlParams() {
  let params = [];
  let search = window.location.search;

  if (search !== '') {
    for (let param of search.slice(1).split('&')) {
      let [key, value] = param.split('=');

      params.push({key, value});
    }
  }

  return params;
}

function getExt(query) {
  let match = query.match(/hiveworkshop\.com\/attachments\/.*-(.*)\.\d+/);

  if (match) {
    return `.${match[1]}`
  } else {
    let ext = query.slice(-4).toLowerCase();

    if (ext === '.mdx' || ext === '.mdl' || ext === '.blp' || ext === '.w3x' || ext === '.w3m') {
      return ext
    }
  }

  return null;
}

async function loadQuery() {
  let params = getUrlParams();
  let files = [];
  let overrides = new Map();

  for (let param of params) {
    let {key, value} = param;
    let entry = {path: value, ext: getExt(value)};

    if (key === 'file') {
      files.push(entry);
    } else if (key.startsWith('override')) {
      // Discord changes \ to / in urls, ignoring escaping, so escape manually.
      overrides.set(key.slice(9, -1).replace(/\//g, '\\'), entry);
    }
  }

  let pathSolver = (src) => {
    let override = overrides.get(src);

    if (override) {
      return [override.path, override.ext, true];
    } else {
      return [localOrHive(src), src.substr(src.lastIndexOf('.')), true];
    }
  };

  for (let file of files) {
    let path = file.path;
    let ext = file.ext;

    if (ext === '.mdx' || ext === '.mdl' || ext === '.blp' || ext === '.w3x' || ext === '.w3m') {
      let response = await fetch(path);
      let data;

      if (ext === '.mdl') {
        data = await response.text();
      } else {
        data = await response.arrayBuffer();
      }

      onLocalFileLoaded(path, ext, data, pathSolver);
    }
  }
}

loadQuery();
