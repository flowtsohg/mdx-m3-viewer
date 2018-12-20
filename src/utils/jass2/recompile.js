import {parse} from './jass';
import ast from './ast';

/**
 * @param {string} name
 * @param {Object|null} functionDef
 * @return {boolean}
 */
function isNameGlobal(name, functionDef) {
  return (!functionDef || (!functionDef.arguments.includes(name) && !functionDef.locals.includes(name)));
}

/**
 * In Jass, "this" and "new" mean nothing, in JS they clearly do.
 *
 * @param {string} name
 * @return {string}
 */
function unJassify(name) {
  if (name === 'this' || name === 'new') {
    return `_${name}`;
  }

  return name;
}
/**
 * @param {string} name
 * @param {Object|null} functionDef
 * @return {string}
 */
function globalOrLocal(name, functionDef) {
  return `${isNameGlobal(name, functionDef) ? 'globals.' : ''}${name}`;
}

/**
 * @param {string} operator
 * @return {string}
 */
function recompileOperator(operator) {
  if (operator === 'and') {
    return '&&';
  } else if (operator === 'or') {
    return '||';
  } else if (operator === 'not') {
    return '!';
  } else {
    // The other operators work the same in Jass and JS.
    return operator;
  }
}

/**
 * @param {ast.Node} node
 * @param {Object} data
 * @param {Object|null} functionDef
 * @return {string}
 */
function recompileNode(node, data, functionDef) {
  let result = '';

  if (node) {
    let name = unJassify(node.name);

    if (node instanceof ast.Program) {
      result += `${node.blocks.map((block) => recompileNode(block, data, functionDef)).join('\n')}\n`;
    } else if (node instanceof ast.Globals) {
      functionDef = null;

      result += `${node.variables.map((variable) => recompileNode(variable, data, functionDef)).join('\n')}\n`;
    } else if (node instanceof ast.FunctionDefinition) {
      functionDef = {type: 'function', arguments: [], locals: []};

      data[name] = functionDef;

      result += `globals.${name} = jass.onFunctionDef("${name}", function ${name} (${['jass'].concat(node.args.map((arg) => recompileNode(arg, data, functionDef))).join(', ')}) {\n${node.body.map((statement) => recompileNode(statement, data, functionDef)).join('\n')}\n})\n`;
    } else if (node instanceof ast.FunctionArgument) {
      // Can only happen in a function definition.
      functionDef.arguments.push(name);

      result += name;
    } else if (node instanceof ast.IfThenElse) {
      result += `if (${recompileNode(node.condition, data, functionDef)}) {\n${node.thenActions.map((action) => recompileNode(action, data, functionDef)).join('\n')}\n}`;

      if (node.elseActions.length) {
        result += ` else {\n${node.elseActions.map((action) => recompileNode(action, data, functionDef)).join('\n')}\n}`;
      }
    } else if (node instanceof ast.SetVariable) {
      // Can only happen in functions.
      // If this name is not an argument or a local, use the global scope.
      let scopedName = globalOrLocal(name, functionDef);

      result += `${scopedName} = jass.onVarSet("${name}", ${scopedName}, ${recompileNode(node.value, data, functionDef)})`;
    } else if (node instanceof ast.SetVariableArray) {
      // Can only happen in functions.
      // If this name is not an argument or a local, use the global scope.
      let scopedName = globalOrLocal(name, functionDef);

      result += `jass.onArrayVarSet("${name}", ${scopedName}, ${recompileNode(node.index, data, functionDef)}, ${recompileNode(node.value, data, functionDef)})`;
    } else if (node instanceof ast.Literal) {
      if (node.type === 'string') {
        // Inline newlines.
        result += `"${node.value.replace(/(\r|\n)/g, '\%1')}"`;
      } else {
        result += node.value;
      }
    } else if (node instanceof ast.GetVariable) {
      // Can be both in global scope and in functions.
      // If this name is not an argument or a local, use the global scope.
      let scopedName = globalOrLocal(name, functionDef);

      result += `jass.onVarGet("${name}", ${scopedName})`;
    } else if (node instanceof ast.GetVariableArray) {
      // Can be both in global scope and in functions.
      // If this name is not an argument or a local, use the global scope.
      let scopedName = globalOrLocal(name, functionDef);

      result += `jass.onArrayVarGet("${name}", ${scopedName}, ${recompileNode(node.index, data, functionDef)})`;
    } else if (node instanceof ast.Return) {
      result += `return ${recompileNode(node.value, data, functionDef)}`;
    } else if (node instanceof ast.Infix) {
      result += `${recompileNode(node.lhs, data, functionDef)} ${recompileOperator(node.operator)} ${recompileNode(node.rhs, data, functionDef)}`;
    } else if (node instanceof ast.VariableDefinition) {
      let value;

      if (node.isArray) {
        value = '[]';
      } else if (node.value !== null) {
        value = recompileNode(node.value, data, functionDef);
      }

      // Is this a local variable?
      if (node.isLocal) {
        result += `let ${name} = jass.onLocalVarDef("${name}", ${value})`;

        // If so, also add it to the function data.
        functionDef.locals.push(name);
      } else {
        result += `globals.${name} = jass.onGlobalVarDef("${name}", ${value})`;
      }
    } else if (node instanceof ast.Loop) {
      result += `while (true) {\n${node.actions.map((action) => recompileNode(action, data, functionDef)).join('\n')}\n}`;
    } else if (node instanceof ast.ExitWhen) {
      result += `if (${recompileNode(node.condition, data, functionDef)}) { break }`;
    } else if (node instanceof ast.FunctionCall) {
      result += `jass.call(${[`"${name}"`].concat(node.args.map((arg) => recompileNode(arg, data, functionDef))).join(', ')})`;
    } else if (node instanceof ast.FunctionReference) {
      result += `globals.${name}`;
    } else if (node instanceof ast.Unary) {
      result += `${recompileOperator(node.operator)}${recompileNode(node.value, data, functionDef)}`;
    } else if (node instanceof ast.Type) {
      // ?
    } else if (node instanceof ast.Native) {
      data[name] = {type: 'native'};

      result += `jass.onNativeDef("${name}")`;
    } else if (node instanceof ast.FunctionCallStatement) {
      result += recompileNode(node.functionCall, data, functionDef);
    }
  }

  return result;
}

/**
 * @param {string} jassCode
 * @param {Object} data
 * @return {string}
 */
export default function recompile(jassCode, data) {
  return recompileNode(parse(jassCode), data);
}
