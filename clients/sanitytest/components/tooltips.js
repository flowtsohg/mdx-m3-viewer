export default function getTooltip(message) {
  if (message.includes('does not match the number of sequences')) { // Number of sequence extents (9) does not match the number of sequences (3)
    return `Having the wrong amount of geoset extents can in some cases crash War 3 Model Editor (Magos).

This does not affect the game.`;
  } else if (message.includes('has exactly the same value as tracks')) { // Track 3 at frame 1096 has exactly the same value as tracks 2 and 4
    return 'A keyframe with the same value as the two keyframes sorrounding it is useless.';
  } else if (message.includes('has roughly the same value as tracks')) { // Track 3 at frame 1096 has roughly the same value as tracks 2 and 4
    return 'A keyframe with roughly the same value as the two keyframes sorrounding it is many times useless.';
  } else if (message.includes('Missing opening track for sequence')) { // Missing opening track for sequence "Death" at frame 21000 where it is needed
    return `When missing the opening keyframe for an animation, the game will wrap the animation and interpolate between the last and first keyframes.

However there is a bug in the game which causes the animation values to reverse.

To fix it, add a keyframe at the beginning of the animation.
`;
  } else if (message.includes('has the same frame')) { // Track 7 has the same frame 1267 as track 6
    return 'Remove one of the keyframes.'
  } else if (message === 'Missing the Origin attachment point') { // Missing the Origin attachment point
    return `Missing the Origin attachment stops many in-game effects from attaching to models.

Not relevant to portraits and special effects.`;
  } else if (message.includes('is not in global sequence')) { // Track 17 at frame 4577 is not in global sequence 2
    return `This keyframe uses a global sequence, but its frame is outside of the global sequence's range.`;
  } else if (message === 'Missing "Stand" sequence') { // Missing "Stand" sequence
    return `Missing the stand animation can cause issues for models that are used as units.

Not relevant to portraits.`;
  } else if (message === 'Missing "Death" sequence') { // Missing "Death" sequence
    return `Missing the death animation makes particles and other effects linger for a short time after an object using this model dies.
    
Not relevant to portraits.`;
  } else if (message.endsWith('is not in any sequence')) {
    return 'A keyframe that is not in any animation is useless.';
  } else if (message.includes('is lower than the track before it at')) {
    return 'A keyframe is not supposed to have a frame before the previous keyframe.';
  } else {
    console.log('getTooltip', message)
  }

  return '';
}
