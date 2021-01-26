let rebuilder = new Rebuilder(document.body);

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  rebuilder.rebuildFile(e.dataTransfer.files[0]);
});
