// See https://stackoverflow.com/a/52526549/2503048

var fs = require('fs');

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`);
    fs.rmdirSync(path);
  }
}

console.log("Cleaning build files...");

deleteFolderRecursive("./dist/cjs");
deleteFolderRecursive("./dist/esm");

console.log("Successfully cleaned the build files!");
