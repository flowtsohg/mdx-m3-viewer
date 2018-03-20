import { parse } from './jass';
import ast from './ast';

function isNameGlobal(name, functionDef) {
    return (!functionDef || (!functionDef.arguments.includes(name) && !functionDef.locals.includes(name)));
}

function scopedName(name, functionDef) {
    return `${isNameGlobal(name, functionDef) ? 'globals.' : ''}${name}`;
}

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

function recompileNode(node, data, functionDef) {
    let result = '';

    if (node instanceof ast.Program) {
        result += `${node.blocks.map((block) => recompileNode(block, data, functionDef)).join('\n')}\n`;
    } else if (node instanceof ast.Globals) {
        functionDef = null;

        result += `${node.variables.map((variable) => recompileNode(variable, data, functionDef)).join('\n')}\n`;
    } else if (node instanceof ast.FunctionDefinition) {
        functionDef = { type: 'function', arguments: [], locals: [] };

        data[node.name] = functionDef;

        result += `globals.${node.name} = jassContext.onFunctionDefinition("${node.name}", function ${node.name} (${['jassContext'].concat(node.args.map((arg) => recompileNode(arg, data, functionDef))).join(', ')}) {\n${node.body.map((statement) => recompileNode(statement, data, functionDef)).join('\n')}\n})\n`;
        //result += `globals.${node.name} = function(${['jassContext'].concat(node.args.map((arg) => recompileNode(arg, data, functionDef))).join(', ')}) {\n${node.body.map((statement) => recompileNode(statement, data, functionDef)).join('\n')}\n}\n`;
    } else if (node instanceof ast.FunctionArgument) {
        // Can only happen in a function definition.
        functionDef.arguments.push(node.name);
        
        result += node.name;
    } else if (node instanceof ast.IfThenElse) {
        result += `if (${recompileNode(node.condition, data, functionDef)}) {\n${node.thenActions.map((action) => recompileNode(action, data, functionDef)).join('\n')}\n}`;

        if (node.elseActions.length) {
            result += ` else {\n${node.elseActions.map((action) => recompileNode(action, data, functionDef)).join('\n')}\n}`;
        }
    } else if (node instanceof ast.SetVariable) {
        // Can only happen in functions.
        // If this name is not an argument or a local, use the global scope.
        let name = scopedName(node.name, functionDef);

        result += `${name} = jassContext.onVariableSet("${node.name}", ${name}, ${recompileNode(node.value, data, functionDef)})`;
    } else if (node instanceof ast.SetVariableArray) {
        // Can only happen in functions.
        // If this name is not an argument or a local, use the global scope.
        let name = scopedName(node.name, functionDef);

        result += `jassContext.onVariableArraySet("${node.name}", ${name}, ${recompileNode(node.index, data, functionDef)}, ${recompileNode(node.value, data, functionDef)})`;
    } else if (node instanceof ast.Literal) {
        if (node.type === 'string') {
            result += `"${node.value}"`;
        } else {
            result += node.value;
        }
    } else if (node instanceof ast.GetVariable) {
        // Can be both in global scope and in functions.
        // If this name is not an argument or a local, use the global scope.
        let name = scopedName(node.name, functionDef);

        result += `jassContext.onVariableGet("${node.name}", ${name})`;
    } else if (node instanceof ast.GetVariableArray) {
        // Can be both in global scope and in functions.
        // If this name is not an argument or a local, use the global scope.
        let name = scopedName(node.name, functionDef);

        result += `jassContext.onVariableArrayGet("${node.name}", ${name}, ${recompileNode(node.index, data, functionDef)})`;
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
            result += `let ${node.name} = jassContext.onLocalDefinition("${node.name}", ${value})`;
            
            // If so, also add it to the function data.
            functionDef.locals.push(node.name);
        } else {
            result += `globals.${node.name} = jassContext.onGlobalDefinition("${node.name}", ${value})`;
        }
    } else if (node instanceof ast.Loop) {
        result += `while (true) {\n${node.actions.map((action) => recompileNode(action, data, functionDef)).join('\n')}\n}`;
    } else if (node instanceof ast.ExitWhen) {
        result += `if (${recompileNode(node.condition, data, functionDef)}) { break }`;
    } else if (node instanceof ast.FunctionCall) {
        result += `jassContext.call(${[`"${node.name}"`].concat(node.args.map((arg) => recompileNode(arg, data, functionDef))).join(', ')})`;
    } else if (node instanceof ast.FunctionReference) {
        result += `globals.${node.name}`;
    
    } else if (node instanceof ast.Unary) {
        result += `${recompileOperator(node.operator)}${recompileNode(node.value, data, functionDef)}`;
    } else if (node instanceof ast.Type) {
        // ?
    } else if (node instanceof ast.Native) {
        data[node.name] = { type: 'native' };

        result += `jassContext.onNativeDefinition("${node.name}")`;
    } else if (node instanceof ast.FunctionCallStatement) {
        result += recompileNode(node.functionCall, data, functionDef);
    }

    return result;
}

export default function recompile(jassCode, data) {
    return recompileNode(parse(jassCode), data);
};
