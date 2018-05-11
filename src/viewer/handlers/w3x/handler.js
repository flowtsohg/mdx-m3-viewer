import Mpq from '../mpq/handler';
import Mdx from '../mdx/handler';
import Geo from '../geo/handler';
import W3xMap from './map';

export default {
    load(viewer) {
        viewer.addHandler(Mpq);
        viewer.addHandler(Mdx);
        viewer.addHandler(Geo);

        return true;
    },

    extensions: [['.w3m', 'arrayBuffer'], ['.w3x', 'arrayBuffer']],
    constructor: W3xMap
};
