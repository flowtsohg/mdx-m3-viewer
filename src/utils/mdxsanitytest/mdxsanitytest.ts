import Model from '../../parsers/mdlx/model';
import SanityTestData from './data';
import { testObjects, cleanNode } from './utils';
import { testHeader, testSequences, testGlobalSequence, testTextures, testMaterials, testGeoset, testGeosetAnimation, testBone, testLight, testAttachment, testPivotPoints, testParticleEmitter, testParticleEmitter2, testParticleEmitterPopcorn, testRibbonEmitter, testEventObject, testCamera, testFaceEffect, testBindPose } from './testers';

/**
 * Run a sanity test on the model and return the results.
 */
export default function sanityTest(model: Model) {
  let data = new SanityTestData(model);

  // Run the tests.
  testHeader(data);
  testSequences(data);
  testObjects(data, model.globalSequences, testGlobalSequence);
  testTextures(data);
  testMaterials(data);
  testObjects(data, model.textureAnimations);
  testObjects(data, model.geosets, testGeoset)
  testObjects(data, model.geosetAnimations, testGeosetAnimation);
  testObjects(data, model.bones, testBone);
  testObjects(data, model.lights, testLight);
  testObjects(data, model.helpers);
  testObjects(data, model.attachments, testAttachment);
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
    testFaceEffect(data);
    testBindPose(data);
  }

  let root = data.stack[0];

  // Remove nodes that passed the test.
  cleanNode(root)

  let { nodes, errors, severe, warnings, unused } = root;

  // Add top-level objects that are not used.
  for (let node of nodes) {
    if (node.type === 'node') {
      if (node.uses === 0) {
        unused += 1;
      }
    }
  }

  return { nodes, errors, severe, warnings, unused };
}
