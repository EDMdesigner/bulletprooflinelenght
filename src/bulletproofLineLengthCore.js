module.exports = function(dependencies) {
	if (!dependencies.splitHTMLLine) {
		throw Error("dependencies.splitHTMLLine is mandatory!");
	}
	if (!dependencies.splitCSSLine) {
		throw Error("dependencies.splitCSSLine is mandatory!");
	}

	var splitHTMLLine = dependencies.splitHTMLLine;
	var splitCSSLine = dependencies.splitCSSLine;

	function splitLine(line, hardLimit) {
		if(line.length < hardLimit) {
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
