function createElement(options) {
  let tagName = 'div';

  if (options && options.tagName) {
    tagName = options.tagName;
  }

  let element = document.createElement(tagName);

  if (options) {
    if (options.style) {
      element.style = options.style;
    }

    if (options.className) {
      element.className = options.className;
    }

    if (options.textContent) {
      element.textContent = options.textContent;
    }

    if (options.placeholder) {
      element.placeholder = options.placeholder;
    }

    if (options.readonly) {
      element.readonly = true;
    }

    if (options.href) {
      element.href = options.href;
    }

    if (options.target) {
      element.target = options.target;
    }

    if (options.onclick) {
      element.addEventListener('click', (e) => options.onclick(e, options.component));
    }

    if (options.onchange) {
      element.addEventListener('change', (e) => options.onchange(e, options.component));
    }

    if (options.oninput) {
      element.addEventListener('input', (e) => options.oninput(e, options.component));
    }

    if (options.container) {
      options.container.appendChild(element);
    }
  }

  return element;
}

function hideElement(element) {
  element.classList.add('hidden');
}

function showElement(element) {
  element.classList.remove('hidden');
}

function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

function scrolledToBottom(element) {
  return element.scrollHeight - element.clientHeight === element.scrollTop;
}

function addTextToRow(row, text) {
  let cell = row.insertCell();

  cell.appendChild(document.createTextNode(text));

  return cell;
}

function addElementToRow(row, element) {
  let cell = row.insertCell();

  cell.appendChild(element);

  return cell;
}
