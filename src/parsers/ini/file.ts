/**
 * An INI section.
 */
export type IniSection = Map<string, string>;

/**
 * An INI file.
 */
export class IniFile {
  properties: Map<string, string> = new Map();
  sections: Map<string, IniSection> = new Map();

  load(buffer: string) {
    // All properties added until a section is reached are added to the properties map.
    // Once a section is reached, any further properties will be added to it until matching another section, etc.
    let section: IniSection | null = this.properties;
    const sections = this.sections;

    for (const line of buffer.split('\r\n')) {
      // INI defines comments as starting with a semicolon ';'.
      // However, Warcraft 3 INI files use normal C comments '//'.
      // In addition, Warcraft 3 files have empty lines.
      // Therefore, ignore any line matching any of these conditions.
      if (line.length && !line.startsWith('//') && !line.startsWith(';')) {
        let match = line.match(/^\[(.+?)\]/);

        if (match) {
          const name = match[1].trim().toLowerCase();

          section = <IniSection | null>sections.get(name);

          if (!section) {
            section = new Map();

            sections.set(name, section);
          }
        } else {
          match = line.match(/^(.+?)=(.*?)$/);

          if (match) {
            section.set(match[1], match[2]);
          }
        }
      }
    }
  }

  save() {
    const lines = [];

    for (const [key, value] of this.properties) {
      lines.push(`${key}=${value}`);
    }

    for (const [name, section] of this.sections) {
      lines.push(`[${name}]`);

      for (const [key, value] of section) {
        lines.push(`${key}=${value}`);
      }
    }

    return lines.join('\r\n');
  }

  getSection(name: string) {
    return this.sections.get(name.toLowerCase());
  }
}
