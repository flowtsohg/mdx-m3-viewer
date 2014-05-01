function BinaryReader(buffer) {
  this.buffer = buffer;
  this.index = 0;
  this.dataview = new DataView(this.buffer);
  this.uint8Array = new Uint8Array(this.buffer);
  this.size = buffer.byteLength;
}

function remaining(reader) {
  return reader.size - reader.index;
}

function skip(reader, bytes) {
  reader.index += bytes;
}

function seek(reader, index) {
  reader.index = index;
}

function tell(reader) {
  return reader.index;
}

function bytesToString(bytes) {
  return String.fromCharCode.apply(null, bytes).replace(/\0/g, "");
}

function read(reader, size) {
  var data = bytesToString(reader.uint8Array.subarray(reader.index, reader.index + size));
  
  reader.index += size;
  
  return data;
}

function peek(reader, size) {
  return  bytesToString(reader.uint8Array.subarray(reader.index, reader.index + size));
}
    
function readInt8(reader) {
  var data = reader.dataview.getInt8(reader.index, true);
  
  reader.index += 1;
  
  return data;
}

function readInt16(reader) {
  var data = reader.dataview.getInt16(reader.index, true);
  
  reader.index += 2;
  
  return data;
}

function readInt32(reader) {
  var data = reader.dataview.getInt32(reader.index, true);
  
  reader.index += 4;
  
  return data;
}

function readUint8(reader) {
  var data = reader.dataview.getUint8(reader.index, true);
  
  reader.index += 1;
  
  return data;
}

function readUint16(reader) {
  var data = reader.dataview.getUint16(reader.index, true);
  
  reader.index += 2;
  
  return data;
}

function readUint32(reader) {
  var data = reader.dataview.getUint32(reader.index, true);
  
  reader.index += 4;
  
  return data;
}

function readFloat32(reader) {
  var data = reader.dataview.getFloat32(reader.index, true);
  
  reader.index += 4;
  
  return data;
}

function readFloat64(reader) {
  var data = reader.dataview.getFloat64(reader.index, true);
  
  reader.index += 8;
  
  return data;
}

function readInt8Array(reader, count) {
  var i, data = new Int8Array(count);
  
  for (i = 0; i < count; i++) {
    data[i] = reader.dataview.getInt8(reader.index + i, true);
  }
  
  reader.index += data.byteLength;
  
  return data;
}

function readInt16Array(reader, count) {
  var i, data = new Int16Array(count);
  
  for (i = 0; i < count; i++) {
    data[i] = reader.dataview.getInt16(reader.index + 2 * i, true);
  }
  
  reader.index += data.byteLength;
  
  return data;
}

function readInt32Array(reader, count) {
  var i, data = new Int32Array(count);
  
  for (i = 0; i < count; i++) {
    data[i] = reader.dataview.getInt32(reader.index + 4 * i, true);
  }
  
  reader.index += data.byteLength;
  
  return data;
}

function readUint8Array(reader, count) {
  var i, data = new Uint8Array(count);
  
  for (i = 0; i < count; i++) {
    data[i] = reader.dataview.getUint8(reader.index + i, true);
  }
  
  reader.index += data.byteLength;
  
  return data;
}

function readUint16Array(reader, count) {
  var i, data = new Uint16Array(count);
  
  for (i = 0; i < count; i++) {
    data[i] = reader.dataview.getUint16(reader.index + 2 * i, true);
  }
  
  reader.index += data.byteLength;
  
  return data;
}

function readUint32Array(reader, count) {
  var i, data = new Uint32Array(count);
  
  for (i = 0; i < count; i++) {
    data[i] = reader.dataview.getUint32(reader.index + 4 * i, true);
  }
  
  reader.index += data.byteLength;
  
  return data;
}

function readFloat32Array(reader, count) {
  var i, data = new Float32Array(count);
  
  for (i = 0; i < count; i++) {
    data[i] = reader.dataview.getFloat32(reader.index + 4 * i, true);
  }
  
  reader.index += data.byteLength;
  
  return data;
}

function readFloat64Array(reader, count) {
  var i, data = new Float64Array(count);
  
  for (i = 0; i < count; i++) {
    data[i] = reader.dataview.getFloat64(reader.index + 8 * i, true);
  }
  
  reader.index += data.byteLength;
  
  return data;
}

function readInt8Matrix(reader, count, size) {
  var i, data = [];
  
  for (i = 0; i < count; i++) {
    data[i] = readInt8Array(reader, size);
  }
  
  return data;
}

function readInt16Matrix(reader, count, size) {
  var i, data = [];
  
  for (i = 0; i < count; i++) {
    data[i] = readInt16Array(reader, size);
  }
  
  return data;
}

function readInt32Matrix(reader, count, size) {
  var i, data = [];
  
  for (i = 0; i < count; i++) {
    data[i] = readInt32Array(reader, size);
  }
  
  return data;
}

function readUint8Matrix(reader, count, size) {
  var i, data = [];
  
  for (i = 0; i < count; i++) {
    data[i] = readUint8Array(reader, size);
  }
  
  return data;
}

function readUint16Matrix(reader, count, size) {
  var i, data = [];
  
  for (i = 0; i < count; i++) {
    data[i] = readUint16Array(reader, size);
  }
  
  return data;
}

function readUint32Matrix(reader, count, size) {
  var i, data = [];
  
  for (i = 0; i < count; i++) {
    data[i] = readUint32Array(reader, size);
  }
  
  return data;
}

function readFloat32Matrix(reader, count, size) {
  var i, data = [];
  
  for (i = 0; i < count; i++) {
    data[i] = readFloat32Array(reader, size);
  }
  
  return data;
}

function readFloat64Matrix(reader, count, size) {
  var i, data = [];
  
  for (i = 0; i < count; i++) {
    data[i] = readFloat64Array(reader, size);
  }
  
  return data;
}

function readVector2(reader) {
  return readFloat32Array(reader, 2);
}
  
function readVector3(reader) {
  return readFloat32Array(reader, 3);
}

function readVector4(reader) {
  return readFloat32Array(reader, 4);
}

function readMatrix(reader) {
  return readFloat32Array(reader, 16);
}