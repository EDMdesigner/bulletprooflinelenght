var fs = require("fs");
var splitLongLines = require("./../src/bulletproofLineLength.js");

var daString;

daString = fs.readFileSync(process.argv[2], "utf8");

var splitString = splitLongLines(daString, 1000);

// console.log(splitString);

fs.writeFileSync("splitted-" + process.argv[2], splitString);
