import ECA from '../parsers/w3x/war3map.wtg/eca';
import Parameter from '../parsers/w3x/war3map.wtg/parameter';

let GENERATED_FUNCTIONS_BASE_NAME = 'generated_function_';

// Once upon a time there was World Editor Unlimited.
// A modified Warcraft 3 World Editor that removed many limitations of the normal editor, and exposed new functionality.
// Among other things, it exposed many Jass natives to GUI users.
// This is done by modifying a file used by the editor, which gives it the names and signatures of functions available in GUI.
// WEU died a long time ago, and any map that uses these exposed GUI functions cannot be loaded in any other editor.
// This fix allows to read these functions properly.
// Note that it does not change the read/saved data making it openable in WE - rather it just makes it readable for the WTG implementation.
export function weuParamCount(name) {
    //console.log('weuParamCount', name)
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

function toCustomScript(state, object, isSubParameters) {
    switch (object.name) {
        case 'RemoveLocation':
        case 'DestroyGroup':
        case 'SetHeroStr':
        case 'SetHeroAgi':
        case 'SetHeroInt':
        case 'DisplayTextToPlayer':
        case 'DisplayTimedTextToPlayer':
        case 'GroupEnumUnitsSelected':
            if (isSubParameters) {
                return subParametersToCustomScript(state, object);
            } else {
                return ecaToCustomScript(state, object);
            }

            //console.log('REPLACING', object.name, customScript)
            //console.log('replacing', object.name);
            //object.fromCustomScriptCode(object.toCustomScriptCode());
            //object.fromComment(object.toCustomScriptCode())
    }
}

function ecaToCustomScript(state, eca) {
    return `call ${eca.name}(${eca.parameters.map((value) => parameterToCustomScript(state, value)).join(', ')})`;
}

function subParametersToCustomScript(state, subParameters) {
    let parameters = subParameters.parameters;
    
    // Math ops, then string concatanation, and then boolexpr which is not supported.
    if (subParameters.name === 'OperatorInt') {
        let operator = parameters[1].value,
            op;

        if (operator === 'OperatorAdd') {
            op = '+';
        } else if (operator === 'OperatorMultiply') {
            op = '*';
        } else {
            throw new Error(`Unknown OperatorInt: ${operator}`);
        }

        return `${parameterToCustomScript(state, parameters[0])} ${op} ${parameterToCustomScript(state, parameters[2])}`;
    } else if (subParameters.name === 'OperatorString') {
        return `${parameterToCustomScript(state, parameters[0], true)} + ${parameterToCustomScript(state, parameters[1], true)}`;
    } else if (subParameters.name === 'OperatorCompareBoolean') {
        let operator = parameters[1].value,
            op;

        if (operator === 'OperatorEqualENE') {
            op = '==';
        } else {
            throw new Error(`Unknown OperatorCompareBoolean: ${operator}`);
        }

        return `NOINLINESTART${parameterToCustomScript(state, parameters[0])} ${op} ${parameterToCustomScript(state, parameters[2])}NOINLINEEND`;
    }

    return `${subParameters.name}(${parameters.map((value) => parameterToCustomScript(state, value)).join(', ')})`;
}

function parameterToCustomScript(state, parameter, isOperatorString) {
    // (0 = PRESET, 1 = VARIABLE, 2 = FUNCTION, 3 = STRING, -1 = INVALID)
    if (parameter.type === 0) {
        if (parameter.value === 'PermanentPerm') {
            return 'TRUE';
        } else if (parameter.value === 'UnitTypedead') {
            return 'UNIT_TYPE_DEAD';
        } else if (parameter.value === 'PlayerNA') {
            return 'Player(PLAYER_NEUTRAL_AGGRESSIVE)';
        }

        console.log(parameter);
        throw new Error(`Unknown preset parameter: ${parameter.value}`);
    } else if (parameter.type === 1) {
        return `udg_${parameter.value}`;
    } else if (parameter.type === 2) {
        return subParametersToCustomScript(state, parameter.subParameters);
    } else if (parameter.type === 3) {
        //return parameter.value;

        if (isOperatorString) {
            return `"${parameter.value}"`;
        //} else if (/^TRIGSTR_\d+$/.test(parameter.value)) {
        //    return `"${state.stringTable.stringMap.get(parseInt(parameter.value.slice(8))) || parameter.value}"`;
        } else {
            return parameter.value
        }
    } else {
        throw new Error(`Unknown parameter type: ${parameter.type}`);
    }
}

export function ecaComment(comment) {
    let eca = new ECA();

    eca.name = 'CommentString';
    eca.type = 2; // Function

    let parameter = new Parameter();

    parameter.type = 3; // String
    parameter.value = comment; // Comment

    eca.parameters[0] = parameter;

    return eca;
}

function convertEcaToCustomScript(eca, customScript) {
    eca.name = 'CustomScriptCode';

    // Remove any existing parameters and ECAs.
    eca.parameters.length = 0;
    eca.ecas.length = 0;

    let parameter = new Parameter();

    parameter.type = 3; // String
    parameter.value = customScript;

    eca.parameters[0] = parameter;
}

function addComments(ecas, i, group, ...comments) {
    let newEcas = [];

    for (let comment of comments) {
        let eca = ecaComment(comment);

        eca.group = group;

        newEcas.push(eca);
    }

    ecas.splice(i, 0, ...newEcas);

    console.log(comments)

    return i + newEcas.length;
}

function handleCustomScript(state, ecas, i, eca, customScript) {
    let inlineStart = customScript.indexOf('NOINLINESTART');

    //console.log(eca.name);
    if (inlineStart === -1) {
        i = addComments(ecas, i, eca.group, 'AUTOMATICALLY CONVERTED');
    } else {
        let inlineEnd = customScript.indexOf('NOINLINEEND', inlineStart + 13);

        let callbackName = `${GENERATED_FUNCTIONS_BASE_NAME}${state.generatedCounter++}`;

        let callback = customScript.slice(inlineStart, inlineEnd + 11);

        customScript = customScript.replace(callback, `Filter(function ${callbackName})`);

        callback = callback.slice(13, -11);
        
        console.log(callback)

        if (state.customTextTriggerFile) {
            state.customTextTriggerFile.trigger.text += `\r\nfunction ${callbackName} takes nothing returns boolean\r\n    return ${callback}\r\nendfunction`;

            i = addComments(ecas, i, eca.group,
                'AUTOMATICALLY CONVERTED BUT CANNOT BE INLINED',
                `ADDED ${callbackName} TO THE MAP HEADER`
                );
        } else {
            i = addComments(ecas, i, eca.group,
                'AUTOMATICALLY CONVERTED BUT CANNOT BE INLINED',
                'ADD THE FOLLOWING TO THE MAP HEADER TO FIX THIS AND CHANGE FUNCTION_NAME TO SOMETHING UNIQUE',
                `    function ${callbackName} takes nothing returns boolean`,
                `        return ${callback}`,
                '    endfunction'
                );

            eca.isEnabled = false;
        }
    }

    console.log(customScript);
    convertEcaToCustomScript(eca, customScript);

    return i;
}

// Note: the number returned here indicates how many actions were added, e.g. comments.
function handleECA(state, ecas, i, isChildECA) {
    let eca = ecas[i];

    // Actions
    if (eca.type === 2) {
        let customScript = toCustomScript(state, eca);

        if (customScript) {
            return handleCustomScript(state, ecas, i, eca, customScript);
        }

        let parameters = eca.parameters;

        for (let i2 = 0, l = parameters.length; i2 < l; i2++) {
            let param = parameters[i2];

            if (param.type === 2) {
                if (toCustomScript(state, param.subParameters, true)) {
                    let customScript = ecaToCustomScript(state, eca);

                    return handleCustomScript(state, ecas, i, eca, customScript);
                }
            }
        }

        let childEcas = eca.ecas;

        for (let i2 = 0, l = childEcas.length; i2 < l; i2++) {
            handleECA(state, childEcas, i2, true);
        }
    }

    return i;
}

/**
 * Converts extended GUI actions to Custom Script actions.
 * This allows maps saved with old tools like WEU to be opened by other world editors.
 * 
 * @param {War3MapWtg} triggerFile 
 * @param {War3MapWts} stringTable 
 */
export function weuToCustomScripts(triggerFile, stringTable, customTextTriggerFile) {
    let state = {
        stringTable,
        customTextTriggerFile,
        generatedCounter: 0
    };

    if (customTextTriggerFile && triggerFile.version === 4) {
        console.log('WARNING: changing the trigger file to TFT to support the map header');
    }

    console.log(stringTable)

    for (let trigger of triggerFile.triggers) {
        let ecas = trigger.ecas;

        for (let i = 0, l = ecas.length; i < l; i++) {
            i = handleECA(state, ecas, i, false);
        }
    }
}
