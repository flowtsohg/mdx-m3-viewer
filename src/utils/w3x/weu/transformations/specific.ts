import ECA from '../../../../parsers/w3x/wtg/eca';
import Parameter from '../../../../parsers/w3x/wtg/parameter';
import SubParameters from '../../../../parsers/w3x/wtg/subparameters';
import WeuData from '../data';
import { convertParameterInline } from '../conversions';

/**
 * IsUnitOwnedByPlayer(whichUnit, whichPlayer) == boolean
 * =>
 * GetOwningPlayer(whichUnit) == whichPlayer
 */
export function transformerIsUnitOwnedByPlayer(data: WeuData, object: ECA | SubParameters): boolean {
  const parameter = <Parameter>data.stack[1];
  const comparator = <ECA>data.stack[2];
  const comparatorParameters = comparator.parameters;

  if (comparator.name !== 'OperatorCompareBoolean') {
    return false;
  }

  let otherParameter;

  if (comparator.parameters[0] === parameter) {
    otherParameter = comparatorParameters[2];
  } else {
    otherParameter = comparatorParameters[0];
  }

  const trueOrFalse = convertParameterInline(data, otherParameter, 'boolean');

  if (trueOrFalse !== 'true' && trueOrFalse !== 'false') {
    return false;
  }

  // Change to a player comparison.
  comparator.name = 'OperatorComparePlayer';

  const parameters = object.parameters;
  const whichPlayer = parameters[1];

  // Change IsUnitOwnedByPlayer(whichUnit, whichPlayer) to GetOwningPlayer(whichUnit)
  parameter.value = 'GetOwningPlayer';

  object.name = 'GetOwningPlayer';
  object.parameters.length = 1;

  comparatorParameters[0] = parameter;

  // Equal or not equal.
  if (trueOrFalse === 'true') {
    comparatorParameters[1].value = 'OperatorEqualENE';
  } else {
    comparatorParameters[1].value = 'OperatorNotEqualENE';
  }

  // Change the boolean to whichPlayer.
  comparatorParameters[2] = whichPlayer;

  return true;
}

/**
 * IsUnitRace(whichUnit, whichRace) == boolean
 * =>
 * GetUnitRace(whichUnit) == whichRace
 */
export function transformerIsUnitRace(data: WeuData, object: ECA | SubParameters): boolean {
  const parameter = <Parameter>data.stack[1];
  const comparator = <ECA>data.stack[2];
  const comparatorParameters = comparator.parameters;

  if (comparator.name !== 'OperatorCompareBoolean') {
    return false;
  }

  let otherParameter;

  if (comparator.parameters[0] === parameter) {
    otherParameter = comparatorParameters[2];
  } else {
    otherParameter = comparatorParameters[0];
  }

  const trueOrFalse = convertParameterInline(data, otherParameter, 'boolean');

  if (trueOrFalse !== 'true' && trueOrFalse !== 'false') {
    return false;
  }

  // Change to a race comparison.
  comparator.name = 'OperatorCompareRace';

  const parameters = object.parameters;
  const whichRace = parameters[1];

  // Change IsUnitRace(whichUnit, whichRace) to GetUnitRace(whichUnit)
  parameter.value = 'GetUnitRace';

  object.name = 'GetUnitRace';
  object.parameters.length = 1;

  comparatorParameters[0] = parameter;

  const isEqual = comparatorParameters[1].value === 'OperatorEqualENE';
  const isTrue = trueOrFalse === 'true';

  // Essentially a XOR between the booleans.
  if (isEqual === isTrue) {
    comparatorParameters[1].value = 'OperatorEqualENE';
  } else {
    comparatorParameters[1].value = 'OperatorNotEqualENE';
  }

  comparatorParameters[1] = whichRace;

  return true;
}

/**
 * IsUnitType(whichUnit, UNIT_TYPE_DEAD) == boolean
 * =>
 * IsUnitDeadBJ(whichUnit) == boolean
 */
export function transformerIsUnitType(data: WeuData, object: ECA | SubParameters): boolean {
  const comparator = <ECA>data.stack[2];

  if (comparator.name !== 'OperatorCompareBoolean') {
    return false;
  }

  const whichUnitType = convertParameterInline(data, object.parameters[1], 'unittype');

  if (whichUnitType !== 'UNIT_TYPE_DEAD') {
    return false;
  }

  const parameter = <Parameter>data.stack[1];

  // Change IsUnitType(whichUnit, UNIT_TYPE_DEAD) to IsUnitDeadBJ(whichUnit)
  parameter.value = 'IsUnitDeadBJ';

  object.name = 'IsUnitDeadBJ';
  object.parameters.length = 1;

  return true;
}
