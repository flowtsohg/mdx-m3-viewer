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

function Texture(texture) {
  var path = texture.path;
  var replaceableId = texture.replaceableId;
  
  if (replaceableId !== 0) {
    path = "ReplaceableTextures/" + replaceableIdToName[replaceableId] + ".blp";
  }
  
  path = path.replace(/\\/g, "/").toLowerCase();
  
  this.path = path;
  this.replaceableId = replaceableId;
  this.glTexture = gl.newTexture(path, urls.mpqFile(path));
}

Texture.prototype = {
  bind: function (unit, teamId) {
    var replaceableId = this.replaceableId;
    
    teamId = teamId || 0;
    
    if (replaceableId === 1 || replaceableId === 2) {
      var tc = teamColors[teamId];
      
      gl.setParameter("u_teamColor",  [tc[0] / 255, tc[1] / 255, tc[2] / 255]);
      
      if (replaceableId === 1) {
        gl.setParameter("u_teamMode", 1);
      } else {
        gl.setParameter("u_teamMode", 2);
        gl.bindTexture("TeamGlow", unit);
      }
    } else {
      gl.setParameter("u_teamMode", 0);
      gl.bindTexture(this.glTexture, unit);
    }
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