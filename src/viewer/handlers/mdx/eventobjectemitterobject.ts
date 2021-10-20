import EventObject from '../../../parsers/mdlx/eventobject';
import Texture from '../../texture';
import GenericResource from '../../genericresource';
import mdxHandler from './handler';
import MdxModel from './model';
import GenericObject from './genericobject';
import { emitterFilterMode } from './filtermode';
import { EMITTER_SPLAT, EMITTER_UBERSPLAT } from './geometryemitterfuncs';
import MdxModelInstance from './modelinstance';
import MdxTexture from './texture';
import { WrapMode } from '../../../parsers/mdlx/texture';

/**
 * An event object.
 */
export default class EventObjectEmitterObject extends GenericObject {
  geometryEmitterType = -1;
  type: string;
  id: string;
  tracks: Uint32Array;
  globalSequence = -1;
  defval = new Uint32Array(1);
  internalModel: MdxModel | null = null;
  internalTexture: MdxTexture | null = null;
  colors: Float32Array[] = [];
  intervalTimes = new Float32Array(3);
  scale = 0;
  columns = 0;
  rows = 0;
  lifeSpan = 0;
  blendSrc = 0;
  blendDst = 0;
  intervals: Float32Array[] = [];
  distanceCutoff = 0;
  maxDistance = 0;
  minDistance = 0;
  pitch = 0;
  pitchVariance = 0;
  volume = 0;
  decodedBuffers: AudioBuffer[] = [];
  ok = false;

  constructor(model: MdxModel, eventObject: EventObject, index: number) {
    super(model, eventObject, index);

    const viewer = model.viewer;
    const name = eventObject.name;
    let type = name.substring(0, 3);
    const id = name.substring(4);

    // Same thing
    if (type === 'FPT') {
      type = 'SPL';
    }

    if (type === 'SPL') {
      this.geometryEmitterType = EMITTER_SPLAT;
    } else if (type === 'UBR') {
      this.geometryEmitterType = EMITTER_UBERSPLAT;
    }

    this.type = type;
    this.id = id;
    this.tracks = eventObject.tracks;

    const globalSequenceId = eventObject.globalSequenceId;
    if (globalSequenceId !== -1) {
      this.globalSequence = model.globalSequences[globalSequenceId];
    }

    // If this is a sound event object, and the viewer doesn't have audio enabled, don't do anything.
    // This saves bandwidth when audio is not desired.
    if (type === 'SND' && !viewer.audioEnabled) {
      return;
    }

    // It's not possible to know ahead of time what file(s) event objects would need.
    // This is because the SLKs are lazily loaded, and might not exist at this point.
    // Therefore make a promise, and resolve it after all of the files loaded.
    const resolve = viewer.promise();

    mdxHandler.getEventObjectData(viewer, type, id, model.hd)
      .then((data) => {
        // Now the promise can be resolved to allow the viewer to handle events correctly.
        resolve();

        if (data) {
          const { row, resources } = data;

          this.ok = true;

          if (type === 'SPN') {
            this.internalModel = <MdxModel>resources[0];
          } else if (type === 'SPL' || type === 'UBR') {
            this.internalTexture = new MdxTexture(0, WrapMode.WrapBoth);
            this.internalTexture.texture = <Texture>resources[0];

            this.scale = row.number('Scale');
            this.colors[0] = new Float32Array([row.number('StartR'), row.number('StartG'), row.number('StartB'), row.number('StartA')]);
            this.colors[1] = new Float32Array([row.number('MiddleR'), row.number('MiddleG'), row.number('MiddleB'), row.number('MiddleA')]);
            this.colors[2] = new Float32Array([row.number('EndR'), row.number('EndG'), row.number('EndB'), row.number('EndA')]);

            if (type === 'SPL') {
              this.columns = row.number('Columns');
              this.rows = row.number('Rows');
              this.lifeSpan = row.number('Lifespan') + row.number('Decay');

              this.intervalTimes[0] = row.number('Lifespan');
              this.intervalTimes[1] = row.number('Decay');

              this.intervals[0] = new Float32Array([row.number('UVLifespanStart'), row.number('UVLifespanEnd'), row.number('LifespanRepeat')]);
              this.intervals[1] = new Float32Array([row.number('UVDecayStart'), row.number('UVDecayEnd'), row.number('DecayRepeat')]);
            } else {
              this.columns = 1;
              this.rows = 1;
              this.lifeSpan = row.number('BirthTime') + row.number('PauseTime') + row.number('Decay');

              this.intervalTimes[0] = row.number('BirthTime');
              this.intervalTimes[1] = row.number('PauseTime');
              this.intervalTimes[2] = row.number('Decay');
            }

            const blendModes = emitterFilterMode(row.number('BlendMode'), viewer.gl);

            this.blendSrc = blendModes[0];
            this.blendDst = blendModes[1];
          } else {
            this.distanceCutoff = row.number('DistanceCutoff');
            this.maxDistance = row.number('MaxDistance');
            this.minDistance = row.number('MinDistance');
            this.pitch = row.number('Pitch');
            this.pitchVariance = row.number('PitchVariance');
            this.volume = row.number('Volume');

            for (const resource of resources) {
              this.decodedBuffers.push(<AudioBuffer>(<GenericResource>resource).data);
            }
          }
        }
      });
  }

  getValue(out: Uint32Array, instance: MdxModelInstance): number {
    if (this.globalSequence !== -1) {
      const globalSequence = this.globalSequence;

      return this.getValueAtTime(out, instance.counter % globalSequence, 0, globalSequence);
    } else if (instance.sequence !== -1) {
      const interval = this.model.sequences[instance.sequence].interval;

      return this.getValueAtTime(out, instance.frame, interval[0], interval[1]);
    } else {
      out[0] = this.defval[0];

      return -1;
    }
  }

  getValueAtTime(out: Uint32Array, frame: number, start: number, end: number): number {
    const tracks = this.tracks;

    if (frame >= start && frame <= end) {
      for (let i = tracks.length - 1; i > -1; i--) {
        if (tracks[i] < start) {
          out[0] = 0;

          return i;
        } else if (tracks[i] <= frame) {
          out[0] = 1;

          return i;
        }
      }
    }

    out[0] = 0;

    return -1;
  }
}
