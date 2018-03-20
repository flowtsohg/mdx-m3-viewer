import Mpq from '../mpq/handler';
import Mdx from '../mdx/handler';
import Geo from '../geo/handler';
import W3xMap from './map';

export default {
    initialize(env) {
        env.addHandler(Mpq);
        env.addHandler(Mdx);
        env.addHandler(Geo);

        return true;
    },

    extensions: [['.w3m', 'arrayBuffer'], ['.w3x', 'arrayBuffer']],
    constructor: W3xMap
};
