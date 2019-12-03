let audioContext;

// Some browsers don't have OfflineAudioContext or AudioContext.
if (typeof OfflineAudioContext === 'function') {
  audioContext = new OfflineAudioContext(1, 1, 48000);
}

/**
 * A context-less decodeAudioData().
 *
 * @param {ArrayBuffer} buffer
 * @return {?Promise}
 */
export function decodeAudioData(buffer) {
  if (audioContext) {
    return audioContext.decodeAudioData(buffer);
  }
}
