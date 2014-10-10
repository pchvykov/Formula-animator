

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
	this.init = function(){
		this.SimplifyConstantsSearchResults = function(){
			this.data = [];
			this.add = function(r){
				data.push(r);
			}
			this.print = function(){
				for(var r = 0; r < this.data.length; r++){
					console.log("> ", this.data[r].print());
				}
			}
			this.get = function(i){
				return this.data[i];
			}
			this.foreach = function(cbk){
				for(var r=0; r < this.data.length; r++){
					cbk(this.data[r], r);
				}
			}
		}
	}
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
	this.find = function(filter){
		var params = this.make_checker(filter);
		var unfilt = form.find('type:op');
		var result = new this.SimplifyConstantsSearchResults();
		for(var i in unfilt){
			if(this.test(params,unfilt[i])){
				result.add(unfilt[i]);
			}
		}
		return result;
	}
	this.apply = function(node){
		var finalval = node.eval();
		var form = node.get_formula();
		var newconst = form.add('NUMBER');
		newconst.set('value', finalval);
		newconst.set('code', ""+finalval);
		node.replace(newconst.id);
		form.cleanup();
		
	}
}
Transforms.SimplifyConstants.prototype = new Transform();

Transforms.Distribute = function(){
	this.init = function(){
		this.DistributeSearchResult = function(){
			this.data = {};
			this._len = 0;
			this.add = function(i,s,j,d){
				var dist = Math.abs(i-j);
				if(!this.data.hasOwnProperty(dist))
					this.data[dist] = [];
				this.data[dist].push({src:s,dest:d});
				this._len+=1;
			}
			this.get = function(id){
				var k=0;
				for(var dist in this.data){
					for(var i=0; i < this.data[dist].length; i++){
						if(k == id){
							return {src:this.data[dist][i].src, dest:this.data[dist][i].dest, dist:dist};
						}
						k++;
					}
				}
			}
			this.foreach = function(cbk){
				for(var dist in this.data){
					for(var i=0; i < this.data[dist].length; i++){
						cbk(this.data[dist][i].src, this.data[dist][i].dest, dist, i);
					}
				}
			}
			this.print = function(){
				for(var i in this.data){
					console.log("## Distance: ",i);
					for(var j = 0; j < this.data[i].length; j++){
						var c = this.data[i][j];
						console.log("   > src: ",c.src.print(), ", dest: ",c.dest.print());
					}
				}		
			}
		}
	}
	/*
	params: src:XXX src:XXX dest:XXX
	*/
	this.test = function(params,node){
		var test_param = function(n,t,mparan){
			var result = {};
			var result_count = 0;
			n.foreach_child(function(c,idx){
				var isOk = true;

				
				for(var i=0; i < t.length; i++){
					var res = c.get('#'+t[i]);
					if(res.length == 0) isOk = false;
				}
				//make sure contains all the terms, and if we require parenthesis, require
				if(isOk && (!mparan || c.data('op') == 'paren')){ //this node contains all sources.
					result[idx] = c;
					result_count++;
				}
			})
			return {data:result, count:result_count};
		}

		if(!params.hasOwnProperty('src')){
			params.src = [];	
		}
		else if (!(params.src instanceof Array)){
			params.src = [params.src];
		}

		var sources = test_param(node,params.src,false);

		if(!params.hasOwnProperty('dest')){
			params.dest = [];
		}
		else if (!(params.dest instanceof Array)){
			params.dest = [params.dest];
		}

		var dests = test_param(node,params.dest,true);

		return {src:sources, dest:dests, ok:(dests.count != 0 && sources.count != 0)};

	}
	this.find = function(filter, form){
		var params = this.make_checker(filter);
		var unfilt = form.find('type:op op:mult');
		var result = new this.DistributeSearchResult();

		for(var i in unfilt){
			var res = this.test(params,unfilt[i]);
			if(res.ok){
				for(var si in res.src.data){
					for(var sj in res.dest.data){
						var i = parseInt(si);
						var j = parseInt(sj);
						if(i != j){
							result.add(i,res.src.data[si],j,res.dest.data[sj]);
						}
					}
				}
			}
		}
		//print results
		return result;
	}
	this.apply = function(res){
		var factor;
		var terms;

		var form = res.dest.get_formula();

		var dest = res.dest.child(0);  //get inside the parenthesis
		var dest_op =dest.data("op");
		var src = res.src;
		console.log(dest.print(), src.print(), dest_op)
		//distribute over dest;
		if(dest_op== "mult"){
			dest.foreach_child(function(c,i){
				mul.add_child_before(src.copy().id, c.id);
			})
		}
		else if(dest_op == "sub" || dest_op == "plus"){
			dest.foreach_child(function(c){
				var mul = form.add("MULT");
				mul.add_child(c.id);
				mul.add_child(src.copy().id);
				c.replace(mul.id);
			})
		}
		else {
			var mul = form.add("MULT");
			dest.replace(mul.id);
			mul.add_child(dest);
			mul.add_child(src.copy());
		}
		console.log("removing src");
		//remove the source from the products.
		src.remove();
		form.cleanup();
		/*
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
		*/
		
	}
	this.init();
};
Transforms.Distribute.prototype = new Transform();

