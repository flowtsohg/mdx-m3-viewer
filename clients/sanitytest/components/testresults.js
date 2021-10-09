import { imageDataToImage } from "../../../src/common/canvas";
import Component from "../../shared/component";
import { createElement } from "../../shared/domutils";
import getTooltip from "./tooltips";
import MdlxModel from '../../../src/parsers/mdlx/model';
import { BlpImage, CONTENT_JPG } from '../../../src/parsers/blp/image';
import { DdsImage, FOURCC_ATI2, FOURCC_DXT1, FOURCC_DXT3, FOURCC_DXT5 } from '../../../src/parsers/dds/image';
import TgaImage from '../../../src/parsers/tga/image';
import mdlxSanityTest from '../../../src/utils/mdlx/sanitytest/sanitytest';
import blpSanityTest from '../../../src/utils/blp/sanitytest';
import ddsSanityTest from '../../../src/utils/dds/sanitytest';

export default class TestResults extends Component {
  constructor(parser) {
    super();

    this.nodes = [];

    const container = this.container;
    const isMdlx = parser instanceof MdlxModel;
    const isBlp = parser instanceof BlpImage;
    const isDds = parser instanceof DdsImage;
    const isTga = parser instanceof TgaImage;
    const isImage = isBlp || isDds || isTga;

    if (isBlp || isDds || isTga) {
      createElement({ textContent: `Width: ${parser.width}`, container });
      createElement({ textContent: `Height: ${parser.height}`, container });

      if (isBlp) {
        if (parser.content === CONTENT_JPG) {
          createElement({ textContent: `Content: JPG`, container });
        } else {
          createElement({ textContent: `Content: Palette`, container });
        }

        if (parser.alphaBits > 8) {
          createElement({ textContent: `Alpha bits: ${parser.alphaBits} (fake)`, container });
        } else {
          createElement({ textContent: `Alpha bits: ${parser.alphaBits}`, container });
        }

        createElement({ textContent: `Mipmaps: ${parser.mipmaps()} (fake: ${parser.fakeMipmaps()})`, container });
      } else if (isDds) {
        if (parser.format === FOURCC_DXT1) {
          createElement({ textContent: `Content: BC1 (DXT1)`, container });
        } else if (parser.format === FOURCC_DXT3) {
          createElement({ textContent: `Content: BC2 (DXT3)`, container });
        } else if (parser.format === FOURCC_DXT5) {
          createElement({ textContent: `Content: BC3 (DXT5)`, container });
        } else if (parser.format === FOURCC_ATI2) {
          createElement({ textContent: `Content: BC5 (ATI2)`, container });
        } else {
          createElement({ textContent: `Content: Not supported`, container });
        }

        createElement({ textContent: `Mipmaps: ${parser.mipmaps()}`, container });
      }

      createElement({ tagName: 'hr', container });
    }

    let results;

    if (isMdlx) {
      results = mdlxSanityTest(parser);
    } else if (isBlp) {
      results = blpSanityTest(parser);
    } else if (isDds) {
      results = ddsSanityTest(parser);
    } else {
      results = {};
    }

    if (results.nodes && results.nodes.length) {
      for (let node of results.nodes) {
        this.nodes.push(new TestResultsNode(node, container));
      }
    } else {
      this.nodes.push(new TestResultsNode({ type: 'bold', message: 'Passed' }, container));
    }

    this.results = results;

    if (isImage) {
      createElement({ tagName: 'hr', container });

      if (isBlp || isDds) {
        for (let i = 0, l = parser.mipmaps(); i < l; i++) {
          try {
            let imageData;

            if (isBlp) {
              imageData = parser.getMipmap(i);
            } else {
              imageData = this.getDdsMipmap(parser, i);
            }

            this.addMipmap(imageData);
          } catch (e) {
            if (this.results.errors === undefined) {
              this.results.errors = 1;
            } else {
              this.results.errors += 1;
            }

            this.nodes.push(new TestResultsNode({ type: 'error', message: `Mipmap ${i}: ${e}` }, this.container));
          }
        }
      } else {
        this.addMipmap(parser.data);
      }
    }
  }

  getDdsMipmap(parser, i) {
    const mipmap = parser.getMipmap(i);

    if (parser.format === FOURCC_ATI2) {
      const imageData = new ImageData(mipmap.width, mipmap.height);
      const inData = mipmap.data;
      const outData = imageData.data;

      for (let i = 0, l = mipmap.width * mipmap.height; i < l; i++) {
        const offset2 = i * 2;
        const offset4 = i * 4;

        outData[offset4 + 0] = inData[offset2 + 0];
        outData[offset4 + 1] = inData[offset2 + 1];
        outData[offset4 + 2] = 0;
        outData[offset4 + 3] = 255;
      }

      return imageData;
    } else {
      return new ImageData(new Uint8ClampedArray(mipmap.data.buffer), mipmap.width, mipmap.height);
    }
  }

  addMipmap(imageData) {
    const image = imageDataToImage(imageData);

    image.className = 'padded';

    this.container.appendChild(image);
  }

  filter(unused, warnings, severe, errors) {
    for (let node of this.nodes) {
      node.filter(unused, warnings, severe, errors);
    }
  }
}

class TestResultsNode extends Component {
  constructor(node, parentElement) {
    super();

    let className = '';
    let textContent = '';
    let tooltip = '';

    if (node.type === 'node') {
      className = 'bold';
      textContent = node.name;
    } else {
      className = node.type;
      textContent = node.message;
      tooltip = getTooltip(textContent);

      if (tooltip.length) {
        className += ' pointer';
      }
    }

    const resultElement = createElement({ className, textContent, title: tooltip, container: this.container });

    if (tooltip.length) {
      createElement({ tagName: 'span', className: 'info_marker', textContent: 'tooltip', container: resultElement });
    }

    this.node = node;
    this.nodes = [];

    if (node.type === 'node') {
      if (node.nodes.length || node.uses === 0) {
        let container = createElement({ className: 'indent', container: this.container });

        if (node.uses === 0) {
          this.nodes.push(new TestResultsNode({ type: 'unused', message: 'Not used' }, container));
        }

        for (let child of node.nodes) {
          this.nodes.push(new TestResultsNode(child, container));
        }
      }
    }

    parentElement.appendChild(this.container);
  }

  filter(unused, warnings, severe, errors) {
    if (this.matchFilters(unused, warnings, severe, errors)) {
      if (this.node.type === 'node') {
        for (let child of this.nodes) {
          child.filter(unused, warnings, severe, errors);
        }
      }

      this.show();
    } else {
      this.hide();
    }
  }

  matchFilters(unused, warnings, severe, errors) {
    let node = this.node;

    if (node.type === 'node') {
      return ((node.unused || node.uses === 0) && !unused) || (node.warnings && !warnings) || (node.severe && !severe) || (node.errors && !errors);
    } else {
      let type = node.type;

      return (type === 'unused' && !unused) || (type === 'warning' && !warnings) || (type === 'severe' && !severe) || (type === 'error' && !errors) || type === 'bold';
    }
  }
}
