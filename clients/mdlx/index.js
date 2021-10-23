import { extname } from "../../src/common/path";
import { version } from "../../src/version";
import Model from '../../src/parsers/mdlx/model';
import { saveAs } from 'file-saver';

console.log('Viewer version', version);

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
    let ext = extname(name);

    if (ext === '.mdx' || ext === '.mdl') {
      let reader = new FileReader();

      reader.addEventListener('loadend', (e) => {
        let model = new Model();
        model.load(e.target.result);

        let buffer;
        let type;

        if (ext === '.mdl') {
          buffer = model.saveMdx().buffer;
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
