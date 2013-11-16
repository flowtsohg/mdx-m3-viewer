// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var url = {
  header: function (id) {
    return "http://www.hiveworkshop.com/forums/apps.php?p=textures&id=" + id;
  },
  
  mpqFile: function (fileName) {
    return "http://www.hiveworkshop.com/forums/apps.php?p=mpq_file&file=" + fileName;
  },
  
  customFile: function (fileName) {
    return "http://www.hiveworkshop.com/forums/" + fileName;
  }
};
  
