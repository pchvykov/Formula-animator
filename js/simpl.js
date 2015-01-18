


ApplyResult = function(name){
	this.init = function(name){
		this.name = name;
		this.m = {};
		this.l = {};
		this.m.add = [];
		this.m.del = [];
	}
	this.mark = function(name,id){
		this.l[name] = id;
	}
	this.get = function(name){
		return this.l[name];
	}
	this.map  = function(oldid,newid){
		if(isUndefined(newid)) return;
		if(newid == null){
			this.m.del.push(oldid);
			return;
		}
		if(oldid == null){
			this.m.add.push(newid);
			return;
		}
		this.m[newid] = oldid;
	}
	this.to = function(old_id){
		var res = [];
		for(id in this.m){
			if(id != "del" && id != "add" && this.m[id] == old_id){
				res.push(id)
			}
		}
		if(res.length == 0){
			for(var i=0; i < this.m.del.length; i++){
				if(this.m.del[i] == old_id){
					return null; 
				}
			}
			return undefined;
		}
		return res;
	}
	this.from = function(new_id){
		if(!(new_id in this.m)){
			for(var i=0; i < this.m.add.length; i++){
				if(this.m.add[i] == new_id){
					return null; 
				}
			}
			//return undefined;
			return new_id;
		}
		return this.m[new_id];
	}
	this.new_ids = function(){
		return this.m.add
	}
	this.del_ids = function(){
		return this.m.del;
	}
	this.init(name);
}

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
	this.get_name = function(){
		return this.name;
	}
	/*
	
	*/
	this.find = function(filter, form){

	}
	this.apply = function(params, form){

	}
}

Transforms = {};
MoveTermSearchResults = function(){
	this.data = {};
	this.add = function(eq,t_move, t_after){
		var res = r.find('op:eq');
		var len = 0;
		for(var q in res){
			var has_movable;
			len++;
		}
		if(!this.data.hasOwnProperty(len)){
			this.data[len] = [];
		}
		this.data[0].push({eq:eq,src:t_move,after:t_after});
	}
	this.print = function(){

	}

}
Transforms.MoveTerm = function(){

}
Transforms.MoveTerm.prototype = new Transform();




SimplifyConstantsSearchResults = function(){
	this.data = {};
	this.add = function(r,chl){
		var len = 0;
		var res = r.find('type:number');
		for(var q in res){
			len++;
		}
		if(!this.data.hasOwnProperty(len)){
			this.data[len] = [];
		}
		this.data[len].push({node:r,children:chl});
	}
	this.print = function(){
		for(var q in this.data){
			console.log("Number Constants: ",q);
			for(var r = 0; r < this.data[q].length; r++){
				console.log("> ", this.data[q][r].node.print());
			}
		}
	}
	this.get = function(i){
		var k=0;
		for(var q in this.data){
			for(var r = 0; r < this.data[q].length; r++){
				if(i == k) return this.data[q][r];
				k++;
			}
		}
		return null;
	}
	this.foreach = function(cbk){
		for(var q in this.data){
			for(var r=0; r < this.data[q].length; r++){
				cbk(this.data[q][r].node, this.data[q][r].children, (q), r);
			}
		}
	}
}

