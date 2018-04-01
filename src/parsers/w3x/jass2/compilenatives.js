import { parse } from './jass';
import ast from './ast';

function compileJassArgs(args) {
    if (args.length) {
        return args.map((value) => `${value.type} ${value.name}`).join(', ');
    } else {
        return 'nothing';
    }
}

function compileJsArgs(args) {
    if (args.length) {
        return ['jassContext'].concat(args.map((value) => `${value.name}`)).join(', ');
    } else {
        return 'jassContext';
    }
}

function compileNode(node) {
    let result = '';

    if (node instanceof ast.Program) {
        result += node.blocks.map((block) => compileNode(block)).join('\n');
    } else if (node instanceof ast.Native) {
        let jassComment = '// ';

        if (node.isConstant) {
            jassComment += 'constant ';
        }

        jassComment += `native ${node.name} takes ${compileJassArgs(node.args)} returns ${node.returnType}`;

        let js = `export function ${node.name}(${compileJsArgs(node.args)}) {\n\n}\n`;

        result += `${jassComment}\n${js}`;
    }

    return result;
}

export default function compileNatives(jassCode) {
    return compileNode(parse(jassCode));
}
