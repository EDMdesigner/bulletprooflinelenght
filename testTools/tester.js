var fs = require("fs");
var path = require("path");

var splitLongLines = require("./../src/bulletproofLineLength.js");

var daString;

var pathToFile = path.join(__dirname, process.argv[2]);
var parsedPath = path.parse(pathToFile);

daString = fs.readFileSync(pathToFile, "utf8");

var splitString = splitLongLines(daString, 1000);

// console.log(splitString);

fs.writeFileSync(path.join(__dirname, "./results/", parsedPath.name + "-splitted" + parsedPath.ext), splitString);
