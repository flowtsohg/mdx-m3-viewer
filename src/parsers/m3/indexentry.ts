import reverse from '../../common/stringreverse';
import BinaryStream from '../../common/binarystream';
import Md34 from './md34';
import ModelHeader from './modelheader';
import Sequence from './sequence';
import Stc from './stc';
import Stg from './stg';
import Sts from './sts';
import Bone from './bone';
import Division from './division';
import Region from './region';
import Batch from './batch';
import MaterialReference from './materialreference';
import StandardMaterial from './standardmaterial';
import Layer from './layer';
import Event from './event';
import BoundingSphere from './boundingsphere';
import AttachmentPoint from './attachmentpoint';
import Camera from './camera';
import Sd from './sd';
import UnsupportedEntry from './unsupportedentry';


// Mapping from entry tags, to their constructors and known version->size values.
let tagMapping = {
  // Objects
  MD34: [Md34, { 11: 24 }],
  MODL: [ModelHeader, { 23: 784, 25: 808, 26: 820, 28: 844, 29: 856 }],
  SEQS: [Sequence, { 1: 96, 2: 92 }],
  STC_: [Stc, { 4: 204 }],
  STG_: [Stg, { 0: 24 }],
  STS_: [Sts, { 0: 28 }],
  BONE: [Bone, { 1: 160 }],
  DIV_: [Division, { 2: 52 }],
  REGN: [Region, { 3: 36, 4: 40, 5: 48 }],
  BAT_: [Batch, { 1: 14 }],
  MATM: [MaterialReference, { 0: 8 }],
  MAT_: [StandardMaterial, { 15: 268, 16: 280, 17: 280, 18: 280, 19: 340 }],
  LAYR: [Layer, { 22: 356, 24: 436, 25: 468, 26: 464 }],
  EVNT: [Event, { 0: 96, 1: 104, 2: 108 }],
  BNDS: [BoundingSphere, { 0: 28 }],
  ATT_: [AttachmentPoint, { 1: 20 }],
  CAM_: [Camera, { 3: 180, 5: 264 }],
  SDEV: [Sd, { 0: 32 }],
  SDU6: [Sd, { 0: 32 }],
  SDFG: [Sd, { 0: 32 }],
  SDS6: [Sd, { 0: 32 }],
  SDR3: [Sd, { 0: 32 }],
  SD2V: [Sd, { 0: 32 }],
  SD3V: [Sd, { 0: 32 }],
  SD4Q: [Sd, { 0: 32 }],
  SDCC: [Sd, { 0: 32 }],
  SDMB: [Sd, { 0: 32 }],
  FLAG: [Sd, { 0: 32 }],
  // Unsupported entries
  MSEC: [UnsupportedEntry, { 1: 72 }],
  LITE: [UnsupportedEntry, { 7: 212 }],
  ATVL: [UnsupportedEntry, { 0: 116 }],
  PATU: [UnsupportedEntry, { 4: 152 }],
  TRGD: [UnsupportedEntry, { 0: 24 }],
  DIS_: [UnsupportedEntry, { 4: 68 }],
  CMS_: [UnsupportedEntry, { 0: 24 }],
  CMP_: [UnsupportedEntry, { 2: 28 }],
  TER_: [UnsupportedEntry, { 0: 24, 1: 28 }],
  VOL_: [UnsupportedEntry, { 0: 84 }],
  VON_: [UnsupportedEntry, { 0: 268 }],
  CREP: [UnsupportedEntry, { 0: 24, 1: 28 }],
  STBM: [UnsupportedEntry, { 0: 48 }],
  LFSB: [UnsupportedEntry, { 2: 56 }],
  LFLR: [UnsupportedEntry, { 2: 80, 3: 152 }],
  PAR_: [UnsupportedEntry, { 12: 1316, 17: 1460, 18: 1464, 19: 1464, 21: 1464, 22: 1484, 23: 1492, 24: 1496 }],
  PARC: [UnsupportedEntry, { 0: 40 }],
  PROJ: [UnsupportedEntry, { 4: 388, 5: 382 }],
  PHYJ: [UnsupportedEntry, { 0: 180 }],
  PHCC: [UnsupportedEntry, { 0: 76 }],
  PHAC: [UnsupportedEntry, { 0: 32 }],
  PHCL: [UnsupportedEntry, { 2: 128 }],
  FOR_: [UnsupportedEntry, { 1: 104, 2: 104 }],
  DMSE: [UnsupportedEntry, { 0: 4 }],
  PHSH: [UnsupportedEntry, { 1: 132, 3: 300 }],
  PHRB: [UnsupportedEntry, { 2: 104, 4: 80 }],
  SSGS: [UnsupportedEntry, { 1: 108 }],
  BBSC: [UnsupportedEntry, { 0: 48 }],
  SRIB: [UnsupportedEntry, { 0: 272 }],
  RIB_: [UnsupportedEntry, { 6: 748, 8: 756, 9: 760 }],
  IKJT: [UnsupportedEntry, { 0: 32 }],
  SHBX: [UnsupportedEntry, { 0: 64 }],
  WRP_: [UnsupportedEntry, { 1: 132 }],
};

