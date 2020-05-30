import Trigger from '../../parsers/w3x/wtg/trigger';
import ECA from '../../parsers/w3x/wtg/eca';
import Parameter from '../../parsers/w3x/wtg/parameter';
import SubParameters from '../../parsers/w3x/wtg/subparameters';
import CustomTextTrigger from '../../parsers/w3x/wct/customtexttrigger';
import TriggerData from '../../parsers/w3x/wtg/triggerdata';
import War3MapWts from '../../parsers/w3x/wts/file';

export interface WEUChange {
  type: string;
  reason: string;
  data: string;
  stack: string;
}

export default class WeuData {
  triggerData: TriggerData;
  stringTable: War3MapWts;
  preplacedObjects: Map<string, boolean> = new Map();
  changes: WEUChange[] = [];
  stack: (Trigger | ECA | Parameter | SubParameters)[] = [];

  constructor(triggerData: TriggerData, stringTable: War3MapWts) {
    this.triggerData = triggerData;
    this.stringTable = stringTable;
  }

  push(object: Trigger | ECA | Parameter | SubParameters) {
    this.stack.unshift(object);
  }

  pop() {
    this.stack.shift();
  }

  change(type: string, reason: string, data: string) {
    this.changes.push({ type, reason, data, stack: this.stackToString() });
  }

  stackToString() {
    return this.stack.map((object) => {
      if (object instanceof Parameter) {
        return object.value;
      } else {
        return object.name;
      }
    }).reverse().join(' > ');
  }

  getTriggerName() {
    for (let node of this.stack) {
      if (node instanceof Trigger) {
        return node.name;
      }
    }

    return '';
  }

  /**
   * Every time a reference to a preplaced object is encountered while testing the GUI, this will be called with isGUI being true.
   * Every time a reference to a preplaced object is converted to custom script, this will be called with isGUI being false.
   * This is used to track references that existed in GUI before the conversion, but that will be only in custom scripts afterwards.
   * References that are lost due to the conversion are then added in a new trigger called PreplacedObjectReferences.
   */
  updateGUIReference(name: string, isGUI: boolean) {
    // For now track only units and destructibles.
    // Not sure what else needs tracking.
    if (name.startsWith('gg_unit') || name.startsWith('gg_dest')) {
      let preplacedObjects = this.preplacedObjects;

      // If the reference is already known to be used by GUI, no need to do anything.
      if (!preplacedObjects.get(name)) {
        preplacedObjects.set(name, isGUI);
      }
    }
  }

  saveGUIReferences(triggers: Trigger[], customTextTriggers: CustomTextTrigger[]) {
    let references = [];

    // Get all of the references that are no longer references.
    for (let [name, isGUI] of this.preplacedObjects) {
      if (!isGUI) {
        references.push(name);
      }
    }

    // If there are indeed missing references, add them to a new trigger.
    if (references.length) {
      let trigger = new Trigger();
      trigger.name = 'PreplacedObjectReferences';
      trigger.isEnabled = 1;
      trigger.isInitiallyOff = 1;

      for (let reference of references) {
        let eca = new ECA();
        eca.type = 2;
        eca.isEnabled = 1;

        if (reference.startsWith('gg_unit')) {
          eca.name = 'RemoveUnit';
        } else if (reference.startsWith('gg_dest')) {
          eca.name = 'RemoveDestructable';
        }

        let parameter = new Parameter();
        parameter.type = 1;
        parameter.value = reference;

        eca.parameters[0] = parameter;

        trigger.ecas.push(eca);
      }

      triggers.push(trigger);
      customTextTriggers.push(new CustomTextTrigger());

      this.change('references', 'References to preplaced objects lost due to conversions', references.join('\n'));
    }
  }
}
