var bulletproofLineLengthCore = require("./../src/bulletproofLineLengthCore");

var mockedSplitCSSLine = jasmine.createSpy("mockedSplitCSSLine").and.callFake(function(input) {
	return input;
});

var mockedSplitHTMLLine = jasmine.createSpy("mockedSplitHTMLLine").and.callFake(function(input) {
	return input;
});



describe("bulletproofLineLength", function() {

	describe("with invalid dependencies", function() {

		it("no dependencies", function() {
			expect(function(){
				var bulletproofLineLength = bulletproofLineLengthCore();
				bulletproofLineLength("d",2);
			}).toThrow();
		});

		it("missing splitHTMLLine", function() {
			expect(function(){
				bulletproofLineLengthCore({
					splitCSSLine: mockedSplitCSSLine
				});
			}).toThrow();
		});

		it("missing splitCSSLine", function() {
			expect(function(){
				bulletproofLineLengthCore({
					splitHTMLLine: mockedSplitHTMLLine
				});
			}).toThrow();
		});

	});

	describe("with invalid config", function() {
		var bulletproofLineLength = bulletproofLineLengthCore({
			splitHTMLLine: mockedSplitHTMLLine,
			splitCSSLine: mockedSplitCSSLine
		});

		it("no parameters", function() {
			expect(function(){
				bulletproofLineLength();
			}).toThrow();
		});

		it("missing input", function() {
			expect(function(){
				bulletproofLineLength();
			}).toThrow();
		});

		it("illegal input", function() {
			expect(function(){
				bulletproofLineLength(3);
			}).toThrow();
		});

		it("missing maximalLineLength", function() {
			expect(function(){
				bulletproofLineLength("feri");
			}).toThrow();
		});

		it("illegal maximalLineLength", function() {
			expect(function(){
				bulletproofLineLength("feri", "manci");
			}).toThrow();
		});

	});

	describe("with valid config", function() {
		var bulletproofLineLength = bulletproofLineLengthCore({
			splitHTMLLine: mockedSplitHTMLLine,
			splitCSSLine: mockedSplitCSSLine
		});

		it("return the original", function() {
			var shortString = "<tag>Veve</tag>";
			var tLimit = 50;
			var res = bulletproofLineLength(shortString, tLimit);
			expect(res).toEqual(shortString);
		});

		it("call htmlline", function() {
			var longString = "<tag attrib='attrib' attrib='attrib'>value</tag><tag attrib='attrib' attrib='attrib'>value</tag>";
			var tLimit = 20;
			bulletproofLineLength(longString, tLimit);
			expect(mockedSplitHTMLLine).toHaveBeenCalledWith(longString, tLimit);
		});

		it("call cssline", function() {
			var longString = "body, p{margin:0; padding:0; margin-bottom:0; -webkit-text-size-adjust:none; -ms-text-size-adjust:none;}";
			var tLimit = 20;
			bulletproofLineLength(longString, tLimit);
			expect(mockedSplitCSSLine).toHaveBeenCalledWith(longString, tLimit);
		});

		it("undefined row", function() {
			var longString = "dmvowncn ie82no nsu 9wh3nkdgsp  iddmsislk eoeifjzgjziuvz;doiz8gawnskdjnzl;vk;o sdlkfn ;ushp8dfs ndkn zidh";
			var tLimit = 20;
			var res = bulletproofLineLength(longString, tLimit);
			expect(res).toEqual(longString);
		});

	});

});
