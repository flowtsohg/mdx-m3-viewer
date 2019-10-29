import {decodeAudioData} from '../../../common/audio';
import MappedData from '../../../utils/mappeddata';
import GenericObject from './genericobject';
import {emitterFilterMode} from './filtermode';
import {EMITTER_SPLAT, EMITTER_UBERSPLAT} from './geometryemitterfuncs';

const mappedDataCallback = (text) => new MappedData(text);
const decodedDataCallback = (arrayBuffer) => decodeAudioData(arrayBuffer);

/**
 * An event object.
 */
export default class EventObjectEmitterObject extends GenericObject {
  /**
   * @param {MdxModel} model
   * @param {MdxParserEventObjectEmitter} eventObject
   * @param {number} index
   */
  constructor(model, eventObject, index) {
    super(model, eventObject, index);

    let viewer = model.viewer;
    let name = eventObject.name;
    let type = name.substring(0, 3);
    let id = name.substring(4);

    // Same thing
    if (type === 'FPT') {
      type = 'SPL';
    }

    let geometryEmitterType = -1;

    if (type === 'SPL') {
      geometryEmitterType = EMITTER_SPLAT;
    } else if (type === 'UBR') {
      geometryEmitterType = EMITTER_UBERSPLAT;
    }

    this.geometryEmitterType = geometryEmitterType;

    this.ok = false;
    this.type = type;
    this.id = id;
    this.tracks = eventObject.tracks;
    this.globalSequence = null;
    this.defval = new Uint32Array(1);

    // SPN - Model
    // SPL & UBR - Texture
    this.internalResource = null;

    // SPL & UBR
    this.colors = null;
    this.intervalTimes = null;
    this.scale = 0;
    this.columns = 0;
    this.rows = 0;
    this.lifeSpan = 0;
    this.blendSrc = 0;
    this.blendDst = 0;

    // SPL
    this.intervals = null;

    // SND
    this.distanceCutoff = 0;
    this.maxDistance = 0;
    this.minDistance = 0;
    this.pitch = 0;
    this.pitchVariance = 0;
    this.volume = 0;
    this.decodedBuffers = [];

    let globalSequenceId = eventObject.globalSequenceId;
    if (globalSequenceId !== -1) {
      this.globalSequence = model.globalSequences[globalSequenceId];
    }

    let tables = [];
    let pathSolver = model.pathSolver;

    if (type === 'SPN') {
      tables[0] = viewer.loadGeneric(pathSolver('Splats\\SpawnData.slk')[0], 'text', mappedDataCallback);
    } else if (type === 'SPL') {
      tables[0] = viewer.loadGeneric(pathSolver('Splats\\SplatData.slk')[0], 'text', mappedDataCallback);
    } else if (type === 'UBR') {
      tables[0] = viewer.loadGeneric(pathSolver('Splats\\UberSplatData.slk')[0], 'text', mappedDataCallback);
    } else if (type === 'SND') {
      tables[0] = viewer.loadGeneric(pathSolver('UI\\SoundInfo\\AnimLookups.slk')[0], 'text', mappedDataCallback);
      tables[1] = viewer.loadGeneric(pathSolver('UI\\SoundInfo\\AnimSounds.slk')[0], 'text', mappedDataCallback);
    } else {
      // Units\Critters\BlackStagMale\BlackStagMale.mdx has an event object named "Point01".
      return;
    }

    let promise = viewer.promise();

    viewer.whenLoaded(tables)
      .then((tables) => {
        for (let table of tables) {
          if (!table.ok) {
            promise.resolve();

            return;
          }
        }

        this.load(tables);

        promise.resolve();
      });
  }

  /**
   * @param {Array<SlkFile>} tables
   */
  load(tables) {
    let row = tables[0].data.getRow(this.id);
    let type = this.type;

    if (row) {
      let model = this.model;
      let viewer = model.viewer;
      let pathSolver = model.pathSolver;

      if (type === 'SPN') {
        this.internalResource = viewer.load(row.Model.replace('.mdl', '.mdx'), pathSolver);
      } else if (type === 'SPL' || type === 'UBR') {
        this.internalResource = viewer.load('replaceabletextures/splats/' + row.file + '.blp', pathSolver);
        this.colors = [[row.StartR, row.StartG, row.StartB, row.StartA], [row.MiddleR, row.MiddleG, row.MiddleB, row.MiddleA], [row.EndR, row.EndG, row.EndB, row.EndA]];
        this.scale = row.Scale;

        if (type === 'SPL') {
          this.columns = row.Columns;
          this.rows = row.Rows;
          this.intervals = [[row.UVLifespanStart, row.UVLifespanEnd, row.LifespanRepeat], [row.UVDecayStart, row.UVDecayEnd, row.DecayRepeat]];
          this.intervalTimes = [row.Lifespan, row.Decay];
          this.lifeSpan = row.Lifespan + row.Decay;
        } else {
          this.columns = 1;
          this.rows = 1;
          this.intervalTimes = [row.BirthTime, row.PauseTime, row.Decay];
          this.lifeSpan = row.BirthTime + row.PauseTime + row.Decay;
        }

        [this.blendSrc, this.blendDst] = emitterFilterMode(row.BlendMode, viewer.gl);
      } else if (type === 'SND') {
        // Only load sounds if audio is enabled.
        // This is mostly to save on bandwidth and loading time, especially when loading full maps.
        if (viewer.enableAudio) {
          row = tables[1].data.getRow(row.SoundLabel);

          if (row) {
            this.distanceCutoff = row.DistanceCutoff;
            this.maxDistance = row.MaxDistance;
            this.minDistance = row.MinDistance;
            this.pitch = row.Pitch;
            this.pitchVariance = row.PitchVariance;
            this.volume = row.Volume;

            let fileNames = row.FileNames.split(',');

            viewer.whenLoaded(fileNames.map((fileName) => viewer.loadGeneric(pathSolver(row.DirectoryBase + fileName)[0], 'arrayBuffer', decodedDataCallback)))
              .then((resources) => {
                for (let resource of resources) {
                  this.decodedBuffers.push(resource.data);
                }

                this.ok = true;
              });
          }
        }
      }

      if (this.internalResource) {
        this.internalResource.whenLoaded()
          .then(() => this.ok = true);
      }
    } else {
      console.warn('Unknown event object ID', type, this.id);
    }
  }

  /**
   * @param {Uint32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getValue(out, instance) {
    if (this.globalSequence) {
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

  /**
   * @param {Uint32Array} out
   * @param {number} frame
   * @param {number} start
   * @param {number} end
   * @return {number}
   */
  getValueAtTime(out, frame, start, end) {
    let tracks = this.tracks;

    if (frame < start || frame > end) {
      out[0] = 0;
      return -1;
    }

    for (let i = tracks.length - 1; i > -1; i--) {
      if (tracks[i] < start) {
        out[0] = 0;
        return i;
      } else if (tracks[i] <= frame) {
        out[0] = 1;
        return i;
      }
    }

    out[0] = 0;
    return -1;
  }
}
