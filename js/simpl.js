

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

Transforms.MoveTerm = function(){

}
Transforms.MoveTerm.prototype = new Transform();



Transforms.SimplifyConstants = function(){
	/*
	params: term:XXX term:XXX
	*/
	this.test = function(params,node){
		var factor = null
		var terms = null;
		//only operators and constants.
		if(node.find('type:variable').length > 0)
			return false;
		//ensure all the desired terms are in it
		if(params.hasOwnProperty('term')){
			var t = params.term;
			if (!(params.term instanceof Array)) t = [params.term];
			for(var i=0; i < t.length; i++){
				var res = node.get('#'+t[i]);
				if(res.length == 0) return false;
			}
		}
		return true;

	}
	this.find = function(filter, form){
		var params = this.make_checker(filter);
		var unfilt = form.find('type:op');
		var result = [];
		for(var i in unfilt){
			if(this.test(params,unfilt[i])){
				result.push(unfilt[i]);
			}
		}
		return result;
	}
	this.apply = function(node, form){
		var finalval = node.eval();

		var newconst = form.add('NUMBER');
		newconst.set('value', finalval);
		newconst.set('code', ""+finalval);
		node.replace(newconst.id);

		
	}
}
Transforms.SimplifyConstants.prototype = new Transform();

Transforms.Distribute = function(){

	/*
	params: term:XXX term:XXX
	*/
	this.test = function(params,node){
		if(!((node.right.type == 'op' && node.right.op == 'paren')
			||(node.left.type =='op' && node.left.op == 'paren')))
			return false;

		if(params.hasOwnProperty('term')){
			var t = params.term;
			if (!(params.term instanceof Array)) t = [params.term];
			for(var i=0; i < t.length; i++){
				var res = node.get('#'+t[i]);
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
		console.log('before');
		if(node.right.type == 'op' && node.right.op == 'paren'){
			factor = node.left;
			terms = node.right;
		}
		else if(node.left.type =='op' && node.left.op == 'paren'){
			factor = node.right;
			terms = node.left;
		}
		console.log('initial replace');
		form.replace(node, terms); // remove the parenthesis, replace with exp.
		var findterms = function(n){
			var args = [];
			if(n.type == 'op' && 
				(n.op == 'plus' || n.op == 'minus'))
			{
				args= args.concat(findterms(n.left));
				args = args.concat(findterms(n.right));
			}
			else if(n.type == 'op' && n.op == "paren"){
				args = findterms(n.exp);
			}
			else{
				args.push(n);
			}
			return args;
		}
		var args = findterms(terms);
		console.log(args);
		//multiply with each of the terms.
		for(var i=0; i < args.length; i++){
			console.log('starting');
			var paren = form.create('op.paren');
			var mul = form.create('op.mult');
			console.log('copying')
			var f = factor.copy();
			var t = args[i].copy();
			var term = args[i];
			console.log('setting',mul, f);
			//build subtree
			mul.set('left',f);
			mul.set('right',paren);
			paren.set('exp',t);
			console.log(term,mul);
			form.replace(term, mul);
			console.log(i,'done');
		}
		
	}
};
Transforms.Distribute.prototype = new Transform();

