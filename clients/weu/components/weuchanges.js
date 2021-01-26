class WeuChanges extends Component {
  constructor(converter, changes) {
    super({ tagName: 'table', className: 'hidden' });

    let tbody = this.container.createTBody();
    let thead = this.container.createTHead();

    let header = thead.insertRow();

    header.className = 'header';

    addTextToRow(header, '#');
    addTextToRow(header, 'Reason');
    addTextToRow(header, 'Change');
    addTextToRow(header, 'Stack');

    for (let i = 0, l = changes.length; i < l; i++) {
      let change = changes[i];

      let row = tbody.insertRow();

      row.className = change.type;

      addTextToRow(row, `${i + 1}`);
      addTextToRow(row, change.reason);
      addTextToRow(row, change.data);
      addTextToRow(row, change.stack);
    }

    converter.changesElement.appendChild(this.container);
  }
}
