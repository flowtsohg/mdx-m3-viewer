ModelViewer = ModelViewer.default;

let mdlx = ModelViewer.parsers.mdlx;
let Model = mdlx.Model;
let handlers = ModelViewer.viewer.handlers;

let glMatrix = ModelViewer.common.glMatrix;
let vec3 = glMatrix.vec3;
let quat = glMatrix.quat;

console.log('Viewer version', ModelViewer.version);

// Allow to list textures etc. and have random access for deletions.
// Every object needs a unique identifier, this is the easiest way to get one without touching the parser.
let UUID = 0;
function generateUUID() {
  return UUID++;
}

Vue.mixin({
  methods: {
    generateUUID,
  }
});

Vue.component('model', {
  props: ['model'],
  template: `
    <div>
      <table>
        <tr>
          <td>Version</td>
          <td>{{ model.version }}</td>
        </tr>
        <tr>
          <td>Name</td>
          <td><input v-model="model.name"></td>
        </tr>
        <tr>
          <td>Animation file</td>
          <td><input v-model="model.animationFile"></td>
        </tr>
      </table>
    </div>
  `
});

function createListComponent(name, dataConstructor, template, methods, createObject) {
  // List.
  Vue.component(name + 's', {
    props: ['model', 'objects'],
    template: `
    <div>
      <ol>
        <${name} v-for="(object, index) in objects" :key="generateUUID()" :model="model" :object="object" :objects="objects" :index="index" @delete="deleteObject"></${name}>
      </ol>
      <button @click="createObject">Add a new ${name}</button>
    </div>
    `,
    methods: {
      createObject() {
        this.objects.push(createObject());
      },
      deleteObject(object) {
        let index = this.objects.indexOf(object);

        this.objects.splice(index, 1);
      },
    }
  });

  // Object.
  Vue.component(name, {
    props: ['model', 'object', 'objects', 'index'],
    data: (component) => {
      let status = {
        warning: false,
        severe: false,
        error: false,
        messages: [],
      };
      let data = dataConstructor(component, status);

      return {
        ...status,
        ...data,
      };
    },
    template,
    methods,
  });
}

createListComponent(
  'sequence',
  (component, status) => {
    let object = component.object;
    let name = object.name;
    let start = object.interval[0];
    let end = object.interval[1];
    let objects = component.objects;
    let index = component.index;

    if (index > 0 && start < objects[index - 1].interval[1]) {
      status.severe = true;
      status.messages.push('This sequence starts before the previous sequence ends');
    }

    if (index < objects.length - 1 && end > objects[index + 1].interval[0]) {
      status.severe = true;
      status.messages.push('This sequence ends before the next sequence starts');
    }

    return {
      name,
      start,
      end,
    };
  },
  `
  <li :class="{ warning, severe, error }" :title="messages.join('\\n')" >
    <table>
      <tr>
        <td>Name</td>
        <td><input v-model="name" @change="onChanged"></td>
      </tr>
      <tr>
        <td>Interval</td>
        <td>
          <input v-model.number="start" type="number" @change="onChanged" >
          <input v-model.number="end" type="number" @change="onChanged" >
        </td>
      </tr>
    </table>
    <button @click="$emit('delete', object)">Delete</button>
  </li>
  `,
  {
    onChanged(e) {
      let sequence = this.object;

      sequence.name = this.name;
      sequence.interval[0] = this.start;
      sequence.interval[1] = this.end;
    },
    dragStart(e) {
      e.preventDefault();
      console.log(e)
      return false;
    }
  },
  () => {
    return new mdlx.Sequence();
  }
);

