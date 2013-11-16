// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var replaceableIdToName = {
  1: "TeamColor/TeamColor00",
  2: "TeamGlow/TeamGlow00",
  11: "Cliff/Cliff0",
  31: "LordaeronTree/LordaeronSummerTree",
  32: "AshenvaleTree/AshenTree",
  33: "BarrensTree/BarrensTree",
  34: "NorthrendTree/NorthTree",
  35: "Mushroom/MushroomTree",
  36: "RuinsTree/RuinsTree",
  37: "OutlandMushroomTree/MushroomTree"
};

function Texture(fileName, replaceableId, customTextures, onload, onerror) {
  if (replaceableId !== 0) {
    fileName = "ReplaceableTextures/" + replaceableIdToName[replaceableId] + ".blp";
  }
  
  this.fileName = fileName.replace(/\\/g, "/");
  this.replaceableId = replaceableId;
  
  var custom = customTextures[fileName];
  
  if (custom && custom.included) {
    this.custom = true;
    this.glTexture = gl.newTexture(this.fileName, url.customFile(custom.url), false, false, onload, onerror);
  } else {
    this.glTexture = gl.newTexture(this.fileName, url.mpqFile(this.fileName), false, false, onload, onerror);
  }
}