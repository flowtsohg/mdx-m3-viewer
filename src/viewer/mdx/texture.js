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

function Texture(path, replaceableId) {
  if (replaceableId !== 0) {
    path = "ReplaceableTextures/" + replaceableIdToName[replaceableId] + ".blp";
  }
  
  this.path = path.replace(/\\/g, "/").toLowerCase();
  this.replaceableId = replaceableId;
  this.glTexture = gl.newTexture(this.path, urls.mpqFile(this.path));
}

Texture.prototype = {
  bind: function (unit) {
    this.glTexture.bind(unit);
  },
  
  overrideTexture: function (source) {
    var path;
    
    this.path = source;
    
    // Parse the source as an absolute path, an MPQ path, or an ID
    if (source.startsWith("http://")) {
      path = source;
    } else if (source.match(/\.(?:mdx|m3|blp|dds)$/)) {
      path = urls.mpqFile(source);
    } else {
      path = urls.customTexture(source);
    }
    
    this.glTexture = gl.newTexture(path, path);
  }
};