import ECA from '../../parsers/w3x/wtg/eca';
import Parameter from '../../parsers/w3x/wtg/parameter';
import SubParameters from '../../parsers/w3x/wtg/subparameters';

/**
 * Creates a new Custom Script or comment ECA with the given data.
 */
export function createCustomScriptOrCommentECA(data: string, isComment: boolean) {
  let eca = new ECA();

  eca.type = 2; // Action

  if (isComment) {
    eca.name = 'CommentString';
  } else {
    eca.name = 'CustomScriptCode';
  }

  eca.isEnabled = 1;

  let parameter = new Parameter();

  parameter.type = 3; // String
  parameter.value = data;

  eca.parameters[0] = parameter;

  return eca;
}

/**
 * Creates a new Custom Script ECA with the given script.
 */
export function createCustomScriptECA(script: string) {
  return createCustomScriptOrCommentECA(script, false);
}

// /**
//  * Creates a new comment ECA with the given comment.
//  */
// function createCommentECA(comment: string) {
//   return createCustomScriptOrCommentECA(comment, true);
// }

function subParametersToEca(subParameters: SubParameters, group: number) {
  let eca = new ECA();

  eca.name = subParameters.name;
  eca.type = subParameters.type;
  eca.group = group;
  eca.isEnabled = 1;
  eca.parameters.push(...subParameters.parameters);

  return eca;
}

export function convertSingleToMultiple(eca: ECA) {
  if (eca.name === 'IfThenElse') {
    let parameters = eca.parameters;
    let ifParam = subParametersToEca(<SubParameters>parameters[0].subParameters, 0);
    let thenParam = subParametersToEca(<SubParameters>parameters[1].subParameters, 1);
    let elseParam = subParametersToEca(<SubParameters>parameters[2].subParameters, 2);

    eca.name = 'IfThenElseMultiple';
    eca.parameters.length = 0;
    eca.ecas.push(ifParam, thenParam, elseParam);

    return true;
  } else if (eca.name === 'ForGroup' || eca.name === 'ForForce') {
    let action = subParametersToEca(<SubParameters>eca.parameters[1].subParameters, 0);

    eca.name = `${eca.name}Multiple`;
    eca.parameters.length = 1;
    eca.ecas.push(action);

    return true;
  }

  return false;
}

/**
 * Given the name of the parent of some child ECA, and the child's group, determine if it's a condition.
 */
export function isConditionECA(name: string, group: number) {
  if (group !== 0) {
    return false;
  }

  return name === 'AndMultiple' || name === 'OrMultiple' || name === 'IfThenElseMultiple';
}

const SCRIPT_LINE_LENGTH = 239;

/**
 * CustomScriptCode ECAs have a maximum length for their (typically) string parameter.
 * If the script length exceeds the maximum length, WE will fail to load the map properly.
 * Either it crashes, or it loads the map and GUI up until the invalid ECA, after which everything is an error.
 * This functions is used to split such ECAs.
 * Splitting is possible, because the Jass parser seems to not consider multiline comments as token delimiters.
 * For example, the following lines:
 * 
 *   call BJDebug/*
 *   /*Msg("hi")
 * 
 * When compiled result in the correct call:
 * 
 *   call BJDebugMsg("hi")
 */
export function ensureCustomScriptCodeSafety(ecas: ECA[]) {
  let outputEcas = [];

  for (let eca of ecas) {
    if (eca.name === 'CustomScriptCode') {
      let script = eca.parameters[0].value;

      if (script.length > SCRIPT_LINE_LENGTH) {
        let lines = Math.ceil(script.length / SCRIPT_LINE_LENGTH);
        let lastLine = lines - 1;
        let firstInPair = true;

        for (let i = 0; i < lines; i++) {
          let text = script.substr(i * SCRIPT_LINE_LENGTH, SCRIPT_LINE_LENGTH);

          if (i < lastLine) {
            if (firstInPair) {
              text = `${text}/*`;
            } else {
              text = `*/${text}`;
            }

            firstInPair = !firstInPair;
          }

          let customScript = createCustomScriptECA(text);

          customScript.group = eca.group;

          outputEcas.push(customScript);
        }
      } else {
        outputEcas.push(eca);
      }
    } else {
      outputEcas.push(eca);
    }
  }

  return outputEcas;
}

/**
 * Given a name, converts all of the non-ASCII characters and space characters to underlines.
 */
export function ensureNameSafety(name: string) {
  // Convert non-ASCII characters to underlines, for locales other than en.
  return name.split('').map((c) => c.charCodeAt(0) > 127 ? '_' : c).join('').replace(/\s/g, '_');
}
