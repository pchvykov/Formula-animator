var Formula = function(data){
	this._build_data = function(d){
		var that = this;
		var link_vars = function(parent, node){
			if(parent != null){
				node.parent_id = parent.id;
				node.parent = function(){
					return that.get("#"+this.parent_id)[0];
				}
			}
			else{
				node.parent_id = null;
				node.parent = function(){return null;}
			}

			node.child = function(i){return this[this.children[i]]}
			for(var i=0; i < node.children.length; i++){
				link_vars(node, node[node.children[i]]);
			}

		}
		link_vars(null,d);
	}
	/*
	#id : id number of a node
	#field:val : field is a particular value
	# a b : a and b
	# a,b : a or b
	*/
	this.to_checker = function(exp){
		var isAnd = false;
		var subexp = exp.split(",");
		if(subexp.length == 1){
			isAnd = true;
			subexp = exp.split(' ');
		}
		var fxns = [];
		var make_fxn = function(se){
			if(se.charAt(0) == '#'){
				//test id number
				check_id = parseInt(se.substring(1))
				return function(n){
					if(n.id == check_id) return truel
					else return false;
				}
			}
			else {
				var args = se.split(":");
				var key = args[0];
				var value = args[1];
				return function(n){
					if(n[key] == value) return true 
					else return false;
				}
			}
		}
		for(var i=0; i < subexp.length; i++){
			fxns.push(make_fxn(subexp[i]));
		}

		return function(n){
			var isTrue = true;
			for(var i=0; i < fxns.length; i++){
				if(isAnd) isTrue = isTrue && fxns[i](n);
				else isTrue = isTrue || fxns[i](n);
			}
			return isTrue;
		}
	}
	this.get = function(exp){
		var checker = this.to_checker(exp);

		var scan = function(n){
			var results = [];
			console.log(n);
			if(checker(n)) results.push(n);
			for(var i=0; i < n.children.length; i++){
				results.concat(scan(n.child(i)));
			}
			return results;
		}
		return scan(this.data);
	}
	this.init = function(d){
		this.data = d;
		this._build_data(this.data);
	}
	this.toString = function(){
		return JSON.stringify(this.data,null,2);
	}
	this.copy = function(){
		return JSON.parse(JSON.stringify(this.data,null,2));
	}
	this.init(data);
}