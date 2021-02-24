export function basename(path: string) {
  if (path && path.length) {
    let index = path.lastIndexOf('/');

    if (index === -1) {
      return path;
    }

    return path.slice(index + 1);
  }

  return '';
}

export function extname(path: string) {
  if (path && path.length) {
    let index = path.lastIndexOf('.');

    if (index === -1) {
      return path;
    }

    return path.slice(index).toLowerCase();
  }

  return '';
}

export function name(path: string) {
  if (path && path.length) {
    let index = path.lastIndexOf('/');

    if (index === -1) {
      path = path.slice(index + 1);
    }

    index = path.lastIndexOf('.');

    if (index === -1) {
      return path;
    }

    return path.slice(0, index);
  }

  return '';
}
