let audioContext: OfflineAudioContext;

// Some browsers don't have OfflineAudioContext or AudioContext.
if (typeof OfflineAudioContext === 'function') {
  audioContext = new OfflineAudioContext(1, 1, 48000);
}

/**
 * A context-less decodeAudioData().
 */
export function decodeAudioData(buffer: ArrayBuffer) {
  if (audioContext) {
    return audioContext.decodeAudioData(buffer);
  }
}
