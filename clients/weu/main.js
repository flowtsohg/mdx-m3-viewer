ModelViewer = ModelViewer.default;

let parsers = ModelViewer.parsers;
let ini = parsers.ini;
let w3x = parsers.w3x;
let mpq = parsers.mpq;
let utils = ModelViewer.utils;

let ok = false;

let triggerData = new w3x.wtg.TriggerData();
let weTriggerData = new w3x.wtg.TriggerData();
let output = new LogStream(document.getElementById('output'));

output.log(
  'Fetching files: "UI\\TriggerData.txt", "TriggerDataWEU.txt", "TriggerDataYDWE.txt", "TriggerDataPTR129.txt"'
);
output.br();
output.log('Please wait...');
output.br();

async function fetchAsText(file) {
  return await (await fetch(file)).text();
}

// Load the TriggerData.txt files.
Promise.all([
  fetchAsText(localOrHive('ui\\triggerdata.txt')),
  fetchAsText('TriggerDataWEU.txt'),
  fetchAsText('TriggerDataYDWE.txt')
]).then(results => {
  weTriggerData.addTriggerData(results[0]); // WE trigger data

  triggerData.addTriggerData(results[0]); // WE trigger data
  triggerData.addTriggerData(results[1], true); // WEU trigger data
  triggerData.addTriggerData(results[2], true); // YDWE trigger data

  ok = true;

  output.log('Ready, drag and drop a TFT map (*.w3x) or campaign (*.w3n) anywhere on the page.');
  output.br();
});

function addCellToRow(row, data) {
  let cell = row.insertCell();

  cell.appendChild(document.createTextNode(data));
}

// Convert a map.
function handleMap(output, arrayBuffer) {
  output.indent();
  output.log('Checking');
  output.br();

  let map = new w3x.Map(arrayBuffer);
  let changesCount = 0;
  let data = utils.convertWeu(map, triggerData, weTriggerData);

  if (data.ok) {
    let changes = data.changes;

    if (changes.length) {
      changesCount = changes.length;

      output.log(`Converted with ${changes.length} changes!`);
      output.br();
      output.indent();

      // Possibly lots of changes which will result in lots of DOM entries being added, so optimize it.
      output.start();

      let table = document.createElement('table');
      let tbody = table.createTBody();
      let thead = table.createTHead();

      let header = thead.insertRow();
      addCellToRow(header, '#');
      addCellToRow(header, 'Type');
      addCellToRow(header, 'Reason');
      addCellToRow(header, 'Change');
      addCellToRow(header, 'Stack');

      for (let i = 0, l = changes.length; i < l; i++) {
        let change = changes[i];

        let row = tbody.insertRow();

        addCellToRow(row, `${i + 1}`);
        addCellToRow(row, change.type);
        addCellToRow(row, change.reason);
        addCellToRow(row, change.data);
        addCellToRow(row, change.stack);
      }

      let showHide = document.createElement('button');
      showHide.textContent = 'CLICK HERE TO SHOW OR HIDE THE CHANGES';

      table.style.display = 'none';

      showHide.addEventListener('click', () => {
        if (table.style.display === 'none') {
          table.style.display = 'table'
        } else {
          table.style.display = 'none';
        }
      });

      output.append(showHide);
      output.br();
      output.append(table);
      output.unindent();

      // Commit all of the DOM changes.
      output.commit();
    } else {
      output.log(`Found nothing to convert!`);
      output.br();
    }
  } else {
    output.error(data.error);
    output.br();
    output.error('Did nothing due to errors');
    output.br();
  }

  output.unindent();

  return { map, changes: changesCount };
}

// Convert a campaign.
function handleCampaign(output, arrayBuffer) {
  output.indent();
  output.log('Looking for maps');
  output.br();

  let campaign = new mpq.Archive(arrayBuffer);
  let totalChanges = 0;
  let changedMaps = 0;

  for (let name of campaign.getFileNames()) {
    if (name.substr(name.lastIndexOf('.')).toLowerCase() === '.w3x') {
      output.log(`Loading ${name}`);
      output.br();

      let { map, changes } = handleMap(output, campaign.get(name).arrayBuffer());

      if (changes) {
        totalChanges += changes;
        changedMaps += 1;

        campaign.set(name, map.save());

        output.log(`Replaced ${name}`);
        output.br();
      }
    }
  }

  if (totalChanges) {
    output.unindent();
    output.log(`Converted with a total of ${totalChanges} changes spread over ${changedMaps} maps!`);
    output.br();
  } else {
    output.log(`Found nothing to convert!`);
    output.br();
  }

  return { campaign, changes: totalChanges };
}

// A Promise-based FileReader.readAsArrayBuffer.
function readFileAsArrayBuffer(file) {
  return new Promise(resolve => {
    let reader = new FileReader();

    reader.addEventListener('loadend', e => {
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
    let isMap = ext === '.w3x';
    let isCampaign = ext === '.w3n';

    if (isMap || isCampaign) {
      output.clear();
      output.log(`Loading ${name}...`);
      output.br();

      let arrayBuffer = await readFileAsArrayBuffer(file);
      let result;
      let mapOrCampaign;

      if (isMap) {
        result = handleMap(output, arrayBuffer);
        mapOrCampaign = result.map;
      } else {
        result = handleCampaign(output, arrayBuffer);
        mapOrCampaign = result.campaign;
      }

      if (result.changes) {
        name = `${name.slice(0, -4)}_no_weu${ext}`;

        output.log(`Saving as ${name}`);
        output.br();

        window.scrollTo(0, output.container.scrollHeight);

        saveAs(new Blob([mapOrCampaign.save()], { type: 'application/octet-stream' }), name);
      }
    }
  }
}

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  // Only proceed if the TriggerData.txt files finished downloading.
  if (ok) {
    handleDrop(e.dataTransfer);
  }
});