createListComponent(
  'global-sequence',
  (component, status) => {
    let frame = component.object.valueOf(); // Unbox the Number object.

    if (frame < 0) {
      status.warning = true;
      status.messages.push('This global sequence has a negative length');
    } else if (frame === 0) {
      status.warning = true;
      status.messages.push('This global sequence has no length');
    }

    return {
      frame,
    };
  },
  `
  <li :class="{ warning, severe, error }" :title="messages.join('\\n')">
    <table>
      <tr>
        <td>Length</td>
        <td><input v-model.number="frame" type="number" @change="onChanged" ></td>
      </tr>
    </table>

    <button @click="$emit('delete', object)">Delete</button>
  </li>
  `,
  {
    onChanged(e) {
      let frame = this.frame;

      this.warning = false;
      this.messages.length = 0;

      if (frame < 0) {
        this.warning = true;
        this.messages.push('This global sequence has a negative length');
      } else if (frame === 0) {
        this.warning = true;
        this.messages.push('This global sequence has no length');
      }

      this.objects[this.index] = this.frame;
    }
  },
  () => {
    return new Number();
  }
);

// FILTER MODE SELECTION
Vue.component('select-filter-mode', {
  props: ['filterMode'],
  template: `
    <select>
      <option>None</option>
      <option>Transparent</option>
      <option>Blend</option>
      <option>Additive</option>
      <option>Additive</option>
      <option>Modulate</option>
      <option>Modulate x2</option>
    </select>
  `,
  mounted() {
    this.$el.selectedIndex = this.filterMode;
  }
});

// TEXTURE SELECTION
Vue.component('select-texture', {
  props: ['model', 'textureId'],
  template: `
    <select>
      <option v-for="(texture, index) in model.textures">{{ getTextureName(texture) }}</option>
    </select>
  `,
  mounted() {
    this.$el.selectedIndex = this.textureId;
  },
  methods: {
    getTextureName(texture) {
      let replaceableId = texture.replaceableId;

      if (replaceableId === 0) {
        return texture.path;
      } else if (replaceableId === 1) {
        return 'Team Color';
      } else if (replaceableId === 2) {
        return 'Team Glow';
      } else {
        return `Replaceable ${replaceableId}`;
      }
    }
  }
});

createListComponent(
  'layer',
  (component) => {
    let object = component.object;

    return {
      filterMode: object.filterMode,
      textureId: object.textureId,
      coordId: object.coordId,
      alpha: object.alpha,
    };
  },
  `
  <li>
    <table>
      <tr>
        <td>Filter</td>
        <td><select-filter-mode :filterMode="filterMode"></select-filter-mode></td>
      </tr>
      <tr>
        <td>Texture</td>
        <td><select-texture :model="model" :textureId="textureId"></select-texture></td>
      </tr>
      <tr>
        <td>UV set</td>
        <td><input v-model.number="coordId" type="number" @change="onChanged" ></td>
      </tr>
      <tr>
        <td>Alpha</td>
        <td><input v-model.number="alpha" type="number" step="0.01" @change="onChanged" ></td>
      </tr>
    </table>
    <button @click="$emit('delete', object)">Delete</button>
  </li>
  `,
  {
    onChanged(e) {
      console.log(this.model)
    }
  },
  () => {
    let layer = new mdlx.Layer();

    layer.textureId = 0;

    return layer;
  }
);

createListComponent(
  'material',
  (component) => {
    let object = component.object;

    return {
      priorityPlane: object.priorityPlane,
    };
  },
  `
  <li>
    <table>
      <tr>
        <td>Priority Plane</td>
        <td><input v-model.number="priorityPlane" type="number" @change="onChanged" ></td>
      </tr>
    </table>

    <div>Layers</div>
    <layers :model="model" :objects="object.layers"></layers>

    <button @click="$emit('delete', object)">Delete</button>
  </li>
  `,
  {
    onChanged(e) {

    }
  },
  () => {
    return new mdlx.Material();
  }
);

function replaceableIdToIndex(replaceableId) {
  if (replaceableId === 0) {
    return 0;
  } else if (replaceableId === 1) {
    return 1;
  } else if (replaceableId === 2) {
    return 2;
  } else {
    throw 'asdsadasd';
  }
}

