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
	if (startIndex < line.length -1 ) {
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
