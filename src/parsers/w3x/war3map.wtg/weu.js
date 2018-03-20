// Once upon a time there was World Editor Unlimited.
// A modified Warcraft 3 World Editor that removed many limitations of the normal editor, and exposed new functionality.
// Among other things, it exposed many Jass natives to GUI users.
// This is done by modifying a file used by the editor, which gives it the names and signatures of functions available in GUI.
// WEU died a long time ago, and any map that uses these exposed GUI functions cannot be loaded in any other editor.
// This fix allows to read these functions properly.
// Note that it does not change the read/saved data making it openable in WE - rather it just makes it readable for the WTG implementation.
export function weuParamCount(name) {
    console.log('weuParamCount', name)
    if (name === 'SetHeroStr' || name === 'SetHeroAgi' || name === 'SetHeroInt' || name === 'GroupEnumUnitsSelected') {
        return 3;
    }

    if (name === 'DisplayTextToPlayer') {
        return 4;
    }

    if (name === 'DisplayTimedTextToPlayer') {
        return 5;
    }

    if (name === 'RemoveLocation' || name === 'DestroyGroup') {
        return 1;
    }

    throw new Error(`weuParamCount: unknown function, needs to be added? name is "${name}"`);
}

// This happens when having a function pointer, such as picking units in rect.
function handleParam(param) {
    if (param.type === 2) {
        let subParameters = param.subParameters;

        switch (subParameters.value) {
            case 'RemoveLocation':
            case 'DestroyGroup':
            case 'SetHeroStr':
            case 'SetHeroAgi':
            case 'SetHeroInt':
                console.log('replacing subParameters', subParameters.value);
                eca.fromCustomScriptCode(eca.toCustomScriptCode());
        }
    }
}

function handleECA(eca, isChildECA) {
    // Actions
    if (eca.type === 2) {
        switch (eca.name) {
            case 'RemoveLocation':
            case 'DestroyGroup':
            case 'SetHeroStr':
            case 'SetHeroAgi':
            case 'SetHeroInt':
                console.log('replacing ECA', eca.name);
                eca.fromCustomScriptCode(eca.toCustomScriptCode());
        }
    }

    for (let param of eca.parameters) {
        handleParam(param);
    }

    for (let child of eca.ecas) {
        handleECA(child, true);
    }
}

/**
 * Converts extended GUI actions to Custom Script actions.
 * This allows maps saved with old tools like WEU to be opened by other world editors.
 * 
 * @param {War3MapWtg} wtg 
 */
export function weuToCustomScripts(wtg) {
    console.log(wtg);
    for (let trigger of wtg.triggers) {
        for (let eca of trigger.ecas) {
            handleECA(eca, false);
        }
    }
}
