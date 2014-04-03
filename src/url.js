// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var url = {
  header: function (id) {
    return "http://www.hiveworkshop.com/forums/apps.php?p=textures&id=" + id;
  },
  
  mpqFile: function (path) {
    return "http://www.hiveworkshop.com/forums/apps.php?p=mpq_file&file=" + path;
  },
  
  customTexture: function (id) {
    return "http://www.hiveworkshop.com/forums/apps.php?section=skins&p=model_file&id=" + id + "&file=skin.png";
  },
  
  customModel: function (id) {
    return "http://www.hiveworkshop.com/model_files/" + id + "/model.mdx";
  },
  
  customFile: function (path) {
    return "http://www.hiveworkshop.com/forums/" + path;
  }
};
  
