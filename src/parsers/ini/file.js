/**
 * An INI file.
 */
export default class IniFile {
  /**
   * @param {?string} buffer
   */
  constructor(buffer) {
    /** @member {Map<string, string>} */
    this.properties = new Map();
    /** @member {Map<string, Map<string, string>>} */
    this.sections = new Map();

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * @param {string} buffer
   */
  load(buffer) {
    // All properties added until a section is reached are added to the properties map.
    // Once a section is reached, any further properties will be added to it until matching another section, etc.
    let section = this.properties;
    let sections = this.sections;

    for (let line of buffer.split('\r\n')) {
      // INI defines comments as starting with a semicolon ';'.
      // However, Warcraft 3 INI files use normal C comments '//'.
      // In addition, Warcraft 3 files have empty lines.
      // Therefore, ignore any line matching any of these conditions.
      if (line.length && !line.startsWith('//') && !line.startsWith(';')) {
        let match = line.match(/^\[(.+?)\]/);

        if (match) {
          let name = match[1].trim().toLowerCase();

          section = sections.get(name);

          if (!section) {
            section = new Map();

            sections.set(name, section);
          }
        } else {
          match = line.match(/^(.+?)=(.*?)$/);

          if (match) {
            section.set(match[1].toLowerCase(), match[2]);
          }
        }
      }
    }
  }

  /**
   * @return {string}
   */
  save() {
    let lines = [];

    for (let [key, value] of this.properties) {
      lines.push(`${key}=${value}`);
    }

    for (let [name, section] of this.sections) {
      lines.push(`[${name}]`);

      for (let [key, value] of section) {
        lines.push(`${key}=${value}`);
      }
    }

    return lines.join('\r\n');
  }

  /**
   * @param {string} name
   * @return {Map<string, string>}
   */
  getSection(name) {
    return this.sections.get(name.toLowerCase());
  }
}