/**
 * An index entry.
 */
export default class IndexEntry {
  index: IndexEntry[];
  tag: string;
  offset: number;
  version: number;
  entries: any[] | TypedArray;

  constructor(reader: BinaryStream, index: IndexEntry[]) {
    let tag = reverse(reader.read(4));
    let offset = reader.readUint32();
    let entriesCount = reader.readUint32();
    let version = reader.readUint32();

    this.index = index;
    this.tag = tag;
    this.offset = offset;
    this.version = version;

    let mapping = tagMapping[tag];
    let readerOffset = reader.tell();

    reader.seek(offset);

    // This is an object
    if (mapping) {
      let constructor = mapping[0];
      let entrySize = mapping[1][version];

      if (!entrySize) {
        // Yey found a new version!
        throw new Error(': Unsupported object version - tag ' + tag + ' and version ' + version);
      }

      this.entries = [];

      for (let i = 0, l = entriesCount; i < l; i++) {
        // A sub stream is given for each object constructor.
        // This allows for parsing to work consistently, even if we don't quite know exactly how the structures look.
        // If some bytes aren't read, the error will not carry to the next object.
        // Since new versions of objects usually add data to the end, this allows the parser to work, even if trying to load newer versions.
        // Of course, the new version size needs to be added to IndexEntry.tagMapping, when finding one.
        this.entries[i] = new constructor(reader.substream(entrySize), version, index);

        reader.skip(entrySize);
      }
      // This is maybe a typed array?
    } else if (tag === 'CHAR' || tag === 'SCHR') {
      this.entries = reader.readCharArray(entriesCount);
    } else if (tag === 'U8__') {
      this.entries = reader.readUint8Array(entriesCount);
    } else if (tag === 'U16_') {
      this.entries = reader.readUint16Array(entriesCount);
    } else if (tag === 'U32_') {
      this.entries = reader.readUint32Array(entriesCount);
    } else if (tag === 'I16_') {
      this.entries = reader.readInt16Array(entriesCount);
    } else if (tag === 'I32_') {
      this.entries = reader.readInt32Array(entriesCount);
    } else if (tag === 'REAL') {
      this.entries = reader.readFloat32Array(entriesCount);
    } else if (tag === 'VEC2') {
      this.entries = [];

      for (let i = 0; i < entriesCount; i++) {
        this.entries[i] = reader.readFloat32Array(2);
      }
    } else if (tag === 'VEC3' || tag === 'SVC3') {
      this.entries = [];

      for (let i = 0; i < entriesCount; i++) {
        this.entries[i] = reader.readFloat32Array(3);
      }
    } else if (tag === 'VEC4' || tag === 'QUAT') {
      this.entries = [];

      for (let i = 0; i < entriesCount; i++) {
        this.entries[i] = reader.readFloat32Array(4);
      }
    } else if (tag === 'IREF') {
      this.entries = [];

      for (let i = 0; i < entriesCount; i++) {
        this.entries[i] = reader.readFloat32Array(16);
      }
    } else {
      this.entries = [];

      throw new Error(': Unsupported object tag - tag ' + tag + ' and version ' + version);
    }

    reader.seek(readerOffset);
  }
}
