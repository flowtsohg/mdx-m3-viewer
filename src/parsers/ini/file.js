export default class IniFile {
    constructor(src) {
        /** @member {Map<string, string>} */
        this.properties = new Map();
        /** @member {Map<string, Map<string, string>>} */
        this.sections = new Map();

        if (typeof src === 'string') {
            this.load(src);
        }
    }

    load(src) {
        // All properties added until a section is reached are added to the properties map.
        // Once a section is reached, any further properties will be added to it until matching another section, etc.
        let section = this.properties;

        for (let line of src.split('\r\n')) {
            line = line.trim();

            // INI defines comments as starting with a semicolon ';'.
            // However, Warcraft 3 INI files use normal C comments '//'.
            // In addition, Warcraft 3 files have empty lines.
            // Therefore, ignore any line matching any of these conditions.
            if (line.length && !line.startsWith('//') && !line.startsWith(';')) {
                let match = line.match(/^\[(.+?)\]/);
                
                if (match) {
                    let name = match[1].trim().toLowerCase();

                    // For now, ignore sections with names that already exist.
                    if (this.sections.has(name)) {
                        section = null;
                    } else {
                        // If this line starts a new section, use it.
                        section = new Map();

                        this.sections.set(name, section);
                    }
                } else {
                    match = line.match(/^(.+?)=(.*?)$/);

                    if (match && section) {
                        section.set(match[1].trim().toLowerCase(), match[2].trim());
                    }
                }
            }
        }
    }

    getSection(name) {
        return this.sections.get(name.toLowerCase());
    }

    saveProperties(lines, section) {
        for (let [key, value] of section) {
            lines.push(`${key}=${value}`);
        }
    }

    save() {
        let lines = [];
        
        this.saveProperties(lines, this.properties);

        for (let [name, section] of this.sections) {
            lines.push(`[${name}]`);
            
            this.saveProperties(lines, section);
            
        }

        return lines.join('\r\n');
    }
};
