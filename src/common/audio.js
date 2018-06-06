let audioContext = new OfflineAudioContext(1, 1, 48000);

/**
 * A context-less decodeAudioData().
 *
 * @param {ArrayBuffer} buffer
 * @return {Promise}
 */
export function decodeAudioData(buffer) {
  return audioContext.decodeAudioData(buffer);
}
