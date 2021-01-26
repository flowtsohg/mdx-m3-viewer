class Logger extends Component {
  constructor(options) {
    super({ ...options, className: 'console' });

    this.messages = [];

    this.tabs = createElement({ className: 'tabs', container: this.container });

    this.logsToggler = new Toggle('Hide Logs', 'Show Logs', (e) => this.filter(), { container: this.tabs });
    this.infoToggler = new Toggle('Hide Info', 'Show Info', (e) => this.filter(), { container: this.tabs });
    this.errorsToggler = new Toggle('Hide Errors', 'Show Errors', (e) => this.filter(), { container: this.tabs });

    this.contents = createElement({ className: 'tab-contents', container: this.container });

    // Default to hiding the log spam.
    this.logsToggler.toggle();
  }

  message(type, message) {
    let loggerMessage = new LoggerMessage(type, message);

    loggerMessage.filter(this.logsToggler.clicked, this.infoToggler.clicked, this.errorsToggler.clicked);

    this.messages.push(loggerMessage);

    // If scrolled all the way...
    let scrolled = scrolledToBottom(this.contents);

    this.contents.appendChild(loggerMessage.container);

    // ...scroll back down after adding the message.
    if (scrolled) {
      scrollToBottom(this.contents);
    }
  }

  log(message) {
    this.message('log', message);
  }

  info(message) {
    this.message('info', message);
  }

  error(message) {
    this.message('error', message);
  }

  filter() {
    // If scrolled all the way...
    let scrolled = scrolledToBottom(this.contents);

    for (let message of this.messages) {
      message.filter(this.logsToggler.clicked, this.infoToggler.clicked, this.errorsToggler.clicked);
    }

    // ...scroll down after filtering.
    if (scrolled) {
      scrollToBottom(this.contents);
    }
  }
}

class LoggerMessage extends Component {
  constructor(type, message) {
    super({ className: type, textContent: message });

    this.type = type;
  }

  matchFilters(logs, info, errors) {
    let type = this.type;

    return (type === 'log' && !logs) || (type === 'info' && !info) || (type === 'error' && !errors);
  }

  filter(logs, info, errors) {
    if (this.matchFilters(logs, info, errors)) {
      this.show();
    } else {
      this.hide();
    }
  }
}
