

Transform = function(){
	/*
	find all possible applications of this transformation
	*/
	this.make_checker = function(filter){
		var sexpr = filter.split(' ');
		var dict = {};
		for(var i =0; i < sexpr.length; i++){
			var args = sexpr[i].split(':');
			if(args.length >= 2){
				if(dict.hasOwnProperty(args[0])){
					if (dict[args[0]] instanceof Array) {
						dict[args[0]].push(args[1]);
					}
					else{
						dict[args[0]] = [dict[args[0]], args[1]];
					}
				}
				else{
					dict[args[0]] = args[1];
				}
			}
			
		}

		return dict;
	}
	/*
	
	*/
	this.find = function(filter, form){

	}
	this.apply = function(params, form){

	}
}

Transforms = {};
Transforms.Distribute = function(){

	/*
	params: factor:XXX term:XXX term:XXX
	*/
	this.test = function(params,node){
		var factor = null
		var terms = null;
		if(node.right.type == 'op' && node.right.op == 'paren'){
			factor = node.left;
			terms = node.right;
		}
		else if(node.left.type =='op' && node.left.op == 'paren'){
			factor = node.right;
			terms = node.left;
		}
		else return false;
		if(params.hasOwnProperty('factor')){
			var id = params['factor'];
			if(factor.id != id) return false;
		}
		if(params.hasOwnProperty('term')){
			var t = params['term'];
			if (!params.term instanceof Array) t = [params.term];
			for(var i=0; i < t.length; i++){
				var res = terms.get('#'+t[i]);
				if(res.length == 0) return false;
			}
		}
		return true;

	}
	this.find = function(filter, form){
		var params = this.make_checker(filter);
		var unfilt = form.get('type:op op:mult');
		var result = [];
		
		for(var i=0; i < unfilt.length; i++){
			if(this.test(params,unfilt[i])){
				result.push(unfilt[i]);
			}
		}
		return result;
	}
	this.apply = function(node, form){
		var factor;
		var terms;
		if(node.right.type == 'op' && node.right.op == 'paren'){
			factor = node.left;
			terms = node.right;
		}
		else if(node.left.type =='op' && node.left.op == 'paren'){
			factor = node.right;
			terms = node.left;
		}
		form.remove(terms, 'exp'); // remove the parenthesis, replace with exp.
		//multiply with each of the terms.
		for(var i=0; i < terms.children.length; i++){
			console.log("term",i,terms.child(i))
		}
		
	}
};
Transforms.Distribute.prototype = new Transform();