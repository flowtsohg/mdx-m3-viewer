import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';
import Parameter from './parameter';
import { FunctionSignature, TriggerData } from './triggerdata';

/**
 * A function call in an expression.
 */
export default class SubParameters {
  type: number = 0;
  name: string = '';
  beginParameters: number = 0;
  parameters: Parameter[] = [];

  load(stream: BinaryStream, version: number, triggerData: TriggerData) {
    this.type = stream.readInt32();

    if (this.type < 0 || this.type > 3) {
      throw new Error(`SubParameters: Bad type: ${this.type}`);
    }

    this.name = stream.readNull();

    if (this.name.length === 0) {
      throw new Error(`SubParameters: Empty name`);
    }

    this.beginParameters = stream.readInt32();

    if (this.beginParameters) {
      let signature = triggerData.getFunction(this.type, this.name);

      if (!signature) {
        throw new Error(`SubParameters "${this.name}:${this.type}": Unknown signature`);
      }

      let args = signature.args;

      for (let i = 0, l = args.length; i < l; i++) {
        let parameter = new Parameter();

        try {
          parameter.load(stream, version, triggerData);
        } catch (e) {
          throw new Error(`SubParameters "${this.name}": Parameter ${i}: ${e}`);
        }

        this.parameters[i] = parameter;
      }
    }
  }

  save(stream: BinaryStream, version: number) {
    stream.writeInt32(this.type);
    stream.writeNull(this.name);
    stream.writeInt32(this.beginParameters);

    for (let parameter of this.parameters) {
      parameter.save(stream, version);
    }
  }

  getByteLength(version: number) {
    let size = 9 + byteLengthUtf8(this.name);

    if (this.parameters.length) {
      for (let parameter of this.parameters) {
        size += parameter.getByteLength(version);
      }
    }

    return size;
  }
}
