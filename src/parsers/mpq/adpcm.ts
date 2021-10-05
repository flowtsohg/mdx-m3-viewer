import BinaryStream from '../../common/binarystream';

const MAX_ADPCM_CHANNEL_COUNT = 2;
const INITIAL_ADPCM_STEP_INDEX = 0x2C;

const NextStepTable = new Int32Array([
  -1, 0, -1, 4, -1, 2, -1, 6,
  -1, 1, -1, 5, -1, 3, -1, 7,
  -1, 1, -1, 5, -1, 3, -1, 7,
  -1, 2, -1, 4, -1, 6, -1, 8,
]);

const StepSizeTable = new Int32Array([
  7, 8, 9, 10, 11, 12, 13, 14,
  16, 17, 19, 21, 23, 25, 28, 31,
  34, 37, 41, 45, 50, 55, 60, 66,
  73, 80, 88, 97, 107, 118, 130, 143,
  157, 173, 190, 209, 230, 253, 279, 307,
  337, 371, 408, 449, 494, 544, 598, 658,
  724, 796, 876, 963, 1060, 1166, 1282, 1411,
  1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024,
  3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484,
  7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
  15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794,
  32767,
]);

function GetNextStepIndex(StepIndex: number, EncodedSample: number): number {
  StepIndex = StepIndex + NextStepTable[EncodedSample & 0x1F];

  if (StepIndex < 0) {
    StepIndex = 0;
  } else if (StepIndex > 88) {
    StepIndex = 88;
  }

  return StepIndex;
}

function UpdatePredictedSample(PredictedSample: number, EncodedSample: number, Difference: number): number {
  if (EncodedSample & 0x40) {
    PredictedSample -= Difference;

    if (PredictedSample <= -32768) {
      PredictedSample = -32768;
    }
  } else {
    PredictedSample += Difference;

    if (PredictedSample >= 32767) {
      PredictedSample = 32767;
    }
  }

  return PredictedSample;
}

function DecodeSample(PredictedSample: number, EncodedSample: number, StepSize: number, Difference: number): number {
  if (EncodedSample & 0x01) {
    Difference += (StepSize >> 0);
  }

  if (EncodedSample & 0x02) {
    Difference += (StepSize >> 1);
  }

  if (EncodedSample & 0x04) {
    Difference += (StepSize >> 2);
  }

  if (EncodedSample & 0x08) {
    Difference += (StepSize >> 3);
  }

  if (EncodedSample & 0x10) {
    Difference += (StepSize >> 4);
  }

  if (EncodedSample & 0x20) {
    Difference += (StepSize >> 5);
  }

  return UpdatePredictedSample(PredictedSample, EncodedSample, Difference);
}

export default function DecompressADPCM(pvInBuffer: Uint8Array, ChannelCount: number): Uint8Array {
  const is = new BinaryStream(pvInBuffer);
  const os = <number[]>[];
  let EncodedSample;
  const PredictedSamples = new Uint16Array(MAX_ADPCM_CHANNEL_COUNT);
  const StepIndexes = new Uint16Array([INITIAL_ADPCM_STEP_INDEX, INITIAL_ADPCM_STEP_INDEX]);
  let ChannelIndex;

  is.readUint8();
  const BitShift = is.readUint8();

  for (let i = 0; i < ChannelCount; i++) {
    const InitialSample = is.readUint16();

    PredictedSamples[i] = InitialSample;

    os.push(InitialSample);
  }

  ChannelIndex = ChannelCount - 1;

  while (is.remaining) {
    EncodedSample = is.readUint8();

    ChannelIndex = (ChannelIndex + 1) % ChannelCount;

    if (EncodedSample == 0x80) {
      if (StepIndexes[ChannelIndex] != 0) {
        StepIndexes[ChannelIndex]--;
      }

      os.push(PredictedSamples[ChannelIndex]);
    } else if (EncodedSample == 0x81) {
      StepIndexes[ChannelIndex] += 8;

      if (StepIndexes[ChannelIndex] > 0x58) {
        StepIndexes[ChannelIndex] = 0x58;
      }

      ChannelIndex = (ChannelIndex + 1) % ChannelCount;
    } else {
      const StepIndex = StepIndexes[ChannelIndex];
      const StepSize = StepSizeTable[StepIndex];

      PredictedSamples[ChannelIndex] = DecodeSample(PredictedSamples[ChannelIndex], EncodedSample, StepSize, StepSize >> BitShift);

      os.push(PredictedSamples[ChannelIndex]);

      StepIndexes[ChannelIndex] = GetNextStepIndex(StepIndex, EncodedSample);
    }
  }

  return new Uint8Array(new Uint16Array(os).buffer);
}
