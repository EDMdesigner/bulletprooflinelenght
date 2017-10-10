var splitHTMLLine = require("./splitHTMLLine");
var splitCSSLine = require("./splitCSSLine");

var bulletproofLineLengthCore = require("./bulletproofLineLengthCore");

module.exports = bulletproofLineLengthCore({
	splitHTMLLine: splitHTMLLine,
	splitCSSLine: splitCSSLine
});
