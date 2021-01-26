class WeuMeta extends Component {
  constructor(converter, results) {
    super();

    this.changes = null;
    this.changesToggle = null;

    if (results.ok) {
      let changes = results.changes;

      if (changes.length) {
        createElement({ textContent: `Converted with ${changes.length} changes`, container: this.container });

        this.changes = new WeuChanges(converter, changes);

        this.changesToggle = new Toggle('Show the changes', 'Hide the changes', (e) => {
          if (e.clicked) {
            converter.showChanges(this);
          } else {
            converter.hideChanges();
          }
        }, { container: this.container });
      } else {
        createElement({ textContent: 'Found nothing to convert!', container: this.container });
      }
    } else {
      createElement({ className: 'error', textContent: results.error, container: this.container });
      createElement({ className: 'error', textContent: 'Did nothing due to errors', container: this.container });
    }
  }
}
