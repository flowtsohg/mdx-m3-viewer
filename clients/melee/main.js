let w3x = ModelViewer.default.parsers.w3x;

function onLocalLoaded(e, name) {
    let buffer = e.target.result;

    console.log('Reading the map');

    let map = new w3x.Map(buffer);

    console.log('Setting the map melee flag');

    map.flags |= 0x4;

    console.log('Reading war3map.w3i');

    let w3i = new w3x.w3i.File(map.get('war3map.w3i').arrayBuffer());

    console.log('Setting the w3i melee flag');

    w3i.flags |= 0x4;

    console.log('Saving war3map.w3i');

    map.set('war3map.w3i', w3i.save());

    let newName = `${name.substr(0, name.length - 4)}_melee${name.substr(-4)}`;

    console.log(`Saving the map as "${newName}"`);

    saveAs(new Blob([map.save()], {type: 'application/octet-stream'}), newName);

}

function onFileDrop(e) {
    let file = e.dataTransfer.files[0];
    let name = file.name.toLowerCase();

    if (file && (name.endsWith('.w3m') || name.endsWith('.w3x'))) {
        let reader = new FileReader();

        reader.addEventListener('loadend', (e) => onLocalLoaded(e, file.name));

        reader.readAsArrayBuffer(file);
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
