class LogStream {
    constructor(container) {
        this.padding = 0;
        this.container = container;
        this.current = null;
    }

    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight;
    }

    indent() {
        this.padding++;
    }

    unindent() {
        this.padding--;
    }

    /**
     * Adding messages one by one to the page is extremly slow, since the browser needs to render everything again and again.
     * For a small amount of messages, this doesn't practically matter.
     * When many messages are added, prefer to use start().
     * This will use an internal container and not change the page until commit() is called.
     */
    start() {
        let container = document.createElement('div');
        
        this.current = container

        return container;
    }

    commit() {
        this.container.appendChild(this.current);
        this.current = null;
    }

    add(className, message) {
        let container = this.current || this.container,
            element = document.createElement('span');

        element.textContent = message;
        element.className = className;
        element.style.marginLeft = `${3 * this.padding}ch`;

        container.appendChild(element);

        return element;
    }

    log(message) {
        return this.add('log', message);
    }

    info(message) {
        return this.add('info', message);
    }

    error(message) {
        return this.add('error', message);
    }

    warn(message) {
        return this.add('warn', message);
    }

    unused(message) {
        return this.add('unused', message);
    }

    hr() {
        let container = this.current || this.container,
            element = document.createElement('hr');

        container.appendChild(element);

        return element;
    }

    br() {
        let container = this.current || this.container,
            element = document.createElement('br');

        container.appendChild(element);

        return element;
    }

    clear() {
        let container = this.container

        while (container.lastChild) {
            container.removeChild(container.lastChild);
        }
    }
}
