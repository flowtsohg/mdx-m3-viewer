class WeuResults extends Component {
  constructor(results) {
    super();

    if (results.ok) {
      let changes = results.changes;

      if (changes.length) {
        createElement({ textContent: `Converted with ${changes.length} changes!`, container: this.container });

        let changesTable = createElement({ tagName: 'table', className: 'hidden' });
        let tbody = changesTable.createTBody();
        let thead = changesTable.createTHead();

        let header = thead.insertRow();
        addTextToRow(header, '#');
        addTextToRow(header, 'Type');
        addTextToRow(header, 'Reason');
        addTextToRow(header, 'Change');
        addTextToRow(header, 'Stack');

        for (let i = 0, l = changes.length; i < l; i++) {
          let change = changes[i];

          let row = tbody.insertRow();
          addTextToRow(row, `${i + 1}`);
          addTextToRow(row, change.type);
          addTextToRow(row, change.reason);
          addTextToRow(row, change.data);
          addTextToRow(row, change.stack);
        }

        new Toggle('Show the changes', 'Hide the changes', (e) => {
          if (e.clicked) {
            showElement(changesTable);
          } else {
            hideElement(changesTable);
          }
        }, { container: this.container });

        this.container.appendChild(changesTable);
      } else {
        createElement({ textContent: 'Found nothing to convert!', container: this.container });
      }
    } else {
      createElement({ className: 'error', textContent: results.error, container: this.container });
      createElement({ className: 'error', textContent: 'Did nothing due to errors', container: this.container });
    }
  }
}
