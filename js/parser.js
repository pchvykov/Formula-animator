var mock1 = {
	type: "op",
	op: "plus",
	left: {
		type: "symbol",
		value: "a"
	},
	right: {
		type: "number",
		value: 52

	}
}

//read up on http://en.wikipedia.org/wiki/Parsing_expression_grammar to get how this works
//uses the grammar.peg to parse the latex string into mater tree
Parser = function(){
	//takes text, turns it into tree

	this.init = function(){
		var that = this;
		this.peg = PEG;
		this.parser = null;
		//this.parser = this.peg.buildParser(this.grammar);
		that.grammar = jQuery.get('js/grammar.peg', function(data) {
		    that.grammar = data;
		    that.parser = that.peg.buildParser(that.grammar);
		});
	}
	this.parse = function(text){
		return this.parser.parse(text);

	}
	this.init();

}
 parser = new Parser();
