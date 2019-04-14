import {UintAnimation, FloatAnimation, Vector3Animation, Vector4Animation} from './animations';

// A map from MDX animation tags to their equivalent MDL tokens, and the implementation objects.
export default {
  // Layer
  KMTF: ['TextureId', UintAnimation],
  KMTA: ['Alpha', FloatAnimation],
  // TextureAnimation
  KTAT: ['Translation', Vector3Animation],
  KTAR: ['Rotation', Vector4Animation],
  KTAS: ['Scaling', Vector3Animation],
  // GeosetAnimation
  KGAO: ['Alpha', FloatAnimation],
  KGAC: ['Color', Vector3Animation],
  // Light
  KLAS: ['AttenuationStart', FloatAnimation],
  KLAE: ['AttenuationEnd', FloatAnimation],
  KLAC: ['Color', Vector3Animation],
  KLAI: ['Intensity', FloatAnimation],
  KLBI: ['AmbientIntensity', FloatAnimation],
  KLBC: ['AmbientColor', Vector3Animation],
  KLAV: ['Visibility', FloatAnimation],
  // Attachment
  KATV: ['Visibility', FloatAnimation],
  // ParticleEmitter
  KPEE: ['EmissionRate', FloatAnimation],
  KPEG: ['Gravity', FloatAnimation],
  KPLN: ['Longitude', FloatAnimation],
  KPLT: ['Latitude', FloatAnimation],
  KPEL: ['LifeSpan', FloatAnimation],
  KPES: ['Speed', FloatAnimation],
  KPEV: ['Visibility', FloatAnimation],
  // ParticleEmitter2
  KP2S: ['Speed', FloatAnimation],
  KP2R: ['Variation', FloatAnimation],
  KP2L: ['Latitude', FloatAnimation],
  KP2G: ['Gravity', FloatAnimation],
  KP2E: ['EmissionRate', FloatAnimation],
  KP2N: ['Length', FloatAnimation],
  KP2W: ['Width', FloatAnimation],
  KP2V: ['Visibility', FloatAnimation],
  // RibbonEmitter
  KRHA: ['HeightAbove', FloatAnimation],
  KRHB: ['HeightBelow', FloatAnimation],
  KRAL: ['Alpha', FloatAnimation],
  KRCO: ['Color', Vector3Animation],
  KRTX: ['TextureSlot', UintAnimation],
  KRVS: ['Visibility', FloatAnimation],
  // Camera
  KCTR: ['Translation', Vector3Animation],
  KTTR: ['Translation', Vector3Animation],
  KCRL: ['Rotation', UintAnimation],
  // GenericObject
  KGTR: ['Translation', Vector3Animation],
  KGRT: ['Rotation', Vector4Animation],
  KGSC: ['Scaling', Vector3Animation],
};
