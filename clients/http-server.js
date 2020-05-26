/*
 * An example express-based HTTP server that handles Warcraft 3 TFT/Reforged and Starcraft 2 resources.
 * It gives static access to the clients, so it can be used to run any of them as well.
 *
 * The file structure that the server expects is as follows:
 *
 *   ├── viewer
 *   │   ├── clients
 *   │   │   ├── map
 *   │   │   ├── tests
 *   │   │   ├── http-server.js <── YOU ARE HERE 🙋
 *   │   │   └── ...
 *   │   └── ...
 *   └── resources
 *       ├── warcraft
 *       │   ├── textures
 *       │   ├── units
 *       │   └── ...
 *       ├── reforged
 *       │   ├── textures
 *       │   ├── units
 *       │   ├── _hd.w3mod
 *       │   │   ├── textures
 *       │   │   ├── units
 *       │   │   └── ...
 *       │   └── ...
 *       ├── starcraft2
 *       │   └── assets
 *       │       ├── textures
 *       │       ├── units
 *       │       └── ...
 *       └── ...
 *
 * All of the resources should be unpacked, including the internal tileset MPQs used by Warcraft 3 TFT.
 *
 * To request Warcraft 3 TFT and Starcraft 2 resources, use the assets entry point, for example:
 *
 *   fetch('assets?path=Units/Human/Footman/Footman.mdx')
 *   fetch('assets?path=Assets/Units/Zerg/Baneling/Baneling.m3')
 *
 * To request Warcraft 3 Reforged resources, add the "reforged" and optionally the "hd" boolean parameters, for example:
 *
 *   fetch('assets?path=Units/Human/Footman/Footman.mdx&reforged=true')
 *   fetch('assets?path=Units/Human/Footman/Footman.mdx&reforged=true&hd=true')
 * 
 * Note that you can change the listening port and the base resources directory below.
 */
const PORT = 8080;
const RESOURCES_PATH = '../resources/';

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`${req.ip} ${req.url}`);

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(RESOURCES_PATH)); // Give access to any resources.
app.use(express.static('.')); // Give access to /clients

app.get('/assets', (req, res, next) => {
  let params = req.query;
  let relativePath = params.path;
  let searchPaths = [];
  let isReforged = params.reforged === 'true';
  let hasTileset = params.tileset !== undefined;
  let isStarcraft2 = relativePath.startsWith('assets/');
  let isTFT = !isReforged && !isStarcraft2;

  // Add search paths based on the parameters.
  if (isTFT) {
    if (hasTileset) {
      searchPaths.push(`warcraft/${params.tileset}.mpq/`);
    }

    searchPaths.push('warcraft/');
  } else if (isReforged) {
    if (params.hd === 'true') {
      if (hasTileset) {
        searchPaths.push(`reforged/_hd.w3mod/_tilesets/${params.tileset}.w3mod/`);
      }

      searchPaths.push('reforged/_hd.w3mod/');
    }

    if (hasTileset) {
      searchPaths.push(`reforged/_tilesets/${params.tileset}.w3mod/`);
    }

    searchPaths.push('reforged/');
  } else if (isStarcraft2) {
    searchPaths.push('starcraft2/');
  }

  // Search for the file.
  for (let searchPath of searchPaths) {
    let absolutePath = path.resolve(RESOURCES_PATH, searchPath, relativePath);

    if (fs.existsSync(absolutePath)) {
      res.sendFile(absolutePath);

      console.log(`\x1b[32m${req.url} \x1b[33mresolved to ${searchPath.slice(0, -1)}\x1b[0m`);

      return;
    }
  }

  // File not found.
  res.status(404);
  res.end();

  console.log(`\x1b[31m${req.url} was not found\x1b[0m`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
