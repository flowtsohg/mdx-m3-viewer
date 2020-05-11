import War3Map from '../../parsers/w3x/map';
import TriggerData from '../../parsers/w3x/wtg/triggerdata';
import CustomTextTrigger from '../../parsers/w3x/wct/customtexttrigger';
import WeuData from './data';
import { processTrigger } from './processing';
import { convertTrigger } from './conversions';

export default function convertWeu(map: War3Map, customTriggerData: TriggerData, weTriggerData: TriggerData) {
  let wtg;
  let wct;
  let wts;

  // Try to read the triggers file using the custom trigger data.
  try {
    wtg = map.readTriggers(customTriggerData);
  } catch (e) {
    return { ok: false, error: `Failed to read the triggers file: ${e}` };
  }

  if (!wtg) {
    return { ok: false, error: `The triggers file doesn't exist. This means this map is most likely protected/optimized.` };
  }

  // Try to read the custom text triggers file.
  try {
    wct = map.readCustomTextTriggers();
  } catch (e) {
    return { ok: false, error: `Failed to read the custom text triggers file: ${e}` };
  }

  if (!wct) {
    return { ok: false, error: `The custom text triggers file doesn't exist` };
  }

  // Try to read the string table.
  try {
    wts = map.readStringTable();
  } catch (e) {
    return { ok: false, error: `Failed to read the string table file: ${e}` };
  }

  if (!wts) {
    return { ok: false, error: `The string table file doesn't exist` };
  }

  let data = new WeuData(customTriggerData, wts);
  let triggers = wtg.triggers;
  let customTextTriggers = wct.triggers;
  let mapHeader = wct.trigger;

  // If there are less custom text triggers than triggers, WE does not crash, however it doesn't load the map.
  if (customTextTriggers.length < triggers.length) {
    for (let i = 0, l = triggers.length - customTextTriggers.length; i < l; i++) {
      customTextTriggers.push(new CustomTextTrigger());
    }
  }

  // Process and convert the triggers as needed.
  for (let i = 0, l = triggers.length; i < l; i++) {
    let trigger = triggers[i];

    // Any callbacks that are generated due to conversions for this trigger will end up here.
    let callbacks: string[] = [];

    try {
      // Process the trigger.
      // If things inside it need to be converted, this will convert them.
      let result = processTrigger(data, trigger, callbacks);

      // If the trigger itself needs to be converted, convert it.
      if (result.convert) {
        data.push(trigger);

        // The trigger body.
        let body = convertTrigger(data, trigger, callbacks);

        // If any callbacks were generated when converting the trigger, add them to the trigger.
        if (callbacks.length) {
          body = `${callbacks.join('\r\n')}\r\n${body}`;
        }

        customTextTriggers[i].text = body;

        trigger.ecas.length = 0;
        trigger.isCustom = 1;

        data.change('convertedtrigger', result.reason, customTextTriggers[i].text);
        data.pop();
      } else if (callbacks.length) {
        let callbacksText = callbacks.join('\r\n');

        // If the trigger didn't need to be converted, but callbacks were generated due to things inside it being converted, add them to the map header.
        mapHeader.text += `// Callbacks generated for trigger "${trigger.name}" due to conversions\r\n${callbacksText}\r\n`;

        data.change('generatedcallbacks', trigger.name, callbacksText);
      }
    } catch (e) {
      return { ok: false, error: `Error at ${data.stackToString()}: ${e}` };
    }
  }

  // WE will only generate global variables for preplaced objects that are referenced directly by GUI.
  // Referencing them in custom text ECAs or custom text triggers doesn't cut it.
  // This function saves such references if they are deemed to be lost due to the conversion.
  // It does this by adding a new trigger called PreplacedObjectReferences, which is not initially on.
  // In it an ECA is added for each reference.
  // Note that this is not the case for all preplaced objects.
  // For example, triggers and regions seem to always be available.
  // For now only units and destructibles are checked.
  data.saveGUIReferences(triggers, customTextTriggers);

  // Save the triggers file back.
  map.set('war3map.wtg', wtg.save());

  // Save the custom text triggers file back.
  map.set('war3map.wct', wct.save());

  // Now try to re-read the triggers file, but using the normal WE trigger data.
  // If this fails, WE will fail too.
  try {
    wtg = map.readTriggers(weTriggerData);
  } catch (e) {
    return { ok: false, error: `Failed to validate the triggers file: ${e}` }
  }

  if (!wtg) {
    return { ok: false, error: `Failed to re-read the triggers file` };
  }

  return { ok: true, changes: data.changes };
}
