/**
 * Returns the base name of a file path.
 * 
 * Path/To/My/File.ext => File.ext
 */
export function basename(path: string): string {
  if (path && path.length) {
    let index = path.lastIndexOf('/');

    if (index !== -1) {
      path = path.slice(index + 1);
    }

    index = path.lastIndexOf('\\');

    if (index !== -1) {
      path = path.slice(index + 1);
    }

    return path;
  }

  return '';
}

/**
 * Returns the extension name of a file path.
 * 
 * Path/To/My/File.ext => .ext
 */
export function extname(path: string): string {
  if (path && path.length) {
    const index = path.lastIndexOf('.');

    if (index !== -1) {
      path = path.slice(index).toLowerCase();
    }

    return path;
  }

  return '';
}

/**
 * Returns the base name of a file path without the extension.
 * 
 * Path/To/My/File.ext => File
 */
export function filename(path: string): string {
  path = basename(path);

  const index = path.lastIndexOf('.');

  if (index !== -1) {
    path = path.slice(0, index);
  }

  return path;
}
