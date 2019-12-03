import urlWithParams from '../../../common/urlwithparams';
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

    // SPN
    this.internalModel = null;

    // SPL & UBR
    this.internalTexture = null;
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
    let solverParams = model.solverParams;

    if (type === 'SPN') {
      tables[0] = viewer.loadGeneric(urlWithParams(pathSolver('Splats\\SpawnData.slk')[0], solverParams), 'text', mappedDataCallback);
    } else if (type === 'SPL') {
      tables[0] = viewer.loadGeneric(urlWithParams(pathSolver('Splats\\SplatData.slk')[0], solverParams), 'text', mappedDataCallback);
    } else if (type === 'UBR') {
      tables[0] = viewer.loadGeneric(urlWithParams(pathSolver('Splats\\UberSplatData.slk')[0], solverParams), 'text', mappedDataCallback);
    } else if (type === 'SND') {
      tables[0] = viewer.loadGeneric(urlWithParams(pathSolver('UI\\SoundInfo\\AnimLookups.slk')[0], solverParams), 'text', mappedDataCallback);
      tables[1] = viewer.loadGeneric(urlWithParams(pathSolver('UI\\SoundInfo\\AnimSounds.slk')[0], solverParams), 'text', mappedDataCallback);
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
        this.internalModel = viewer.load(row.Model.replace('.mdl', '.mdx'), pathSolver, model.solverParams);
        this.internalModel.whenLoaded().then(() => this.ok = this.internalModel.ok);
      } else if (type === 'SPL' || type === 'UBR') {
        this.internalTexture = viewer.load('replaceabletextures/splats/' + row.file + '.blp', pathSolver, model.solverParams);
        this.internalTexture.whenLoaded().then(() => this.ok = this.internalTexture.ok);

        this.scale = row.Scale;
        this.colors = [
          new Float32Array([row.StartR, row.StartG, row.StartB, row.StartA]),
          new Float32Array([row.MiddleR, row.MiddleG, row.MiddleB, row.MiddleA]),
          new Float32Array([row.EndR, row.EndG, row.EndB, row.EndA]),
        ];

        if (type === 'SPL') {
          this.columns = row.Columns;
          this.rows = row.Rows;
          this.lifeSpan = row.Lifespan + row.Decay;
          this.intervalTimes = new Float32Array([row.Lifespan, row.Decay]);
          this.intervals = [
            new Float32Array([row.UVLifespanStart, row.UVLifespanEnd, row.LifespanRepeat]),
            new Float32Array([row.UVDecayStart, row.UVDecayEnd, row.DecayRepeat]),
          ];
        } else {
          this.columns = 1;
          this.rows = 1;
          this.lifeSpan = row.BirthTime + row.PauseTime + row.Decay;
          this.intervalTimes = new Float32Array([row.BirthTime, row.PauseTime, row.Decay]);
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

            viewer.whenLoaded(fileNames.map((fileName) => viewer.loadGeneric(urlWithParams(pathSolver(row.DirectoryBase + fileName)[0], solverParams), 'arrayBuffer', decodedDataCallback)))
              .then((resources) => {
                for (let resource of resources) {
                  this.decodedBuffers.push(resource.data);
                }

                this.ok = true;
              });
          }
        }
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
