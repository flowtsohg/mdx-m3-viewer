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

function Texture(texture, textureMap) {
  var path = texture.path;
  var replaceableId = texture.replaceableId;
  
  if (replaceableId !== 0) {
    path = "ReplaceableTextures/" + replaceableIdToName[replaceableId] + ".blp";
  }
  
  path = path.replace(/\\/g, "/").toLowerCase();
  
  // The original source
  this.source = path;
  
  if (textureMap[path]) {
    path = textureMap[path];
  } else {
    path = urls.mpqFile(path);
  }
  
  // This can be the original source, or a source overrided by the texture map
  this.path = path;
  
  this.glTexture = gl.newTexture(this.source, path);
}

Texture.prototype = {
  overrideTexture: function (path) {
    this.path = path;
    this.glTexture = gl.newTexture(this.source, path);
  }
};