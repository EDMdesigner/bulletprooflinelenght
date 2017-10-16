(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bulletproofLineLength = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/bulletproofLineLength.js":[function(require,module,exports){
"use strict";

var splitHTMLLine = require("./splitHTMLLine");
var splitCSSLine = require("./splitCSSLine");

var bulletproofLineLengthCore = require("./bulletproofLineLengthCore");

module.exports = bulletproofLineLengthCore({
	splitHTMLLine: splitHTMLLine,
	splitCSSLine: splitCSSLine
});

},{"./bulletproofLineLengthCore":"/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/bulletproofLineLengthCore.js","./splitCSSLine":"/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/splitCSSLine.js","./splitHTMLLine":"/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/splitHTMLLine.js"}],"/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/bulletproofLineLengthCore.js":[function(require,module,exports){
"use strict";

module.exports = function (dependencies) {
	if (!dependencies.splitHTMLLine) {
		throw Error("dependencies.splitHTMLLine is mandatory!");
	}
	if (!dependencies.splitCSSLine) {
		throw Error("dependencies.splitCSSLine is mandatory!");
	}

	var splitHTMLLine = dependencies.splitHTMLLine;
	var splitCSSLine = dependencies.splitCSSLine;

	function splitLine(line, hardLimit) {
		if (line.length < hardLimit) {
			return line;
		}
		// console.log(line.length);
		if (/(<[^>]+>([^<]*)?)+/.test(line)) {
			// console.log("This is a html line");
			return splitHTMLLine(line, hardLimit);
		}
		if (/(([^\{])+\{[^\{\}]+\} *$)+/.test(line)) {
			// console.log("This is a css line");
			return splitCSSLine(line, hardLimit);
		}
		// console.log("This is an undefined format line");
		return line;
	}

	return function bulletproofLineLength(input, hardLimit) {
		if (!input || typeof input !== "string") {
			throw Error("No input was specified! Usage: bulletproofLineLength(inputString, maximalLineLength)");
		}
		if (!hardLimit || typeof hardLimit !== "number") {
			throw Error("No maximalLineLength was specified! Usage: bulletproofLineLength(inputString, maximalLineLength)");
		}
		var lines = input.split(/\r?\n/);
		for (var i = 0; i < lines.length; i += 1) {
			lines[i] = splitLine(lines[i], hardLimit);
		}
		return lines.join("\n");
	};
};

},{}],"/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/splitCSSLine.js":[function(require,module,exports){
"use strict";

module.exports = splitCSSLine;

function splitCSSLine(line, hardLimit) {
	var parts = [];
	var startIndex = 0;
	for (var i = 0; i < line.length; i += 1) {
		var ac = line[i];
		if (ac === ";" || ac === "," || ac === "}") {
			parts.push(line.substring(startIndex, i + 1));
			startIndex = i + 1;
		}
	}
	// do not forget to add the rest
	if (startIndex < line.length - 1) {
		parts.push(line.substr(startIndex));
	}
	var finalStrings = [parts[0]];
	for (var i = 1; i < parts.length; i += 1) {
		var lastIndex = finalStrings.length - 1;
		if (finalStrings[lastIndex].length + parts[i].length < hardLimit) {
			finalStrings[lastIndex] = finalStrings[lastIndex] + " " + parts[i];
		} else {
			finalStrings.push(parts[i].replace(/^\s/, ""));
		}
	}

	console.log("Da split string is: ");
	for (var i = 0; i < finalStrings.length; i += 1) {
		console.log(finalStrings[i].length);
		console.log(finalStrings[i]);
	}

	return finalStrings.join("\n");
}

},{}],"/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/splitHTMLLine.js":[function(require,module,exports){
"use strict";

module.exports = splitHTMLLine;

// split at all possibilities, than concat it as needed

function splitHTMLLine(line, hardLimit) {
	var parts = [];
	var inOpenTag = false;
	var inDoubleQuot = false;
	var inSingleQuot = false;
	var startIndex = 0;
	for (var i = 0; i < line.length; i += 1) {
		var ac = line[i];
		if (ac === " " && inOpenTag && !inDoubleQuot && !inSingleQuot) {
			parts.push(line.substring(startIndex, i));
			startIndex = i + 1;
		}
		if (ac === "<" && !inDoubleQuot && !inSingleQuot) {
			inOpenTag = true;
		}
		if (ac === ">" && !inDoubleQuot && !inSingleQuot) {
			inOpenTag = false;
		}
		if (ac === "\"" && !inSingleQuot && inOpenTag) {
			inDoubleQuot = !inDoubleQuot;
		}
		if (ac === "'" && !inDoubleQuot && inOpenTag) {
			inSingleQuot = !inSingleQuot;
		}
	}
	// do not forget to add the rest
	if (startIndex < line.length - 1) {
		parts.push(line.substr(startIndex));
	}
	var finalStrings = [parts[0]];
	for (var i = 1; i < parts.length; i += 1) {
		var lastIndex = finalStrings.length - 1;
		if (finalStrings[lastIndex].length + parts[i].length < hardLimit) {
			finalStrings[lastIndex] = finalStrings[lastIndex] + " " + parts[i];
		} else {
			finalStrings.push(parts[i]);
		}
	}
	/*
 console.log("Da split string is: ");
 for (var i = 0; i < finalStrings.length; i += 1) {
 	console.log(finalStrings[i].length);
 	console.log(finalStrings[i]);
 }
 //*/
	return finalStrings.join("\n");
}

},{}]},{},["/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/bulletproofLineLength.js"])("/home/smiska/workspace/EDMdesigner/bulletprooflinelength/src/bulletproofLineLength.js")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnVsbGV0cHJvb2ZMaW5lTGVuZ3RoLmpzIiwic3JjL2J1bGxldHByb29mTGluZUxlbmd0aENvcmUuanMiLCJzcmMvc3BsaXRDU1NMaW5lLmpzIiwic3JjL3NwbGl0SFRNTExpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBcEI7QUFDQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFuQjs7QUFFQSxJQUFJLDRCQUE0QixRQUFRLDZCQUFSLENBQWhDOztBQUdBLE9BQU8sT0FBUCxHQUFpQiwwQkFBMEI7QUFDMUMsZ0JBQWUsYUFEMkI7QUFFMUMsZUFBYztBQUY0QixDQUExQixDQUFqQjs7Ozs7QUNOQSxPQUFPLE9BQVAsR0FBaUIsVUFBUyxZQUFULEVBQXVCO0FBQ3ZDLEtBQUksQ0FBQyxhQUFhLGFBQWxCLEVBQWlDO0FBQ2hDLFFBQU0sTUFBTSwwQ0FBTixDQUFOO0FBQ0E7QUFDRCxLQUFJLENBQUMsYUFBYSxZQUFsQixFQUFnQztBQUMvQixRQUFNLE1BQU0seUNBQU4sQ0FBTjtBQUNBOztBQUVELEtBQUksZ0JBQWdCLGFBQWEsYUFBakM7QUFDQSxLQUFJLGVBQWUsYUFBYSxZQUFoQzs7QUFFQSxVQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsU0FBekIsRUFBb0M7QUFDbkMsTUFBRyxLQUFLLE1BQUwsR0FBYyxTQUFqQixFQUE0QjtBQUMzQixVQUFPLElBQVA7QUFDQTtBQUNEO0FBQ0EsTUFBSSxxQkFBcUIsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBSixFQUFxQztBQUNwQztBQUNBLFVBQU8sY0FBYyxJQUFkLEVBQW9CLFNBQXBCLENBQVA7QUFDQTtBQUNELE1BQUksNkJBQTZCLElBQTdCLENBQWtDLElBQWxDLENBQUosRUFBNkM7QUFDNUM7QUFDQSxVQUFPLGFBQWEsSUFBYixFQUFtQixTQUFuQixDQUFQ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QixHQUExQixHQUFnQyxNQUFNLENBQU4sQ0FBMUQ7QUFDQSxHQUZELE1BRU87QUFDTixnQkFBYSxJQUFiLENBQWtCLE1BQU0sQ0FBTixDQUFsQjtBQUNBO0FBQ0Q7QUFDRDs7Ozs7OztBQU9BLFFBQU8sYUFBYSxJQUFiLENBQWtCLElBQWxCLENBQVA7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgc3BsaXRIVE1MTGluZSA9IHJlcXVpcmUoXCIuL3NwbGl0SFRNTExpbmVcIik7XG52YXIgc3BsaXRDU1NMaW5lID0gcmVxdWlyZShcIi4vc3BsaXRDU1NMaW5lXCIpO1xuXG52YXIgYnVsbGV0cHJvb2ZMaW5lTGVuZ3RoQ29yZSA9IHJlcXVpcmUoXCIuL2J1bGxldHByb29mTGluZUxlbmd0aENvcmVcIik7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXRwcm9vZkxpbmVMZW5ndGhDb3JlKHtcblx0c3BsaXRIVE1MTGluZTogc3BsaXRIVE1MTGluZSxcblx0c3BsaXRDU1NMaW5lOiBzcGxpdENTU0xpbmVcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XG5cdGlmICghZGVwZW5kZW5jaWVzLnNwbGl0SFRNTExpbmUpIHtcblx0XHR0aHJvdyBFcnJvcihcImRlcGVuZGVuY2llcy5zcGxpdEhUTUxMaW5lIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblx0aWYgKCFkZXBlbmRlbmNpZXMuc3BsaXRDU1NMaW5lKSB7XG5cdFx0dGhyb3cgRXJyb3IoXCJkZXBlbmRlbmNpZXMuc3BsaXRDU1NMaW5lIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHR2YXIgc3BsaXRIVE1MTGluZSA9IGRlcGVuZGVuY2llcy5zcGxpdEhUTUxMaW5lO1xuXHR2YXIgc3BsaXRDU1NMaW5lID0gZGVwZW5kZW5jaWVzLnNwbGl0Q1NTTGluZTtcblxuXHRmdW5jdGlvbiBzcGxpdExpbmUobGluZSwgaGFyZExpbWl0KSB7XG5cdFx0aWYobGluZS5sZW5ndGggPCBoYXJkTGltaXQpIHtcblx0XHRcdHJldHVybiBsaW5lO1xuXHRcdH1cblx0XHQvLyBjb25zb2xlLmxvZyhsaW5lLmxlbmd0aCk7XG5cdFx0aWYgKC8oPFtePl0rPihbXjxdKik/KSsvLnRlc3QobGluZSkpIHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiVGhpcyBpcyBhIGh0bWwgbGluZVwiKTtcblx0XHRcdHJldHVybiBzcGxpdEhUTUxMaW5lKGxpbmUsIGhhcmRMaW1pdCk7XG5cdFx0fVxuXHRcdGlmICgvKChbXlxce10pK1xce1teXFx7XFx9XStcXH0gKiQpKy8udGVzdChsaW5lKSkge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJUaGlzIGlzIGEgY3NzIGxpbmVcIik7XG5cdFx0XHRyZXR1cm4gc3BsaXRDU1NMaW5lKGxpbmUsIGhhcmRMaW1pdCk7XG5cdFx0fVxuXHRcdC8vIGNvbnNvbGUubG9nKFwiVGhpcyBpcyBhbiB1bmRlZmluZWQgZm9ybWF0IGxpbmVcIik7XG5cdFx0cmV0dXJuIGxpbmU7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gYnVsbGV0cHJvb2ZMaW5lTGVuZ3RoKGlucHV0LCBoYXJkTGltaXQpIHtcblx0XHRpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dGhyb3cgRXJyb3IoXCJObyBpbnB1dCB3YXMgc3BlY2lmaWVkISBVc2FnZTogYnVsbGV0cHJvb2ZMaW5lTGVuZ3RoKGlucHV0U3RyaW5nLCBtYXhpbWFsTGluZUxlbmd0aClcIik7XG5cdFx0fVxuXHRcdGlmICghaGFyZExpbWl0IHx8IHR5cGVvZiBoYXJkTGltaXQgIT09IFwibnVtYmVyXCIpIHtcblx0XHRcdHRocm93IEVycm9yKFwiTm8gbWF4aW1hbExpbmVMZW5ndGggd2FzIHNwZWNpZmllZCEgVXNhZ2U6IGJ1bGxldHByb29mTGluZUxlbmd0aChpbnB1dFN0cmluZywgbWF4aW1hbExpbmVMZW5ndGgpXCIpO1xuXHRcdH1cblx0XHR2YXIgbGluZXMgPSBpbnB1dC5zcGxpdCgvXFxyP1xcbi8pO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGxpbmVzW2ldID0gc3BsaXRMaW5lKGxpbmVzW2ldLCBoYXJkTGltaXQpO1xuXHRcdH1cblx0XHRyZXR1cm4gbGluZXMuam9pbihcIlxcblwiKTtcblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHNwbGl0Q1NTTGluZTtcblxuZnVuY3Rpb24gc3BsaXRDU1NMaW5lKGxpbmUsIGhhcmRMaW1pdCkge1xuXHR2YXIgcGFydHMgPSBbXTtcblx0dmFyIHN0YXJ0SW5kZXggPSAwO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpbmUubGVuZ3RoOyBpICs9IDEpIHtcblx0XHR2YXIgYWMgPSBsaW5lW2ldO1xuXHRcdGlmIChhYyA9PT0gXCI7XCIgfHwgYWMgPT09IFwiLFwiIHx8IGFjID09PSBcIn1cIikge1xuXHRcdFx0cGFydHMucHVzaChsaW5lLnN1YnN0cmluZyhzdGFydEluZGV4LCBpICsgMSkpO1xuXHRcdFx0c3RhcnRJbmRleCA9IGkgKyAxO1xuXHRcdH1cblx0fVxuXHQvLyBkbyBub3QgZm9yZ2V0IHRvIGFkZCB0aGUgcmVzdFxuXHRpZiAoc3RhcnRJbmRleCA8IGxpbmUubGVuZ3RoIC0xICkge1xuXHRcdHBhcnRzLnB1c2gobGluZS5zdWJzdHIoc3RhcnRJbmRleCkpO1xuXHR9XG5cdHZhciBmaW5hbFN0cmluZ3MgPSBbcGFydHNbMF1dO1xuXHRmb3IgKHZhciBpID0gMTsgaSA8IHBhcnRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0dmFyIGxhc3RJbmRleCA9IGZpbmFsU3RyaW5ncy5sZW5ndGggLSAxO1xuXHRcdGlmIChmaW5hbFN0cmluZ3NbbGFzdEluZGV4XS5sZW5ndGggKyBwYXJ0c1tpXS5sZW5ndGggPCBoYXJkTGltaXQpIHtcblx0XHRcdGZpbmFsU3RyaW5nc1tsYXN0SW5kZXhdID0gZmluYWxTdHJpbmdzW2xhc3RJbmRleF0gKyBcIiBcIiArIHBhcnRzW2ldO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmaW5hbFN0cmluZ3MucHVzaChwYXJ0c1tpXS5yZXBsYWNlKC9eXFxzLywgXCJcIikpO1xuXHRcdH1cblx0fVxuXHRcblx0Y29uc29sZS5sb2coXCJEYSBzcGxpdCBzdHJpbmcgaXM6IFwiKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmaW5hbFN0cmluZ3MubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRjb25zb2xlLmxvZyhmaW5hbFN0cmluZ3NbaV0ubGVuZ3RoKTtcblx0XHRjb25zb2xlLmxvZyhmaW5hbFN0cmluZ3NbaV0pO1xuXHR9XG5cdFxuXHRyZXR1cm4gZmluYWxTdHJpbmdzLmpvaW4oXCJcXG5cIik7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHNwbGl0SFRNTExpbmU7XG5cbi8vIHNwbGl0IGF0IGFsbCBwb3NzaWJpbGl0aWVzLCB0aGFuIGNvbmNhdCBpdCBhcyBuZWVkZWRcblxuZnVuY3Rpb24gc3BsaXRIVE1MTGluZShsaW5lLCBoYXJkTGltaXQpIHtcblx0dmFyIHBhcnRzID0gW107XG5cdHZhciBpbk9wZW5UYWcgPSBmYWxzZTtcblx0dmFyIGluRG91YmxlUXVvdCA9IGZhbHNlO1xuXHR2YXIgaW5TaW5nbGVRdW90ID0gZmFsc2U7XG5cdHZhciBzdGFydEluZGV4ID0gMDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0dmFyIGFjID0gbGluZVtpXTtcblx0XHRpZiAoYWMgPT09IFwiIFwiICYmIGluT3BlblRhZyAmJiAhaW5Eb3VibGVRdW90ICYmICFpblNpbmdsZVF1b3QpIHtcblx0XHRcdHBhcnRzLnB1c2gobGluZS5zdWJzdHJpbmcoc3RhcnRJbmRleCwgaSkpO1xuXHRcdFx0c3RhcnRJbmRleCA9IGkgKyAxO1xuXHRcdH1cblx0XHRpZiAoYWMgPT09IFwiPFwiICYmICFpbkRvdWJsZVF1b3QgJiYgIWluU2luZ2xlUXVvdCkge1xuXHRcdFx0aW5PcGVuVGFnID0gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKGFjID09PSBcIj5cIiAmJiAhaW5Eb3VibGVRdW90ICYmICFpblNpbmdsZVF1b3QpIHtcblx0XHRcdGluT3BlblRhZyA9IGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoYWMgPT09IFwiXFxcIlwiICYmICFpblNpbmdsZVF1b3QgJiYgaW5PcGVuVGFnKSB7XG5cdFx0XHRpbkRvdWJsZVF1b3QgPSAhaW5Eb3VibGVRdW90O1xuXHRcdH1cblx0XHRpZiAoYWMgPT09IFwiJ1wiICYmICFpbkRvdWJsZVF1b3QgJiYgaW5PcGVuVGFnKSB7XG5cdFx0XHRpblNpbmdsZVF1b3QgPSAhaW5TaW5nbGVRdW90O1xuXHRcdH1cblx0fVxuXHQvLyBkbyBub3QgZm9yZ2V0IHRvIGFkZCB0aGUgcmVzdFxuXHRpZiAoc3RhcnRJbmRleCA8IGxpbmUubGVuZ3RoIC0xICkge1xuXHRcdHBhcnRzLnB1c2gobGluZS5zdWJzdHIoc3RhcnRJbmRleCkpO1xuXHR9XG5cdHZhciBmaW5hbFN0cmluZ3MgPSBbcGFydHNbMF1dO1xuXHRmb3IgKHZhciBpID0gMTsgaSA8IHBhcnRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0dmFyIGxhc3RJbmRleCA9IGZpbmFsU3RyaW5ncy5sZW5ndGggLSAxO1xuXHRcdGlmIChmaW5hbFN0cmluZ3NbbGFzdEluZGV4XS5sZW5ndGggKyBwYXJ0c1tpXS5sZW5ndGggPCBoYXJkTGltaXQpIHtcblx0XHRcdGZpbmFsU3RyaW5nc1tsYXN0SW5kZXhdID0gZmluYWxTdHJpbmdzW2xhc3RJbmRleF0gKyBcIiBcIiArIHBhcnRzW2ldO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmaW5hbFN0cmluZ3MucHVzaChwYXJ0c1tpXSk7XG5cdFx0fVxuXHR9XG5cdC8qXG5cdGNvbnNvbGUubG9nKFwiRGEgc3BsaXQgc3RyaW5nIGlzOiBcIik7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZmluYWxTdHJpbmdzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Y29uc29sZS5sb2coZmluYWxTdHJpbmdzW2ldLmxlbmd0aCk7XG5cdFx0Y29uc29sZS5sb2coZmluYWxTdHJpbmdzW2ldKTtcblx0fVxuXHQvLyovXG5cdHJldHVybiBmaW5hbFN0cmluZ3Muam9pbihcIlxcblwiKTtcbn1cbiJdfQ==
