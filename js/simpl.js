

Transform = function(){
	/*
	find all possible applications of this transformation
	*/
	this.make_checker = function(filter){
		var sexpr = filter.split(' ');
		var dict = {};
		console.log(sexpr);
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
	this.find = function(filter, form){
		var params = this.make_checker(filter);
		var mults = form.get('type:op op:mult');
		console.log(mults);
		return mults;
	}
	this.apply = function(params, form){

	}
};
Transforms.Distribute.prototype = new Transform();