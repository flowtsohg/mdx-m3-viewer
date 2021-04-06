import { byteLengthUtf8 } from '../../../common/utf8';
import War3Map from '../../../parsers/w3x/map';
import War3MapWtg from '../../../parsers/w3x/wtg/file';
import ECA from '../../../parsers/w3x/wtg/eca';
import SubParameters from '../../../parsers/w3x/wtg/subparameters';
import { FunctionSignature, TriggerData } from '../../../parsers/w3x/wtg/triggerdata';
import WeuData from './data';

function typeFunctionCall(wtg: War3MapWtg, object: ECA | SubParameters, parentObject: ECA | SubParameters | null, signatures: Map<string, FunctionSignature>, customTriggerData: TriggerData) {
  // If this object's signature was unknown, attempt to fill in the argument types.
  // Note that this is done every time the signature is encountered.
  // If a parameter's type isn't known in one call, maybe it will be known in another call.
  if (signatures.has(object.name)) {
    let signature = <FunctionSignature>signatures.get(object.name);
    let args = signature.args;

    for (let [index, parameter] of object.parameters.entries()) {
      let { type, value } = parameter;

      if (type === 1) {
        for (let variable of wtg.variables) {
          if (variable.name === value) {
            args[index] = variable.type;
            break;
          }
        }
      } else if (type === 2) {
        if (parameter.subParameters) {
          let subParameters = parameter.subParameters;
          let childSignature = customTriggerData.getFunction(subParameters.type, subParameters.name);

          if (childSignature) {
            let returnType = childSignature.returnType;

            if (returnType && returnType !== 'AnyType') {
              args[index] = returnType;
            }
          }
        }
      } else if (type === 3) {
        if (value.startsWith('TRIGSTER_') || value.includes('\\')) {
          args[index] = 'string';
        } else if (!isNaN(parseFloat(value))) {
          args[index] = 'real';
        } else if (value === 'true' || value === 'false') {
          args[index] = 'boolean';
        }
      }
    }
  }

  // Continue the hierarchy down any function call parameter.
  for (let parameter of object.parameters) {
    if (parameter.type === 2 && parameter.subParameters) {
      typeFunctionCall(wtg, parameter.subParameters, object, signatures, customTriggerData);
    }
  }

  // Continue the hierarchy down any ECA.
  if (object instanceof ECA) {
    for (let child of object.ecas) {
      typeFunctionCall(wtg, child, object, signatures, customTriggerData);
    }
  }
}

const BIGGEST_SIGNATURE = 20;

/**
 * Parses a WTG file, but with a twist - it also tries to fill in unknown function signatures.
 * 
 * This lets the WEU converter to handle maps with small TriggerData modifications that are unknown.
 * 
 * Unfortunately it only handles simple cases - if there is an unknown signature in an unknown signature, there is no way to parse it as far as I can tell.
 * 
 * With that being said, it already managed to parse and mostly fill the signatures of relevant test maps.
 */
export default function parseWtg(map: War3Map, customTriggerData: TriggerData, data: WeuData) {
  let wtg;
  let signatures: Map<string, FunctionSignature> = new Map();
  let currentName: string | undefined;
  let currentSignature: FunctionSignature | undefined;
  let searching = true;

  // If there's an unknown signature exception while parsing the triggers, a new signature will be injected.
  // Initially the signature starts with 0 arguments.
  // The triggers are then read again.
  // If there's an exception, another argument is added to the signature, and this goes on up to BIGGEST_SIGNATURE arguments. 
  // If there's another unknown signature exception, the current signature is considered complete.
  // If the triggers are fully parsed, the current signature is considered complete.
  // Note that this will not work if there is an unknown signature with a child unknown signature.
  // For example, a function call given as an argument to a function call.
  // This is also the case if it's not a direct child, but anywhere down the hierarchy.
  // If both have unknown signatures, there is no deterministic way (that I can tell) to parse the data.
  while (searching) {
    try {
      wtg = map.readTriggers(customTriggerData);

      searching = false;
    } catch (e) {
      let message = <string>e.message;

      if (message.endsWith('Unknown signature')) {
        let end = message.lastIndexOf('"');
        let start = message.lastIndexOf('"', end - 1) + 1;
        let nameAndType = message.slice(start, end);
        let [name, type] = nameAndType.split(':');
        let typeAsNumber = parseInt(type);
        let signature: FunctionSignature = { args: [], scriptName: null, returnType: typeAsNumber === 3 ? 'AnyType' : null };

        currentName = name.toLowerCase();
        currentSignature = signature;

        signatures.set(name, signature);

        customTriggerData.externalFunctions[typeAsNumber][currentName] = currentSignature;
      } else if (currentName && currentSignature) {
        currentSignature.args.push('AnyType');

        if (currentSignature.args.length > BIGGEST_SIGNATURE) {
          searching = false;
        }
      }
    }
  }

  if (signatures.size) {
    if (wtg) {
      for (let trigger of wtg.triggers) {
        for (let eca of trigger.ecas) {
          typeFunctionCall(wtg, eca, null, signatures, customTriggerData);
        }
      }
    }

    for (let [name, signature] of signatures) {
      data.change('unknownsignature', `Unknown signature`, `${name}(${signature.args.join(', ')}) => ${signature.returnType ? signature.returnType : 'void'}`);
    }
  }

  return wtg;
}
