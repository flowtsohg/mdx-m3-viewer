import { UintAnimation, FloatAnimation, Vector3Animation, Vector4Animation } from './animations';

// A map from MDX animation tags to their equivalent MDL tokens, and the implementation objects.
export default {
  // Layer
  KMTF: ['TextureID', UintAnimation],
  KMTA: ['Alpha', FloatAnimation],
  KMTE: ['EmissiveGain', FloatAnimation],
  KFC3: ['FresnelColor', Vector3Animation],
  KFCA: ['FresnelOpacity', FloatAnimation],
  KFTC: ['FresnelTeamColor', FloatAnimation],
  // TextureAnimation
  KTAT: ['Translation', Vector3Animation],
  KTAR: ['Rotation', Vector4Animation],
  KTAS: ['Scaling', Vector3Animation],
  // GeosetAnimation
  KGAO: ['Alpha', FloatAnimation],
  KGAC: ['Color', Vector3Animation],
  // GenericObject
  KGTR: ['Translation', Vector3Animation],
  KGRT: ['Rotation', Vector4Animation],
  KGSC: ['Scaling', Vector3Animation],
  // Light
  KLAS: ['AttenuationStart', FloatAnimation],
  KLAE: ['AttenuationEnd', FloatAnimation],
  KLAC: ['Color', Vector3Animation],
  KLAI: ['Intensity', FloatAnimation],
  KLBI: ['AmbIntensity', FloatAnimation],
  KLBC: ['AmbColor', Vector3Animation],
  KLAV: ['Visibility', FloatAnimation],
  // Attachment
  KATV: ['Visibility', FloatAnimation],
  // ParticleEmitter
  KPEE: ['EmissionRate', FloatAnimation],
  KPEG: ['Gravity', FloatAnimation],
  KPLN: ['Longitude', FloatAnimation],
  KPLT: ['Latitude', FloatAnimation],
  KPEL: ['LifeSpan', FloatAnimation],
  KPES: ['InitVelocity', FloatAnimation],
  KPEV: ['Visibility', FloatAnimation],
  // ParticleEmitter2
  KP2S: ['Speed', FloatAnimation],
  KP2R: ['Variation', FloatAnimation],
  KP2L: ['Latitude', FloatAnimation],
  KP2G: ['Gravity', FloatAnimation],
  KP2E: ['EmissionRate', FloatAnimation],
  KP2N: ['Width', FloatAnimation],
  KP2W: ['Length', FloatAnimation],
  KP2V: ['Visibility', FloatAnimation],
  // ParticleEmitterCorn
  KPPA: ['Alpha', FloatAnimation],
  KPPC: ['Color', Vector3Animation],
  KPPE: ['EmissionRate', FloatAnimation],
  KPPL: ['LifeSpan', FloatAnimation],
  KPPS: ['Speed', FloatAnimation],
  KPPV: ['Visibility', FloatAnimation],
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
};
