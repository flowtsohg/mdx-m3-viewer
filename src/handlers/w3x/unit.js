import { vec3, quat } from "gl-matrix";
import standSequence from "./standsequence";

/**
 * @constructor
 * @param {W3xMap} map
 * @param {W3xParserUnit} unit
 */
function W3xUnit(map, unit) {
    this.map = map;

    var id = unit.id;
    var variation = unit.variation;

    this.id = id;
    this.customId = "";
    this.variation = variation;
    this.location = unit.location;
    this.angle = unit.angle;
    this.scale = unit.scale;
    this.player = unit.player;

    
    var row = map.fileCache.get("unitdata").getRow(id) || map.fileCache.get("itemdata").getRow(id);
    if (row) {
        var path;

        // Items have a file field, units don't...
        if (row.file) {
            path = row.file.replace(".mdl", ".mdx");

            if (!path.endsWith(".mdx")) {
                path += ".mdx";
            }
        } else {
            this.location[2] += row.moveHeight;

            let uiRow;

            if (row.customRow) {
                uiRow = map.fileCache.get("unitui").getRow(row.ID);
            } else {
                uiRow = map.fileCache.get("unitui").getRow(id);
            }
            

            if (!uiRow) {
                console.log("Unknown unit ID", id);
                return;
            }

            path = uiRow.file + ".mdx";

            vec3.scale(this.scale, this.scale, uiRow.modelScale);
        }

        this.path = path;
    } else {
        if (id === "sloc") {
            this.path = "Objects/StartLocation/StartLocation.mdx";
        } 
    }

    if (this.path) {
        this.addInstance();
    } else {
        console.log("Unknown unit/item ID", id)
    }
}

W3xUnit.prototype = {
    addInstance() {
        if (!this.model) {
            this.model = this.map.loadFile(this.path);
        }

        let instance = this.model.addInstance();

        this.map.scene.addInstance(instance);

        instance.setLocation(this.location);
        instance.setRotation(quat.setAxisAngle(quat.create(), vec3.UNIT_Z, this.angle));
        instance.setScale(this.scale);
        instance.setTeamColor(this.player);

        // Select a random stand sequence when the instance is loaded
        instance.whenLoaded(standSequence);

        // And select a random stand sequence every time a sequence ends
        instance.addEventListener("seqend", standSequence);

        this.instance = instance;
    }
};

export default W3xUnit;
