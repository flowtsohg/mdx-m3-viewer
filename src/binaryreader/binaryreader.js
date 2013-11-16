// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function BinaryReader(buffer) {
  this.buffer = buffer;
  this.index = 0;
  this.dataview = new DataView(this.buffer);
  this.size = buffer.byteLength;
}

var readerTypeToSize = {
  "Int8": 1,
  "Int16": 2,
  "Int32": 4,
  "Uint8": 1,
  "Uint16": 2,
  "Uint32": 4,
  "Float32": 4,
  "Float64": 8
};

function remaining(reader) {
  return reader.size - reader.index;
}

function skip(reader, bytes) {
  reader.index += bytes;
      
  if (reader.index < 0) {
    reader.index = 0;
  } else if (reader.index > reader.size) {
    reader.index = reader.size;
  }
}

function seek(reader, index) {
  reader.index = index;
}

function tell(reader) {
  return reader.index;
}

function read(reader, size) {
  var data = [];
  
  if (remaining(reader) < size) {
    size = remaining(reader);
  }
  
  for (var i = 0; i < size; i++) {
    data[i] = String.fromCharCode(String(reader.dataview.getUint8(reader.index + i)));
  }

  reader.index += size;

  return data.join("").replace(/\0/g, "");
}

function peek(reader, size) {
  var data = [];
  
  if (remaining(reader) < size) {
    size = remaining(reader);
  }
  
  for (var i = 0; i < size; i++) {
    data[i] = String.fromCharCode(String(reader.dataview.getUint8(reader.index + i)));
  }

  return data.join("").replace(/\0/g, "");
}

function readTypedNumber(reader, type) {
  var data = reader.dataview["get" + type](reader.index, true);
  
  reader.index += readerTypeToSize[type];
  
  return data;
}

function readTypedArray(reader, count, type) {
  var data = [];
  
  for (var i = 0; i < count; i++) {
    data[i] = readTypedNumber(reader, type);
  }
  
  return data;
}

function readTypedMatrix(reader, count, size, type) {
  var data = [];
  
  for (var i = 0; i < count; i++) {
    data[i] = readTypedArray(reader, size, type);
  }
  
  return data;
}
    
function readInt8(reader) {
  return readTypedNumber(reader, "Int8");
}

function readInt16(reader) {
  return readTypedNumber(reader, "Int16");
}

function readInt32(reader) {
  return readTypedNumber(reader, "Int32");
}

function readUint8(reader) {
  return readTypedNumber(reader, "Uint8");
}

function readUint16(reader) {
  return readTypedNumber(reader, "Uint16");
}

function readUint32(reader) {
  return readTypedNumber(reader, "Uint32");
}

function readFloat32(reader) {
  return readTypedNumber(reader, "Float32");
}

function readFloat64(reader) {
  return readTypedNumber(reader, "Float64");
}

function readInt8Array(reader, count) {
  return readTypedArray(reader, count, "Int8");
}

function readInt16Array(reader, count) {
  return readTypedArray(reader, count, "Int16");
}

function readInt32Array(reader, count) {
  return readTypedArray(reader, count, "Int32");
}

function readUint8Array(reader, count) {
  return readTypedArray(reader, count, "Uint8");
}

function readUint16Array(reader, count) {
  return readTypedArray(reader, count, "Uint16");
}

function readUint32Array(reader, count) {
  return readTypedArray(reader, count, "Uint32");
}

function readFloat32Array(reader, count) {
  return readTypedArray(reader, count, "Float32");
}

function readFloat64Array(reader, count) {
  return readTypedArray(reader, count, "Float64");
}

function readInt8Matrix(reader, count, size) {
  return readTypedMatrix(reader, count, size, "Int8");
}

function readInt16Matrix(reader, count, size) {
  return readTypedMatrix(reader, count, size, "Int16");
}

function readInt32Matrix(reader, count, size) {
  return readTypedMatrix(reader, count, size, "Int32");
}

function readUint8Matrix(reader, count, size) {
  return readTypedMatrix(reader, count, size, "Uint8");
}

function readUint16Matrix(reader, count, size) {
  return readTypedMatrix(reader, count, size, "Uint16");
}

function readUint32Matrix(reader, count, size) {
  return readTypedMatrix(reader, count, size, "Uint32");
}

function readFloat32Matrix(reader, count, size) {
  return readTypedMatrix(reader, count, size, "Float32");
}

function readFloat64Matrix(reader, count, size) {
  return readTypedMatrix(reader, count, size, "Float64");
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