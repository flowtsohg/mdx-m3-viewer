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

/**
 * An event object.
 */
export default class EventObjectEmitterObject extends GenericObject {
  geometryEmitterType: number = -1;
  type: string;
  id: string;
  tracks: Uint32Array;
  globalSequence: number = -1;
  defval: Uint32Array = new Uint32Array(1);
  internalModel: MdxModel | null = null;
  internalTexture: MdxTexture | null = null;
  colors: Float32Array[] = [];
  intervalTimes: Float32Array = new Float32Array(3);
  scale: number = 0;
  columns: number = 0;
  rows: number = 0;
  lifeSpan: number = 0;
  blendSrc: number = 0;
  blendDst: number = 0;
  intervals: Float32Array[] = [];
  distanceCutoff: number = 0;
  maxDistance: number = 0;
  minDistance: number = 0;
  pitch: number = 0;
  pitchVariance: number = 0;
  volume: number = 0;
  decodedBuffers: AudioBuffer[] = [];
  ok: boolean = false;

  constructor(model: MdxModel, eventObject: EventObject, index: number) {
    super(model, eventObject, index);

    let viewer = model.viewer;
    let name = eventObject.name;
    let type = name.substring(0, 3);
    let id = name.substring(4);

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

    let globalSequenceId = eventObject.globalSequenceId;
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
    let resolve = viewer.promise();

    mdxHandler.getEventObjectData(viewer, type, id, model.hd)
      .then((data) => {
        // Now the promise can be resolved to allow the viewer to handle events correctly.
        resolve();

        if (data) {
          let row = data.row;

          this.ok = true;

          if (type === 'SPN') {
            this.internalModel = <MdxModel>data.resources[0];
          } else if (type === 'SPL' || type === 'UBR') {
            this.internalTexture = new MdxTexture(0, true, true);
            this.internalTexture.texture = <Texture>data.resources[0];

            this.scale = <number>row.Scale;
            this.colors[0] = new Float32Array([<number>row.StartR, <number>row.StartG, <number>row.StartB, <number>row.StartA]);
            this.colors[1] = new Float32Array([<number>row.MiddleR, <number>row.MiddleG, <number>row.MiddleB, <number>row.MiddleA]);
            this.colors[2] = new Float32Array([<number>row.EndR, <number>row.EndG, <number>row.EndB, <number>row.EndA]);

            if (type === 'SPL') {
              this.columns = <number>row.Columns;
              this.rows = <number>row.Rows;
              this.lifeSpan = <number>row.Lifespan + <number>row.Decay;

              this.intervalTimes[0] = <number>row.Lifespan;
              this.intervalTimes[1] = <number>row.Decay;

              this.intervals[0] = new Float32Array([<number>row.UVLifespanStart, <number>row.UVLifespanEnd, <number>row.LifespanRepeat]);
              this.intervals[1] = new Float32Array([<number>row.UVDecayStart, <number>row.UVDecayEnd, <number>row.DecayRepeat]);
            } else {
              this.columns = 1;
              this.rows = 1;
              this.lifeSpan = <number>row.BirthTime + <number>row.PauseTime + <number>row.Decay;

              this.intervalTimes[0] = <number>row.BirthTime;
              this.intervalTimes[1] = <number>row.PauseTime;
              this.intervalTimes[2] = <number>row.Decay;
            }

            let blendModes = emitterFilterMode(<number>row.BlendMode, viewer.gl);

            this.blendSrc = blendModes[0];
            this.blendDst = blendModes[1];
          } else {
            this.distanceCutoff = <number>row.DistanceCutoff;
            this.maxDistance = <number>row.MaxDistance;
            this.minDistance = <number>row.MinDistance;
            this.pitch = <number>row.Pitch;
            this.pitchVariance = <number>row.PitchVariance;
            this.volume = <number>row.Volume;

            for (let resource of data.resources) {
              this.decodedBuffers.push((<GenericResource>resource).data);
            }
          }
        }
      });
  }

  getValue(out: Uint32Array, instance: MdxModelInstance) {
    if (this.globalSequence !== -1) {
      let globalSequence = this.globalSequence;

      return this.getValueAtTime(out, instance.counter % globalSequence, 0, globalSequence);
    } else if (instance.sequence !== -1) {
      let interval = this.model.sequences[instance.sequence].interval;

      return this.getValueAtTime(out, instance.frame, interval[0], interval[1]);
    } else {
      out[0] = this.defval[0];

      return -1;
    }
  }

  getValueAtTime(out: Uint32Array, frame: number, start: number, end: number) {
    let tracks = this.tracks;

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
