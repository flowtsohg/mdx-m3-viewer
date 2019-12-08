/**
 * Search for the MPQ header - MPQ\x1A.
 * The header can be on any 512 bytes boundry offset.
 */
export function searchHeader(typedArray: Uint8Array) {
  let offset = -1;

  for (let i = 0, l = Math.ceil(typedArray.byteLength / 512); i < l; i++) {
    let base = i * 512;

    // Test 'MPQ\x1A'.
    if (typedArray[base] === 77 && typedArray[base + 1] === 80 && typedArray[base + 2] === 81 && typedArray[base + 3] === 26) {
      offset = base;
    }
  }

  return offset;
}

/**
 * Checks whether the given buffer is either a Warcraft 3 map or otherwise a generic MPQ archive.
 */
export function isArchive(typedArray: Uint8Array) {
  // Check for the map identifier - HM3W
  if (typedArray[0] === 72 && typedArray[1] === 77 && typedArray[2] === 51 && typedArray[3] === 87) {
    return true;
  }

  // Look for an MPQ header.
  return searchHeader(typedArray) !== -1;
}
