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
    let results;

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

    if (isMdlx) {
      results = mdlxSanityTest(parser);
    } else if (isBlp) {
      results = blpSanityTest(parser);
    } else if (isDds) {
      results = ddsSanityTest(parser);
    }

    const nodes = results.nodes;

    if (nodes.length) {
      for (let node of nodes) {
        this.nodes.push(new TestResultsNode(node, container));
      }
    } else {
      this.nodes.push(new TestResultsNode({ type: 'bold', message: 'Passed' }, container));
    }

    if (isBlp) {
      const mipmaps = this.getMipmaps(parser);

      for (let i = 0, l = mipmaps.length; i < l; i++) {
        let mipmap = mipmaps[i];

        if (mipmap instanceof ImageData) {
          let image = imageDataToImage(mipmap);

          image.className = 'padded';

          this.container.appendChild(image);
        } else {
          if (results.errors === undefined) {
            results.errors = 1;
          } else {
            results.errors += 1;
          }

          this.nodes.push(new TestResultsNode({ type: 'error', message: `Mipmap ${i}: ${mipmap}` }, container));
        }
      }
    }

    this.results = results;
  }

  getMipmaps(image) {
    let mipmaps = [];

    for (let i = 0, l = image.mipmaps(); i < l; i++) {
      try {
        mipmaps.push(image.getMipmap(i));
      } catch (e) {
        mipmaps.push(e);
      }
    }

    return mipmaps;
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
    }

    createElement({ className, textContent, title: tooltip, container: this.container });

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
