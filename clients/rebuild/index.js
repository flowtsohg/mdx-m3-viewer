ModelViewer = ModelViewer.default;

let parsers = ModelViewer.parsers;
let ini = parsers.ini;
let w3x = parsers.w3x;
let mpq = parsers.mpq;
let utils = ModelViewer.utils;
let ok = false;
let output = new LogStream(document.getElementById('output'));

output.log('Fetching files: "Scripts\\common.j", "Scripts\\Blizzard.j"');
output.br();
output.log('Please wait...');
output.br();

let commonj;
let blizzardj;

async function fetchAsText(file) {
  return await (await fetch(file)).text();
}

Promise.all([fetchAsText(localOrHive('scripts\\common.j')), fetchAsText(localOrHive('scripts\\blizzard.j'))])
  .then((results) => {
    commonj = results[0];
    blizzardj = results[1];
    ok = true;

    output.log('Ready, drag and drop a map (*.w3m, *.w3x) anywhere on the page.');
    output.br();
  });

// A Promise-based FileReader.readAsArrayBuffer.
function readFileAsArrayBuffer(file) {
  return new Promise((resolve) => {
    let reader = new FileReader();

    reader.addEventListener('loadend', (e) => {
      resolve(e.target.result);
    });

    reader.readAsArrayBuffer(file);
  });
}

async function handleDrop(dataTransfer) {
  // Allow to convert multiple files in one drop, because why not.
  // Even though the output gets cleared for each one, so you'd only see the changes for the last one :)
  for (let file of dataTransfer.files) {
    let name = file.name;
    let ext = name.substr(name.lastIndexOf('.')).toLowerCase();
    let isMap = ext === '.w3m' || ext === '.w3x';

    if (isMap) {
      output.clear();
      output.log(`Loading ${name}...`);
      output.br();

      let arrayBuffer = await readFileAsArrayBuffer(file);
      let map = new w3x.Map(arrayBuffer);

      utils.jass2.rebuild(map, commonj, blizzardj, (msg) => {
        output.log(msg);
        output.br();
      });

      saveAs(new Blob([map.get('war3mapUnits.doo').arrayBuffer()], {type: 'application/octet-stream'}), `war3mapUnits.doo`);
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

  // Only proceed if the TriggerData.txt files finished downloading.
  if (ok) {
    handleDrop(e.dataTransfer);
  }
});
