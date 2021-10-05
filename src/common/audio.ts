let audioContext: OfflineAudioContext;

// Some browsers don't have OfflineAudioContext or AudioContext.
if (typeof OfflineAudioContext === 'function') {
  audioContext = new OfflineAudioContext(1, 1, 48000);
}

/**
 * A context-less decodeAudioData().
 */
export async function decodeAudioData(buffer: ArrayBuffer): Promise<AudioBuffer | undefined> {
  if (audioContext) {
    return audioContext.decodeAudioData(buffer);
  }

  return;
}
