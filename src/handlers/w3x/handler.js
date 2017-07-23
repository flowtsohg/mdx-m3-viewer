import { mix } from "../../common";
import FileHandler from "../../texturehandler";
import Mpq from "../mpq/handler";
import Mdx from "../mdx/handler";
import Geo from "../geo/handler";
import W3xMap from "./map";

const W3x = {
    initialize(env) {
        env.addHandler(Mpq);
        env.addHandler(Mdx);
        env.addHandler(Geo);

        return true;
    },

    get extensions() {
        return [
            [".w3x", true],
            [".w3m", true]
        ];
    },

    get Constructor() {
        return W3xMap;
    }
};

mix(W3x, FileHandler);

export default W3x;
