// Once upon a time there was World Editor Unlimited.
// A modified Warcraft 3 World Editor that removed many limitations of the normal editor, and exposed new functionality.
// Among other things, it exposed many Jass natives to GUI users.
// This is done by modifying a file used by the editor, which gives it the names and signatures of functions available in GUI.
// WEU died a long time ago, and any map that uses these exposed GUI functions cannot be loaded in any other editor.
// This fix allows to read these functions properly.
// Note that it does not change the read/saved data making it openable in WE - rather it just makes it readable for the WTG implementation.
export default function fixWeu(name) {
    if (name === 'SetHeroStr' || name === 'SetHeroAgi' || name === 'SetHeroInt' || name === 'GroupEnumUnitsSelected') {
        return 3;
    }

    if (name === 'DisplayTextToPlayer') {
        return 4;
    }

    if (name === 'DisplayTimedTextToPlayer') {
        return 5;
    }

    throw new Error(`fixWeu: unknown function, needs to be added? name is "${name}"`);
}
