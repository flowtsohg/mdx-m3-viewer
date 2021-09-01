export function createElement(options) {
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

    if (options.title) {
      element.title = options.title;
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

export function hideElement(element) {
  element.classList.add('hidden');
}

export function showElement(element) {
  element.classList.remove('hidden');
}

export function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

export function scrolledToBottom(element) {
  return element.scrollHeight - element.clientHeight === element.scrollTop;
}

export function addTextToRow(row, text) {
  let cell = row.insertCell();

  cell.appendChild(document.createTextNode(text));

  return cell;
}

export function addElementToRow(row, element) {
  let cell = row.insertCell();

  cell.appendChild(element);

  return cell;
}

export function clearSelect(element) {
  for (let l = element.options.length - 1, i = l; i >= 0; i--) {
    element.remove(i);
  }
}
