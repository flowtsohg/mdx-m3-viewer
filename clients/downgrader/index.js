import War3Map from '../../src/parsers/w3x/map';
import War3MapW3i from '../../src/parsers/w3x/w3i/file';
import War3MapDoo from '../../src/parsers/w3x/doo/file';
import War3MapUnitsDoo from '../../src/parsers/w3x/unitsdoo/file';

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  const reader = new FileReader();

  reader.addEventListener('loadend', (e) => {
    const buffer = e.target.result;
    const map = new War3Map();

    map.load(buffer);

    const w3i = new War3MapW3i();
    w3i.load(map.get('war3map.w3i').arrayBuffer());

    if (w3i.version > 25) {
      console.log(`war3map.w3i version ${w3i.version} => 25`);

      w3i.version = 25;
      map.set('war3map.w3i', w3i.save());
    }

    const buildVersion = w3i.getBuildVersion();

    if (buildVersion > 131) {
      console.log(`war3map.doo buildVersion ${buildVersion} => 0`);

      const doo = new War3MapDoo();
      doo.load(map.get('war3map.doo').arrayBuffer(), buildVersion);
      console.log(doo)
      map.set('war3map.doo', doo.save(0));

      console.log(`war3mapUnits.doo buildVersion ${buildVersion} => 0`);

      const unitsDoo = new War3MapUnitsDoo();
      unitsDoo.load(map.get('war3mapUnits.doo').arrayBuffer(), buildVersion);
      console.log(unitsDoo)
      map.set('war3mapUnits.doo', unitsDoo.save(0));

      console.log('Deleting the triggers, because this is a Reforged map, and my code does not support Reforged triggers (yet?)');

      map.delete('war3map.wtg');
    }

    saveAs(new Blob([map.save().buffer], { type: 'application/octet-stream' }), 'downgraded_' + file.name);
  });

  reader.readAsArrayBuffer(file);
});
