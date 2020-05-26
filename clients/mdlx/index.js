ModelViewer = ModelViewer.default;

let Model = ModelViewer.parsers.mdlx.Model;

console.log('Viewer version', ModelViewer.version);

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
        let model = new Model(e.target.result);
        let buffer;
        let type;

        if (ext === '.mdl') {
          buffer = model.saveMdx();
          type = 'application/octet-stream';
          ext = 'mdx';
        } else {
          buffer = model.saveMdl();
          type = 'text/plain';
          ext = 'mdl'
        }

        saveAs(new Blob([buffer], { type }), name.slice(0, -3) + ext);
      });

      if (ext === '.mdl') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  }
});
