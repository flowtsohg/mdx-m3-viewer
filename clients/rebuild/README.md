This is a small proof of concept of rebuilding a "protected" map.
This is done by running the map's Jass script with a virtual machine, and keeping track of created objects (e.g. units and doodads).
The objects are then re-created in their "un-protected" files, e.g. `war3mapUnits.doo`.
Note that this is, indeed, merely a proof of concept, not a complete implementation.
