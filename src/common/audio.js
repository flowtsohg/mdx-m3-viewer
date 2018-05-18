let audioContext = new OfflineAudioContext(1, 1, 3000);
 
/**
 * A context-less decodeAudioData().
 * 
 * @param {ArrayBuffer} buffer 
 * @returns {Promise} 
 */
export function decodeAudioData(buffer) {
    return audioContext.decodeAudioData(buffer);
};
