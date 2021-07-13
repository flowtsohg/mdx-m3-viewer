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
    w3i.version = 25;
    map.set('war3map.w3i', w3i.save());

    const buildVersion = w3i.getBuildVersion();

    const doo = new War3MapDoo();
    doo.load(map.get('war3map.doo').arrayBuffer(), buildVersion);
    map.set('war3map.doo', doo.save(0));

    const unitsDoo = new War3MapUnitsDoo();
    unitsDoo.load(map.get('war3mapUnits.doo').arrayBuffer(), buildVersion);
    map.set('war3mapUnits.doo', unitsDoo.save(0));

    map.delete('war3map.wtg');

    saveAs(new Blob([map.save().buffer], { type: 'application/octet-stream' }), 'downgraded_' + file.name);
  });

  reader.readAsArrayBuffer(file);
});
