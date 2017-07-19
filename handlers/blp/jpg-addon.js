import JpegImage from "../../external/jpg";

// This is the same as JpegImage.prototype.getData, but it doesn't transform the data to 3 components.
// It is needed for the BLP format, which stores a non-standard 4 component RGBA pixel format in a JPEG image.
JpegImage.prototype.getDataNoTransform = function (imageData, width, height) {
    var scaleX = this.width / width, scaleY = this.height / height;

    var component, componentScaleX, componentScaleY;
    var x, y, i;
    var offset = 0;
    var Y, Cb, Cr, K, C, M, Ye, R, G, B;
    var colorTransform;
    var numComponents = this.components.length;
    var dataLength = width * height * numComponents;
    //var data = new Uint8Array(dataLength);
    var data = imageData.data;
    var componentLine;

    // lineData is reused for all components. Assume first component is
    // the biggest
    var lineData = new Uint8Array((this.components[0].blocksPerLine << 3) * this.components[0].blocksPerColumn * 8);

    // First construct image data ...
    for (i = 0; i < numComponents; i++) {
        component = this.components[i];
        var blocksPerLine = component.blocksPerLine;
        var blocksPerColumn = component.blocksPerColumn;
        var samplesPerLine = blocksPerLine << 3;

        var j, k, ll = 0;
        var lineOffset = 0;
        for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
            var scanLine = blockRow << 3;
            for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
                // getBlockBufferOffset isn't exposed to the prototype, so inline it.
                //var bufferOffset = getBlockBufferOffset(component, blockRow, blockCol);
                var bufferOffset = 64 * ((component.blocksPerLine + 1) * blockRow + blockCol);
                var offset = 0, sample = blockCol << 3;
                for (j = 0; j < 8; j++) {
                    var lineOffset = (scanLine + j) * samplesPerLine;
                    for (k = 0; k < 8; k++) {
                        lineData[lineOffset + sample + k] =
                          component.output[bufferOffset + offset++];
                    }
                }
            }
        }

        componentScaleX = component.scaleX * scaleX;
        componentScaleY = component.scaleY * scaleY;
        offset = i;

        var cx, cy;
        var index;
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                cy = 0 | (y * componentScaleY);
                cx = 0 | (x * componentScaleX);
                index = cy * samplesPerLine + cx;
                data[offset] = lineData[index];
                offset += numComponents;
            }
        }
    }

    return data;
};

export default JpegImage;
