class UnitTester extends Component {
  constructor(parentElement) {
    super();

    this.mismatchPercentageForFailure = 1;
    this.passed = 0;

    let unitTester = new ModelViewer.default.utils.UnitTester(wc3Solver);

    unitTester.add(mdxTests);
    unitTester.add(mdxPrimitivesTests);
    unitTester.add(m3Tests);
    unitTester.add(baseTests);

    this.unitTester = unitTester;

    createElement({ tagName: 'b', textContent: `Viewer version ${ModelViewer.default.version}`, container: this.container });
    createElement({ tagName: 'hr', container: this.container });

    let controls = createElement({ container: this.container });

    this.runButton = createElement({ tagName: 'button', textContent: 'Run', onclick: () => this.run(), container: controls });
    this.downloadButton = createElement({ tagName: 'button', textContent: 'Download', onclick: () => this.download(), container: controls });

    createElement({ tagName: 'hr', container: this.container });

    this.resultsContainer = createElement({ className: 'hidden', container: this.container });

    this.resultsMeta = createElement({ container: this.resultsContainer });

    let resultsTable = createElement({ tagName: 'table', container: this.resultsContainer });

    this.tbody = resultsTable.createTBody();

    let thead = resultsTable.createTHead();

    let header = thead.insertRow();
    addElementToRow(header, createElement({ className: 'bold', textContent: 'Name' }));
    this.headerResult = addElementToRow(header, createElement({ className: 'bold', textContent: 'Result' }));
    this.headerNew = addElementToRow(header, createElement({ className: 'bold', textContent: 'New' }));
    this.headerOld = addElementToRow(header, createElement({ className: 'bold', textContent: 'Old' }));

    parentElement.appendChild(this.container);
  }

  clear() {
    let section = this.tbody;

    for (let l = section.rows.length - 1, i = l; i >= 0; i--) {
      section.deleteRow(i);
    }
  }

  result(result) {
    let row = this.tbody.insertRow();

    addTextToRow(row, result.name);

    if (result.mismatchPercentage !== undefined) {
      let passed = result.mismatchPercentage < this.mismatchPercentageForFailure;

      if (passed) {
        this.passed += 1;
      }

      let total = this.unitTester.tests.length;
      let ran = this.tbody.rows.length;

      let className = 'passed';

      if (this.passed < ran) {
        className = 'failed';
      }

      this.resultsMeta.className = className;
      this.resultsMeta.textContent = `${this.passed} / ${ran} (${total} total)`;

      let name = passed ? 'passed' : 'failed';

      addElementToRow(row, createElement({ className: name, textContent: name }))

      if (result.testImage) {
        let wrapper = createElement({ tagName: 'a', className: 'center', href: result.testImage.src, target: '_blank' });

        wrapper.appendChild(result.testImage);

        addElementToRow(row, wrapper);
      } else {
        addTextToRow(row, '');
      }

      if (result.comparisonImage) {
        let wrapper = createElement({ tagName: 'a', className: 'center', href: result.comparisonImage.src, target: '_blank' });

        wrapper.appendChild(result.comparisonImage);

        addElementToRow(row, wrapper);
      } else {
        addTextToRow(row, '');
      }
    }
  }

  run() {
    this.passed = 0;

    this.runButton.disabled = true;
    this.downloadButton.disabled = true;

    this.clear();

    // In case they were hidden.
    showElement(this.headerResult);
    showElement(this.headerNew);
    showElement(this.headerOld);

    // In case it was hidden.
    showElement(this.resultsContainer);

    this.unitTester.test((entry) => {
      if (!entry.done) {
        let result = entry.value;

        if (result.result < 1) {
          this.passed++;
        }

        this.result(result);
      } else {
        this.runButton.disabled = false;
        this.downloadButton.disabled = false;
      }
    });
  }

  download() {
    this.passed = 0;

    this.runButton.disabled = true;
    this.downloadButton.disabled = true;

    this.clear();

    // In case they were shown.
    hideElement(this.headerResult);
    hideElement(this.headerNew);
    hideElement(this.headerOld);

    // In case it was hidden.
    showElement(this.resultsContainer);

    let zip = new JSZip();

    this.unitTester.download((entry) => {
      if (!entry.done) {
        let result = entry.value;

        this.result(result);

        if (result.blob) {
          this.passed++;

          zip.file(`${result.name}.png`, result.blob);
        } else {
          console.log(`Skipping ${result.name} because it has no blob`);
        }
      } else {
        this.runButton.disabled = false;
        this.downloadButton.disabled = false;

        zip.generateAsync({ type: 'blob' })
          .then((blob) => {
            saveAs(blob, `compare_${ModelViewer.default.version}.zip`);
          });
      }
    });
  }
}
