let converter = new WeuConverter(document.body);

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  converter.convertFile(e.dataTransfer.files[0]);
});
