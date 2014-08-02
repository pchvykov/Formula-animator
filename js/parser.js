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

Parser = function(){
	//takes text, turns it into tree

	this.op_map = {
		"plus":"+",
		"mult":"*"
	}
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
		return new Formula(this.parser.parse(text));

	}
	this.init();

}
 parser = new Parser();