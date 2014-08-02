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
			console.log(data);
		    that.grammar = data;
		    that.parser = that.peg.buildParser(that.grammar);
		});
	}
	this.parse = function(text){
		return this.parser.parse(text);

	}
	this.gen = function(data){
		var type = data.type;
		if(type == 'op'){
			var op = this.op_map[data.op];
			var res_left = this.gen(data.left);
			var res_right = this.gen(data.right);
			return res_left + op + res_right;

		}
		else if(type == "symbol"){
			return data.value;
		}
		else if(type == "number"){
			return data.value;
		}
	}
	this.init();

}
 parser = new Parser();