// FILTER MODE SELECTION
Vue.component('select-replaceable-id', {
  props: ['replaceableId'],
  template: `
    <select>
      <option>None</option>
      <option>Team Color</option>
      <option>Team Glow</option>
      <option>Cliff</option>
      <option>Lordaeron Tree</option>
      <option>Ashenvale Tree</option>
      <option>Barrens Tree</option>
      <option>Northrend Tree</option>
      <option>Mushroom Tree</option>
      <option>Ruins Tree</option>
      <option>Outland Mushroom Tree</option>
    </select>
  `,
  mounted() {
    this.$el.selectedIndex = replaceableIdToIndex(this.replaceableId);
  }
});

createListComponent(
  'texture',
  (component) => {
    let object = component.object;

    return {
      path: object.path,
      replaceableId: object.replaceableId,
      wrapS: !!(object.flags & 0x1),
      wrapT: !!(object.flags & 0x2),
    };
  },
  `
  <li>
    <table>
      <tr>
        <td>Path</td>
        <td><input v-model="path" @change="onChanged"></td>
      </tr>
      <tr>
        <td>Replaceable ID</td>
        <td><select-replaceable-id :replaceableId="replaceableId"></select-replaceable-id></td>
      </tr>
    </table>

    <div>
      <input type="checkbox" :id="\`wrapS\${_uid}\`" v-model="wrapS" @change="onChanged">
      <label :for="\`wrapS\${_uid}\`">Wrap Width</label>
      <input type="checkbox" :id="\`wrapT\${_uid}\`" v-model="wrapT" @change="onChanged">
      <label :for="\`wrapT\${_uid}\`">Wrap Height</label>
    </div>

    <button @click="$emit('delete', object)">Delete</button>
  </li>
  `,
  {
    onChanged(e) {
      let texture = this.object;
      let flags = 0;

      if (this.wrapS) {
        flags |= 0x1;
      }

      if (this.wrapT) {
        flags |= 0x2;
      }

      texture.path = this.path;
      texture.replaceableId = this.replaceableId;
      texture.flags = flags;
    }
  },
  () => {
    return new mdlx.Texture();
  }
);

function setupViewer(canvas) {
  let viewer = new ModelViewer.viewer.ModelViewer(canvas);

  viewer.gl.clearColor(0.7, 0.7, 0.7, 1);

  viewer.addHandler(handlers.mdx);
  viewer.addHandler(handlers.blp);
  viewer.addHandler(handlers.tga);
  viewer.addHandler(handlers.dds);

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

  viewer.addScene();

  (function step() {
    requestAnimationFrame(step);

    viewer.updateAndRender();
  })();

  return viewer;
}

let app = new Vue({
  el: '#app',
  data: {
    loadMessage: 'Drag and drop a model (*.mdl, *.mdx) to load it',
    viewer: null,
    model: null,
    chunk: 'model',
  },
  mounted() {
    this.viewer = setupViewer(document.getElementById('viewer'));
  },
  methods: {
    loadModel(model) {
      this.model = model;

      let viewer = this.viewer;

      viewer.clear();

      let scene = viewer.addScene();

      let viewerModel = viewer.load(model, (src, params) => {
        if (src === model) {
          return src;
        } else {
          return `https://www.hiveworkshop.com/data/static_assets/mpq/tft/${src}`;
        }
      });

      viewerModel.then((model) => {
        let instance = model.addInstance();

        instance.setScene(scene);
      });

      // Timeout because this code is running before Vue updates the DOM.
      setTimeout(() => setupCamera(scene, 500), 0);
    }
  }
});


document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  for (let file of e.dataTransfer.files) {
    let name = file.name;
    let ext = name.substr(name.lastIndexOf('.')).toLowerCase();

    if (ext === '.mdx' || ext === '.mdl') {
      let reader = new FileReader();

      reader.addEventListener('loadend', (e) => {
        app.loadModel(new Model(e.target.result))
      });

      if (ext === '.mdl') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  }
});
