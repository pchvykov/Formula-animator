


var Formula = function(data){
	this.NODES = {
		OP: {
			MULT: {left:null, right:null,children:['left','right'],type:'op',code:'*',op:'mult'},
			DIV: {},
			PAREN: {exp:null,children:['exp'],type:'op',op:'paren'},
			ADD: {left:null, right:null,children:['left','right'],type:'op',code:'+',op:'plus'},
			SUB: {left:null, right:null,children:['left','right'],type:'op',code:'-',op:'minus'},
			EXP: {},
			EQ: {left:null, right:null,children:['left','right'],type:'op',code:'=',op:'eq'}
		},
		VARIABLE: {children:[], type:"variable", code:null, name:null},
		NUMBER: { type:'number', children:[], code:null,value:null}


	}
	this.copy = function(){
		return new Formula(this.data.copy());
	}
	this._build_data = function(d){
		var that = this;
		var link_vars = function(parent, node){
			that.__init_node(parent,node);
			for(var i=0; i < node.children.length; i++){
				link_vars(node, node.child(i));
			}

		}
		link_vars(null,d);
	}
	this.__init_node = function(parent, node){
		node.id = this.index;
		var that = this;
		if(parent != null){
			node.parent_id = parent.id;

		}
		else{
			node.parent_id = null;
		}
		node.parent = function(){
			if(this.parent_id != null){
				return that.get("#"+this.parent_id)[0];
			}
			else return null;
		}
		node.child = function(i){return this[this.children[i]]}
		node.set = function(k,n){
			this[k] = n;
			n.parent_id = this.id;
		}
		node.get = function(k){
			return that.subtree_get(k, this);
		}
		node.copy = function(){
			return JSON.parse(JSON.stringify(this,null,2));
		}
		this.index++;
	}
	this.create = function(type){
		var TYPE = type.toUpperCase().split(".");
		var cdict = this.NODES;
		for(var i=0; i < TYPE.length; i++){
			cdict = cdict[TYPE[i]];
		}
		var node = JSON.parse(JSON.stringify(cdict,null,2));
		this.__init_node(null, node);
		return node;
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
					if(n.id == check_id) return true
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
	this.subtree_get = function(exp, n){
		var checker = this.to_checker(exp);
		var results = [];
		if(checker(n)) results.push(n);
		for(var i=0; i < n.children.length; i++){
			var subres = this.subtree_get(exp, n.child(i));
			results = results.concat(subres);
		}
		return results;
	}
	this.replace = function(target, newnode){
		var par = target.parent();
		if(par != null){
			for(var i=0; i < par.children.length; i++){
				var key = par.children[i];
				if(par.child(i).id == target.id){
					par[key] = newnode;
					newnode.parent_id = par.id;
				}
			}
		}
		else{
			this.data = newnode;
			newnode.parent_id = null;
		}
	}
	this.remove = function(target, child_to_moveup){
		var chld = target[child_to_moveup];
		this.replace(target,chld);
	}
	this.get = function(exp){
		return this.subtree_get(exp, this.data);
	}
	this.init = function(d){
		this.index = 0;
		this.data = d;
		this._build_data(this.data);
	}
	this.toString = function(){
		return JSON.stringify(this.data,null,2);
	}
	this.print = function(){
		var print_node =  function(n){
			if(n.op == 'plus' || n.op == 'minus' || n.op == 'eq' ||
				n.op == 'div' || n.op == 'mult'){
				return print_node(n.left)+ n.code + print_node(n.right);
			}
			else if(n.op == 'div' || n.op == 'exp'){
				return print_node(n.top)+ n.code + print_node(n.bottom);
			}
			else if(n.op == 'paren'){
				return "("+print_node(n.exp)+")"
			}
			else if(n.type == 'variable'){
				return  n.code;
			}
			else if(n.type == 'number'){
				return n.code;
			}
			else{
				console.log("ERROR:",n);
			}
		}
		return print_node(this.data);
	}
	this.init(data);
}