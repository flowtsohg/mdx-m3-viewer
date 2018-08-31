import {vec2} from 'gl-matrix';
import MappedData from '../../../utils/mappeddata';
import {decodeAudioData} from '../../../common/audio';
import GenericObject from './genericobject';
import {emitterFilterMode} from './filtermode';

let mappedDataCallback = (text) => new MappedData(text);
let decodedDataCallback = (arrayBuffer) => decodeAudioData(arrayBuffer);

/**
 * An event object.
 */
export default class EventObject extends GenericObject {
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

    this.ok = false;
    this.type = type;
    this.id = id;

    this.internalResource = null;

    // For SND
    this.decodedBuffers = [];

    this.tracks = eventObject.tracks;
    this.ok = false;
    this.globalSequence = null;
    this.defval = vec2.create();

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
        this.load(tables);

        promise.resolve();
      });
  }

  /**
   * @param {Array<SlkFile>} tables
   */
  load(tables) {
    if (!tables[0].ok) {
      return;
    }

    let type = this.type;
    let model = this.model;
    let viewer = model.viewer;
    let pathSolver = model.pathSolver;
    let row = tables[0].data.getRow(this.id);

    if (row) {
      if (type === 'SPN') {
        this.internalResource = viewer.load(row.Model.replace('.mdl', '.mdx'), pathSolver);
      } else if (type === 'SPL' || type === 'UBR') {
        this.internalResource = viewer.load('replaceabletextures/splats/' + row.file + '.blp', pathSolver);
        this.colors = [[row.StartR, row.StartG, row.StartB, row.StartA], [row.MiddleR, row.MiddleG, row.MiddleB, row.MiddleA], [row.EndR, row.EndG, row.EndB, row.EndA]];
        this.scale = row.Scale;

        if (type === 'SPL') {
          this.dimensions = [row.Columns, row.Rows];
          this.intervals = [[row.UVLifespanStart, row.UVLifespanEnd, row.LifespanRepeat], [row.UVDecayStart, row.UVDecayEnd, row.DecayRepeat]];
          this.intervalTimes = [row.Lifespan, row.Decay];
          this.lifespan = row.Lifespan + row.Decay;
        } else {
          this.dimensions = [1, 1];
          this.intervalTimes = [row.BirthTime, row.PauseTime, row.Decay];
          this.lifespan = row.BirthTime + row.PauseTime + row.Decay;
        }

        [this.blendSrc, this.blendDst] = emitterFilterMode(row.BlendMode, viewer.gl);
      } else if (type === 'SND') {
        // Only load sounds if audio is enabled.
        // This is mostly to save on bandwidth and loading time, especially when loading full maps.
        if (viewer.enableAudio) {
          if (!tables[1].ok) {
            return;
          }

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

  getValue(out, instance) {
    if (this.globalSequence) {
      let globalSequence = this.globalSequence;

      return this.getValueAtTime(out, instance.counter % globalSequence, 0, globalSequence);
    } else if (instance.sequence !== -1) {
      let interval = this.model.sequences[instance.sequence].interval;

      return this.getValueAtTime(out, instance.frame, interval[0], interval[1]);
    } else {
      let defval = this.defval;

      out[0] = defval[0];
      out[1] = defval[1];

      return out;
    }
  }

  getValueAtTime(out, frame, start, end) {
    let tracks = this.tracks;

    if (frame < start || frame > end) {
      out[0] = 0;
      out[1] = 0;
      return out;
    }

    for (let i = tracks.length - 1; i > -1; i--) {
      if (tracks[i] < start) {
        out[0] = 0;
        out[1] = i;
        return out;
      } else if (tracks[i] <= frame) {
        out[0] = 1;
        out[1] = i;
        return out;
      }
    }

    out[0] = 0;
    out[1] = 0;
    return out;
  }
}
