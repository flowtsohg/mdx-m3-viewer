class TestMeta extends Component {
  constructor(name, parsingError, results, options) {
    super({ ...options, className: 'clickable highlightable padded' });

    this.name = createElement({ className: 'bold', textContent: name, container: this.container });

    let container = createElement({ className: 'indent', container: this.container });

    if (parsingError) {
      createElement({ className: 'error', textContent: 'Parsing failed', container });
    }

    if (results) {
      results = results.results;

      if (results.errors || results.severe || results.warnings || results.unused) {
        if (results.errors) {
          createElement({ className: 'error', textContent: `${results.errors} errors`, container });
        }

        if (results.severe) {
          createElement({ className: 'severe', textContent: `${results.severe} severe warnings`, container });
        }

        if (results.warnings) {
          createElement({ className: 'warning', textContent: `${results.warnings} warnings`, container });
        }

        if (results.unused) {
          createElement({ className: 'unused', textContent: `${results.unused} unused`, container });
        }
      } else {
        createElement({ className: 'bold', textContent: 'Passed', container });
      }
    } else {
      createElement({ className: 'bold', textContent: 'Not tested', container });
    }
  }
}
