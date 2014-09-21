

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
		console.log(node)
		if(node.right.type == 'op' && node.right.op == 'paren'){
			return true;
		}
		else if(node.left.type =='op' && node.left.op == 'paren'){
			return true;
		}
		else return false;

	}
	this.find = function(filter, form){
		var params = this.make_checker(filter);
		console.log("ufilt");
		var unfilt = form.get('type:op op:mult');
		var result = [];
		
		for(var i=0; i < unfilt.length; i++){
			if(this.test(params,unfilt[i])){
				result.push(unfilt[i]);
			}
		}
		console.log(result);
		return result;
	}
	this.apply = function(params, form){

	}
};
Transforms.Distribute.prototype = new Transform();