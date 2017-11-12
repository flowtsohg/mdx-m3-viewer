/**
 * @constructor
 * @param {?string} src
 */
function IniFile(src) {
    /** @member {Map<string, string>} */
    this.properties = new Map();
    /** @member {Map<string, Map<string, string>>} */
    this.sections = new Map();

    if (typeof src === 'string') {
        this.load(src);
    }
}

IniFile.prototype = {
    load(src) {
        let section;

        for (let line of src.split('\r\n')) {
            line = line.trim();

            // INI defines comments as starting with a semicolon ';'.
            // However, Warcraft 3 INI files use normal C comments '//'.
            // In addition, Warcraft 3 files have empty lines.
            // Therefore, ignore any line matching any of these conditions.
            if (line.length && !line.startsWith('//') && !line.startsWith(';')) {
                let match = line.match(/^\[(.+?)\]/);

                // If this line starts a new section, add it.
                if (match) {
                    section = new Map();

                    this.sections.set(match[1].trim(), section);
                } else {
                    match = line.match(/^(.+?)=(.*?)$/);

                    if (match) {
                        let key = match[1].trim(),
                            value = match[2].trim();

                        // Properties can be defined also without a section.
                        // Therefore, handle both cases.
                        // Note that sections don't have any explicit ending other than another section starting, or the end of the data is reached.
                        if (section) {
                            section.set(key, value);
                        } else {
                            this.properties.set(key, value)
                        }
                    }
                }
            }
        }
    },

    getSection(name) {
        return this.sections.get(name);
    },

    saveProperties(lines, section) {
        for (let [key, value] of section) {
            lines.push(`${key}=${value}`);
        }
    },

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

export default IniFile;
