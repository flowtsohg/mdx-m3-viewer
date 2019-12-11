const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = 8080;
const BASE_PATH = '../resources/';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('.')); // Give access to /clients

app.get('/assets', (req, res, next) => {
  let params = req.query;
  let relativePath = params.path;
  let searchPaths = [];
  let isReforged = params.reforged === 'true';
  let isStarcraft2 = relativePath.startsWith('assets/');
  let isTFT = !isReforged && !isStarcraft2;

  // Add search paths based on the parameters.
  if (isTFT) {
    if (params.tileset !== undefined) {
      searchPaths.push(`warcraft/${params.tileset}/`);
    }

    searchPaths.push('warcraft/');
  } else if (isReforged) {
    if (params.hd === 'true') {
      if (params.tileset !== undefined) {
        searchPaths.push(`reforged/_hd.w3mod/_tilesets/${params.tileset}.w3mod/`);
      }

      searchPaths.push('reforged/_hd.w3mod/');
    }

    if (params.tileset !== undefined) {
      searchPaths.push(`reforged/_tilesets/${params.tileset}.w3mod/`);
    }

    searchPaths.push('reforged/');
  } else if (isStarcraft2) {
    searchPaths.push('starcraft2/');
  }

  // Search for the file.
  for (let searchPath of searchPaths) {
    let absolutePath = path.resolve(BASE_PATH, searchPath, relativePath);

    if (fs.existsSync(absolutePath)) {
      res.sendFile(absolutePath);

      console.log(`\x1b[32mAsset resolved to \x1b[33m${searchPath.slice(0, -1)}\x1b[0m`, params);

      return;
    }
  }

  // File not found.
  res.status(404);
  res.end();

  console.log('\x1b[31mAsset not found\x1b[0m', params);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
