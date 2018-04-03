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
	if (startIndex < line.length -1 ) {
		parts.push(line.substr(startIndex));
	}
	var finalStrings = [parts[0]];
	for (var i = 1; i < parts.length; i += 1) {
		var lastIndex = finalStrings.length - 1;
		if (finalStrings[lastIndex].length + parts[i].length < hardLimit) {
			finalStrings[lastIndex] = finalStrings[lastIndex] + parts[i];
		} else {
			finalStrings.push(parts[i].replace(/^\s/, ""));
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
