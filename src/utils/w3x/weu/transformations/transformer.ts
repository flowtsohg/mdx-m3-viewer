import ECA from '../../../../parsers/w3x/wtg/eca';
import Parameter from '../../../../parsers/w3x/wtg/parameter';
import SubParameters from '../../../../parsers/w3x/wtg/subparameters';
import WeuData from '../data';
import { convertParameterInline } from '../conversions';

type WEUTransformerTest = [number, string];

type WEUTransformerOp = [number, '+' | '-' | '*' | '/', number];

type WEUTransformerParameter = number | string | WEUTransformerOp;

interface WEUTransformerTransformation {
  test?: WEUTransformerTest;
  tests?: WEUTransformerTest[];
  parameters?: WEUTransformerParameter[];
}

interface WEUTransformerTransformations {
  [keyof: string]: WEUTransformerTransformation | WEUTransformerTransformation[];
}

function runTests(data: WeuData, object: ECA | SubParameters, args: string[], mapping: WEUTransformerTransformation, convertedParameters: string[]): boolean {
  const parameters = object.parameters;
  const tests = [];

  if (mapping.test) {
    tests.push(mapping.test);
  }

  if (mapping.tests) {
    tests.push(...mapping.tests);
  }

  for (const [index, value] of tests) {
    // Convert and cache the parameter.
    if (convertedParameters[index] === undefined) {
      convertedParameters[index] = convertParameterInline(data, parameters[index], args[index]);
    }

    if (value !== convertedParameters[index]) {
      return false;
    }
  }

  return true;
}

function setNameAndType(data: WeuData, object: ECA | SubParameters, name: string): void {
  object.name = name;
  object.type = data.triggerData.getFunctionType(name);

  if (object instanceof SubParameters) {
    const parameter = <Parameter>data.stack[1];

    parameter.value = name;
  }
}

function setParameters(data: WeuData, object: ECA | SubParameters, args: string[], mapping: WEUTransformerTransformation): void {
  if (mapping.parameters) {
    const parameters = object.parameters;

    object.parameters = mapping.parameters.map((value) => {
      if (typeof value === 'number') {
        return parameters[value];
      } else if (typeof value === 'string') {
        const parameter = new Parameter();

        if (data.triggerData.getPreset(value)) {
          parameter.type = 0;
        } else {
          parameter.type = 3;
        }

        parameter.value = value;

        return parameter;
      } else {
        const whichParameter = value[0];
        const whichOperator = value[1];
        const operandValue = value[2];
        const argType = args[whichParameter];
        let typedFunction;
        let mathOp;

        if (argType === 'integer') {
          typedFunction = 'OperatorInt';
        } else if (argType === 'real') {
          typedFunction = 'OperatorReal';
        } else {
          throw new Error(`Attempted to use an operator on a non-number parameter of type "${argType}`);
        }

        if (whichOperator === '+') {
          mathOp = 'OperatorAdd';
        } else if (whichOperator === '-') {
          mathOp = 'OperatorSubtract';
        } else if (whichOperator === '*') {
          mathOp = 'OperatorMultiply';
        } else {
          mathOp = 'OperatorDivide';
        }

        const parameter = new Parameter();

        parameter.value = typedFunction;
        parameter.type = 2;

        const subParameters = new SubParameters();

        subParameters.name = typedFunction;
        subParameters.type = 3;

        const operandA = parameters[whichParameter];

        const operator = new Parameter();

        operator.type = 0;
        operator.value = mathOp;

        const operandB = new Parameter();

        operandB.type = 3;
        operandB.value = `${operandValue}`;

        subParameters.beginParameters = 1;
        subParameters.parameters = [operandA, operator, operandB];

        parameter.subParameters = subParameters;

        return parameter;
      }
    });
  }
}

export default function transformer(transformations: WEUTransformerTransformations) {
  return function (data: WeuData, object: ECA | SubParameters): boolean {
    // The signature for the input (to be replaced) function.
    const signature = data.triggerData.getFunction(object.type, object.name);

    // This can happen if there is a transformer that is implemented, however it's not found in the custom TriggerData.txt
    // Perhaps it will be worthwhile in the future to also query the signature from common.j, however that's an extra download etc.
    // For now I am going to assume the used YDWE TriggerData.txt exposes more or less everything.
    if (!signature) {
      console.warn(`transformer failed to get the signature for the input function: ${object.name}`);

      return false;
    }

    const args = signature.args;

    // A cache for converted parameters.
    // If there are multiple transformations, or transformations with multiple mappings, usually they branch on the same parameter(s).
    // The first time a parameter is tested, it will be converted, and stored here.
    // The next time it is tested, it will be fetched directly.
    const convertedParameters: string[] = [];

    for (const [name, mappings] of Object.entries(transformations)) {
      let mappingAsArray;

      if (Array.isArray(mappings)) {
        mappingAsArray = mappings;
      } else {
        mappingAsArray = [mappings];
      }

      for (const mapping of mappingAsArray) {
        if (runTests(data, object, args, mapping, convertedParameters)) {
          setNameAndType(data, object, name);
          setParameters(data, object, args, mapping);

          return true;
        }
      }
    }

    return false;
  };
}

export type Transformer = ReturnType<typeof transformer>;
