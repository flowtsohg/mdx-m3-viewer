/**
 * @param {Uint8Array} buffer
 * @param {number} initval
 * @return {number}
 */
function hash(buffer, initval) {
  let o = 0;
  let len = buffer.length;
  let a = 0x9e3779b9;
  let b = 0x9e3779b9;
  let c = initval;

  while (len >= 12) {
    a += (buffer[o + 0] + (buffer[o + 1] << 8) + (buffer[o + 2] << 16) + (buffer[o + 3] << 24));
    b += (buffer[o + 4] + (buffer[o + 5] << 8) + (buffer[o + 6] << 16) + (buffer[o + 7] << 24));
    c += (buffer[o + 8] + (buffer[o + 9] << 8) + (buffer[o + 10] << 16) + (buffer[o + 11] << 24));

    a -= b; a -= c; a ^= (c >> 13);
    b -= c; b -= a; b ^= (a << 8);
    c -= a; c -= b; c ^= (b >> 13);
    a -= b; a -= c; a ^= (c >> 12);
    b -= c; b -= a; b ^= (a << 16);
    c -= a; c -= b; c ^= (b >> 5);
    a -= b; a -= c; a ^= (c >> 3);
    b -= c; b -= a; b ^= (a << 10);
    c -= a; c -= b; c ^= (b >> 15);

    o += 12;
    len -= 12;
  }

  c += buffer.length;

  if (len === 11) {
    c += (buffer[o + 10] << 24);
  } else if (len === 10) {
    c += (buffer[o + 9] << 16);
  } else if (len === 9) {
    c += (buffer[o + 8] << 8);
  } else if (len === 8) {
    b += (buffer[o + 7] << 24);
  } else if (len === 7) {
    b += (buffer[o + 6] << 16);
  } else if (len === 6) {
    b += (buffer[o + 5] << 8);
  } else if (len === 5) {
    b += buffer[o + 4];
  } else if (len === 4) {
    a += (buffer[o + 3] << 24);
  } else if (len === 3) {
    a += (buffer[o + 2] << 16);
  } else if (len === 2) {
    a += (buffer[o + 1] << 8);
  } else if (len === 1) {
    a += buffer[o + 0];
  }

  a -= b; a -= c; a ^= (c >> 13);
  b -= c; b -= a; b ^= (a << 8);
  c -= a; c -= b; c ^= (b >> 13);
  a -= b; a -= c; a ^= (c >> 12);
  b -= c; b -= a; b ^= (a << 16);
  c -= a; c -= b; c ^= (b >> 5);
  a -= b; a -= c; a ^= (c >> 3);
  b -= c; b -= a; b ^= (a << 10);
  c -= a; c -= b; c ^= (b >> 15);

  return c;
}

let buffer = new Uint8Array(0x400);

/**
 * A hash function used by Warcraft 3's Jass virtual machine.
 * See http://burtleburtle.net/bob/hash/doobs.html
 *
 * @param {string} key
 * @return {number}
 */
export default function sstrhash2(key) {
  let offset = 0;

  buffer.fill(0);

  for (let char of key) {
    let byte = char.charCodeAt(0);

    if (byte < 97 || byte > 122) {
      if (byte === 47) {
        // slash to backwards slash.
        buffer[offset] = 92;
      } else {
        buffer[offset] = byte;
      }
    } else {
      // lower case ascii to upper case.
      buffer[offset] = byte - 0x20;
    }

    offset += 1;
  }

  return hash(buffer, 0);
}
