class TextureAtlasGenerator {
  constructor() {
    this.inputWidthElement = document.getElementById('input_width');
    this.inputHeightElement = document.getElementById('input_height');
    this.outputCellWidthElement = document.getElementById('output_cell_width');
    this.outputCellHeightElement = document.getElementById('output_cell_height');
    this.statusElement = document.getElementById('status');
    this.inputCanvas = document.getElementById('input_canvas');
    this.workCanvas = document.getElementById('work_canvas');
    this.outputCanvas = document.getElementById('output_canvas');
    this.inputCtx = this.inputCanvas.getContext('2d');
    this.workCtx = this.workCanvas.getContext('2d');
    this.outputCtx = this.outputCanvas.getContext('2d');
    this.image = null;
    this.inputWidth = 0;
    this.inputHeight = 0;
    this.width = 256;
    this.height = 256;
    this.columns = 8;
    this.rows = 8;
    this.revolutions = 1;
    this.cellWidth = 32;
    this.cellHeight = 32;

    document.getElementById('output_width').addEventListener('change', (e) => this.setWidth(e.target.value));
    document.getElementById('output_height').addEventListener('change', (e) => this.setHeight(e.target.value));
    document.getElementById('output_columns').addEventListener('change', (e) => this.setColumns(e.target.value));
    document.getElementById('output_rows').addEventListener('change', (e) => this.setRows(e.target.value));
    document.getElementById('output_revolutions').addEventListener('change', (e) => this.setRevolutions(e.target.value));

    document.addEventListener('dragover', e => {
      e.preventDefault();
    });

    document.addEventListener('dragend', e => {
      e.preventDefault();
    });

    document.addEventListener('drop', e => {
      e.preventDefault();

      let file = e.dataTransfer.files[0];
      let reader = new FileReader();

      reader.addEventListener('loadend', (e) => {
        let image = new Image();

        image.onload = (e) => this.setImage(image);
        image.onerror = (e) => this.error('Failed to load the file');

        image.src = e.target.result;
      });

      reader.readAsDataURL(file);
    });

    this.status('Drag & drop an image anywhere on the page');
  }

  status(status) {
    this.statusElement.textContent = status;
  }

  error(status) {
    const { workCtx, workCanvas, outputCtx, outputCanvas } = this;

    workCtx.clearRect(0, 0, workCanvas.width, workCanvas.height);
    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

    this.status(status);
  }

  setImage(image) {
    const { inputCanvas, inputCtx, inputWidthElement, inputHeightElement } = this;

    this.image = image;

    inputCanvas.width = image.width;
    inputCanvas.height = image.height;

    inputCtx.drawImage(image, 0, 0);

    inputWidthElement.textContent = `${image.width}px`;
    inputHeightElement.textContent = `${image.height}px`;

    this.update();
  }

  setWidth(width) {
    this.width = width;
    this.update();
  }

  setHeight(height) {
    this.height = height;
    this.update();
  }

  setColumns(columns) {
    this.columns = columns;
    this.update();
  }

  setRows(rows) {
    this.rows = rows;
    this.update();
  }

  setRevolutions(revolutions) {
    this.revolutions = revolutions;
    this.update();
  }

  update() {
    const { image, width, height, columns, rows, revolutions } = this;

    if (!image) {
      this.error('Upload an image');
      return;
    }

    if (width < 1 || height < 1 || columns < 1 || rows < 1) {
      this.error('No negative values');
      return;
    }

    this.cellWidth = width / columns;
    this.cellHeight = height / rows;

    const { outputCellWidthElement, outputCellHeightElement, cellWidth, cellHeight } = this;

    outputCellWidthElement.textContent = `${cellWidth}px`;
    outputCellHeightElement.textContent = `${cellHeight}px`;

    if (cellWidth !== (cellWidth | 0) || cellHeight !== (cellHeight | 0)) {
      this.error('No fractional cell sizes');
      return;
    }

    const { workCanvas, outputCanvas, workCtx, outputCtx } = this;
    const step = (revolutions * Math.PI * 2) / (columns * rows);

    workCanvas.width = cellWidth;
    workCanvas.height = cellHeight;

    outputCanvas.width = width;
    outputCanvas.height = height;

    let angle = 0;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        workCtx.clearRect(0, 0, cellWidth, cellHeight);

        workCtx.save();
        workCtx.translate(cellWidth / 2, cellHeight / 2);
        workCtx.rotate(angle);
        workCtx.translate(-cellWidth / 2, -cellHeight / 2);
        workCtx.drawImage(image, 0, 0, cellWidth, cellHeight);
        workCtx.restore();

        outputCtx.drawImage(workCanvas, x * cellWidth, y * cellHeight);

        angle += step;
      }
    }

    this.status('Right click on the texture atlas to download it, or adjust values and regenerate it');
  }
}

new TextureAtlasGenerator();
