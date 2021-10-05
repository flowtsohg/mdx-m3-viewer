import Model from '../../../parsers/mdlx/model';
import SanityTestData, { SanityTestMessage, SanityTestNode } from './data';
import { testObjects, cleanNode } from './utils';
import { testHeader, testSequences, testGlobalSequence, testTextures, testMaterial, testGeoset, testGeosetAnimation, testBone, testLight, testAttachments, testPivotPoints, testParticleEmitter, testParticleEmitter2, testParticleEmitterPopcorn, testRibbonEmitter, testEventObject, testCamera, testFaceEffect, testBindPose } from './testers';

export interface SanityTestResult {
  type: string;
  nodes: (SanityTestNode | SanityTestMessage)[];
  errors: number;
  severe: number;
  warnings: number;
  unused: number;
}

/**
 * Run a sanity test on the model and return the results.
 */
export default function sanityTest(model: Model): SanityTestResult {
  const data = new SanityTestData(model);

  // Run the tests.
  testHeader(data);
  testSequences(data);
  testObjects(data, model.globalSequences, testGlobalSequence);
  testTextures(data);
  testObjects(data, model.materials, testMaterial);
  testObjects(data, model.textureAnimations);
  testObjects(data, model.geosets, testGeoset);
  testObjects(data, model.geosetAnimations, testGeosetAnimation);
  testObjects(data, model.bones, testBone);
  testObjects(data, model.lights, testLight);
  testObjects(data, model.helpers);
  testAttachments(data);
  testPivotPoints(data);
  testObjects(data, model.particleEmitters, testParticleEmitter);
  testObjects(data, model.particleEmitters2, testParticleEmitter2);

  if (model.version > 800) {
    testObjects(data, model.particleEmittersPopcorn, testParticleEmitterPopcorn);
  }

  testObjects(data, model.ribbonEmitters, testRibbonEmitter);
  testObjects(data, model.eventObjects, testEventObject);
  testObjects(data, model.cameras, testCamera);
  testObjects(data, model.collisionShapes);

  if (model.version > 800) {
    testObjects(data, model.faceEffects, testFaceEffect);
    testBindPose(data);
  }

  const root = data.stack[0];

  // Remove nodes that passed the test.
  cleanNode(root);

  const { nodes, errors, severe, warnings } = root;
  let { unused } = root;

  // Add top-level objects that are not used.
  for (const node of nodes) {
    if (node.type === 'node') {
      if (node.uses === 0) {
        unused += 1;
      }
    }
  }

  return { type: 'node', nodes, errors, severe, warnings, unused };
}
