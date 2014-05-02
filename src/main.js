var dom = getDom();
var urlVariables = getUrlVariables();
var canvas = dom.canvas;

function onmessage(e) {
  var type = e.type;
  
  if (type === "loadstart") {
    onloadstart(e);
  } else if (type === "progress") {
   onprogress(e);
  } else if (type === "load") {
    onload(e);
  } else if (type === "error") {
    onerror(e);
  }
}

var urls = {
  header: function (id) {
    return "http://www.hiveworkshop.com/forums/apps.php?p=getres&thread=" + id;
  },
  
  mpqFile: function (path) {
    return "http://www.hiveworkshop.com/forums/apps.php?p=mpq_file&original=1&file=" + path;
  }
};

var viewer = ModelViewer(canvas, urls, onmessage, urlVariables["d"]);

if (viewer) {
  dom["menu"].style.display = "block";
  
  if (urlVariables["s"]) {
    viewer.loadScene(decodeURIComponent(urlVariables["s"]));
    
    // Update the options tab in case the scene came with non-default values
    updateOptions();
  }
  
  if (urlVariables["q"]) {
    viewer.loadResource(urlVariables["q"]);
  }
}