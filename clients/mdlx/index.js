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
        let buffer = e.target.result;
        let model = new Model(buffer);
        let blob;

        if (ext === '.mdl') {
          blob = new Blob([model.saveMdx()], { type: 'application/octet-stream' });
          name = name.slice(0, -3) + 'mdx';
        } else {
          blob = new Blob([model.saveMdl()], { type: 'text/plain' });
          name = name.slice(0, -3) + 'mdl';
        }

        saveAs(blob, name);
      });

      if (ext === '.mdl') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  }
});
