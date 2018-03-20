import { vec3, quat } from 'gl-matrix';
import standSequence from './standsequence';

export default class W3xDoodad {
    /**
     * @param {W3xMap} map
     * @param {W3xParserDoodad} doodad
     */
    constructor(map, doodad) {
        this.map = map;

        let id = doodad.id;
        let variation = doodad.variation;

        this.location = doodad.location;
        this.angle = doodad.angle;
        this.scale = doodad.scale;

        var row = map.fileCache.get('doodads').getRow(id) || map.fileCache.get('destructabledata').getRow(id);
        if (row) {
            // What does it mean when texFile is underscore?
            if (row.texFile && row.texFile !== '_') {
                var texFile = row.texFile.replace('.tga', '.blp');

                if (!texFile.endsWith('.blp')) {
                    texFile += '.blp';
                }

                this.texFile = map.loadFile(texFile);
            }

            var path;
            var file = row.file;

            // Imported, keep the path but change the extension back to mdx
            if (file.endsWith('.mdl')) {
                path = file.replace('.mdl', '.mdx');
            // MPQ file, create the full path using the variation
            } else {
                // The SLK has two versions, one with 'dir' and 'file', the other just 'file', both behave differently
                if (row.dir) {
                    path = row.dir.replace(/\\/g, '/') + '/' + row.file + '/' + row.file;
                } else {
                    path = row.file.replace(/\\/g, '/');
                }

                if (row.numVar > 1) {
                    // Was there any reason for this random variation rather than using the one in this doodad? I don't remember, but it doesn't seem correct.
                    //path += Math.floor((row.numVar - 1) * Math.random());

                    path += variation;
                }

                path += '.mdx';
            }

            this.path = path;
        }

        if (this.path) {
            this.addInstance();
        } else {
            console.log('Unknown doodad/destructable ID', id)
        }
    }

    addInstance() {
        if (!this.model) {
            this.model = this.map.loadFile(this.path);
        }

        let instance = this.model.addInstance();

        this.map.scene.addInstance(instance);

        // This is used by trees and other doodads that share a model, but override the texture
        if (this.texFile) {
            //this.model.whenLoaded((model) => instance.setTexture(model.textures[0], this.texFile));
        }

        instance.setLocation(this.location);
        instance.setRotation(quat.setAxisAngle(quat.create(), vec3.UNIT_Z, this.angle));
        instance.setScale(this.scale);
        instance.whenLoaded(standSequence);

        this.instance = instance;
    }
};