Transforms.SimplifyConstants = function SimplifyConstants(){
	/*
	params: term:XXX term:XXX
	*/
	this.init = function(){

	}
	this.test = function(params,node){
		var factor = null;
		var numbers = [];
		node.foreach_child(function(c){
			if(c.data('type') == 'number'){
				numbers.push(c);
			}
			else if(c.data('type') == 'op'){
				var res = c.find('type:variable'); //if the child
				var cnt = 0;
				for(var r in res){
					cnt++;
				}
				if(cnt == 0) numbers.push(c);
			}
		})
		if(numbers.length < 1) return {ok:false, children:numbers, node:node};
		//ensure all the desired terms are in it
		if(params.hasOwnProperty('term')){
			var t = params.term;
			if (!(params.term instanceof Array)) t = [params.term];
			for(var i=0; i < t.length; i++){
				var res = node.find("#"+t[i]);
				if(res.length == 0) return {ok:false, children:numbers, node:node};
			}
		}
		return {ok:true, children:numbers, node:node};

	}
	this.find = function(filter, form){
		var params = this.make_checker(filter);
		var unfilt = form.find('type:op');
		var result = new SimplifyConstantsSearchResults();
		for(var i in unfilt){
			var r = this.test(params,unfilt[i]);
			if(r.ok){
				result.add(r.node, r.children);
			}
		}
		return result;
	}
	this.apply = function(res){
		var node = res.node;
		var children = res.children;
		var res = new ApplyResult();
		var finalval = node.eval();
		var form = node.get_formula();

		var newconst = form.add('NUMBER');
		newconst.set('value', finalval);
		newconst.set('code', ""+finalval);
		console.log(finalval);
		if(children.length == node.children.length){
			node.replace(newconst.id);
			res.map(node.id, newconst.id);

		}
		else{
			for(var i=0; i < children.length; i++){
				//remove child with this id.
				children[i].remove();
				res.map(children[i].id, newconst.id);
			}
			node.add_child(newconst.id, true);
			res.map(node.id, newconst.id);

		}
		form.cleanup();
		return res;
		
	}
	this.init();
}
Transforms.SimplifyConstants.prototype = new Transform();

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

Transforms.Distribute = function Distribute(){
	this.init = function(){
		
	}
	/*
	params: src:XXX src:XXX dest:XXX
	*/
	this.test = function(params,node){
		var test_param = function(n,t,mparan){
			var result = {};
			var result_count = 0;
			var found = {};
			n.foreach_child(function(c,idx){
				var isOk = true;
				//ensure contains all children.
				for(var i=0; i < t.length; i++){
					var res = c.find("#"+t[i]);
					if(countKeys(res) == 0) isOk = false;
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

		
		if(!params.hasOwnProperty('dest')){
			params.dest = [];
		}
		else if (!(params.dest instanceof Array)){
			params.dest = [params.dest];
		}

		var sources = test_param(node,params.src,false);
		var dests = test_param(node,params.dest,true);

		return {src:sources, dest:dests, ok:(dests.count != 0 && sources.count != 0)};

	}
	this.find = function(filter, form){
		var params = this.make_checker(filter);
		var unfilt = form.find('type:op op:mult');
		var result = new DistributeSearchResult();

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
		var form = res.dest.get_formula();
		var log = new ApplyResult("distribute");

		var dest = res.dest.child(0);  //get inside the parenthesis
		var dest_op =dest.data("op");
		var src = res.src;
		//var top = src.parent();
		log.mark('paren',dest.id);
		log.mark('top',src.id);
		//distribute over dest;
		if(dest_op== "mult"){
			dest.foreach_child(function(c,i){
				var nc = src.copy();
				mul.add_child_before(nc.id, c.id);
				log.map(src.id, nc.id);
			})
		}
		else if(dest_op == "sub" || dest_op == "plus"){
			dest.foreach_child(function(c,i){
				var mul = form.add("MULT");
				var nc = src.copy();

				c.replace(mul.id);

				mul.add_child(nc.id);
				mul.add_child(c.id);
				//add mappings
				log.map(src.id, nc.id);
				log.map(c.id,c.id);
				log.map(null, mul.id);
				//done
			})
		}
		else {
			var mul = form.add("MULT");
			var nc = src.copy();
			dest.replace(mul.id);
			mul.add_child(dest);
			mul.add_child(nc);
			log.map(src.id, nc.id);
			log.map(null, mul.id);
		}
		//remove the source from the products.
		src.remove();
		form.cleanup();
		return log;

	}
	this.init();
};
Transforms.Distribute.prototype = new Transform();

