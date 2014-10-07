

var Node = function(f, handle, parent_id){
	//ids of children
	this.NODE ={
			base: {children:{}, type:'unknown', code:null, parent_id:null, id:null},
			children: {
				OP: {
					base: {type:'op', code:'?', type:'unknown'},
					children: {
						MULT: {base:{op:'mult', code:'*'}, children:{}}, //
						DIV: {base:{op:'div', code:'/'}, children:{}}, //top -> bottom, numerator to denominator
						ADD: {base:{op:'plus', code:'+'}, children:{}},
						SUB: {base:{op:'sub', code:'-'}, children:{}},
						EQ: {base:{op:'eq', code:'='}, children:{}}
					}
				},
				VAR: {type:'variable', name:null},
				NUMBER: {type:'number', value:null}
			}
	}
	this.init = function(f,handle, parent_id){
		var that = this;
		var cobble_data = function(data,name){
			var node = {}; //copy base info.
			for(var b in data.base){
				node[b] = copyData(data.base[b]);
			}
			if(name == handle){ return {found:true, data:node};}
			else{
				for(child in data.children){
					var res = cobble_data(data.children[child], child);
					//copy returned structure.
					if(res.found){
						for(var k in res.data){
							node[k] = res.data[k];
						}
						return {found:true, data:node}; //exists in one of our children.
					}
				}
			}
			//did not find this.

			return {found:false, data:{}};
		}
		var data = cobble_data(this.NODES,'NODE');
		this.HANDLE = handle;
		data.id = f.fresh_id();
		data.parent_id = id;
		f.get(parent_id).children[data.id] = null;
		this._data = data;
		return data;
	}
	this.replace = function(f, new_id){
		var par = this.parent();
		if(par != null){
			delete par[this.id];
			par[new_id] = null;
			f.get(new_id).parent_id = this.parent_id;
			this.parent_id = -1;
		}
		else{
			newnode.parent_id = -1;
		}
	}
	this.remove = function(f, child_to_moveup){
		this.replace(f,child_to_moveup);
	}
	this.data = function(key){
		return this._data[key];
	}
	this.parent = function(f){
		return f.get(this.parent_id);
	}
	this.child = function(f,i){
		return f.get(this.children[i]);
	}
	this.print = function(f){
		if(this.type == 'op'){
			for(var i=0; i < this.children.length; i++){
				if(i > 0){
					console.log(this.code);
				}
				console.log("(");
				f.get(this.children[i]).print();
				console.log(")");
			}
		}
		else if(type == 'variable'){
			console.log(this.code);
		}
		else if(type == 'number'){
			console.log(this.value);
		}
	}
	/*
	Given a formula, find all the ancestors.
	*/
	this.ancestors = function(f){
		var ancestors = function(d){
			var a = {};
			for(var i=0; i < d.children; i++){
				var child_id = d.children[i];
				var child = f.get(child_id);
				a[child_id] = child;

				var anc = ancestors(child);
				for(var ancestor in anc){
					a[ancestor] = anc[ancestor];
				}
			}
			return a;
		}
		return ancestors;

	}
	this.copy = function(f,parent){
		var n = new Node(this.HANDLE, f.fresh_id(), parent);
		n._data = copyData(this._data);
		return n;
	}

	this.copy_subtree = function(f){
		var anc = this.ancestors(f);
		var mappings = {};
		var nodes = {};
		for(a in anc){
			var el = anc[a].copy;
			mappings[el.id] = f.fresh_id();
			el.id = mappings[el.id];
			nodes[el.id] = el;
		}
		for(a in anc){
			var el = anc[a];
			var pid = el.parent_id;
			if(pid in mappings){
				el.parent_id = mappings[pid];
			}
			else{
				el.parent_id = -1;
			}
			for(var i=0; i < el.children.length; i++){
				var cid = el.children[i];
				if(cid in mappings){
					el.children[i] = mappings[cid];
				}
				else{
					el.children[i] = -1;
				}
			}
		}
		return nodes;
	}
	this.init(f,handle,parent_id);
}
var Formula = function(){

	this.init = function(){
		this.nodes = {};
		this.ID = 0;
	}

	this.add = function(handle, parent_id){
		var node = new Node(this, handle, parent_id);
		this.nodes.append(node);
	}
	this.fresh_id = function(){
		var id= this.ID;
		this.ID++;
		return id;
	}
	this.get = function(id){
		return this.nodes[id];
	}
	this.copy = function(){
		var f = new Formula();
		f.nodes = copyData(this.nodes);
		f.ID = this.ID;
		return f;
	}

	this.init();



	/*
	# #id : id number of a node
	# field:val : field is a particular value
	# %parent_id : is child of this parent.
	# %%ancestor_id : is an ancestor of this parent.
	# a b : a and b
	# a,b : a or b
	*/
	this.to_checker = function(exp){
		var combine = function(a,b){return a||b};
		var subexp = exp.split(",");
		if(subexp.length == 1){
			combine = function(a,b){return a&&b};
			subexp = exp.split(' ');
		}
		var predicates = function(){return true;};
		for(var i=0; i < subexp.length; i++){
			var pred = subexp[i];
			if(pred.startswith("#")){
				var check_id = parseInt(se.substring(1))
				var new_pred = function(comb,prev, checkid){
					return function(node){return comb( prev(node), checkid==node.id) }
				}(combine,predicates,check_id);
				var predicates = new_pred;
			}
			else if(pred.startswith("%%")){
				var check_id = parseInt(se.substring(2));
				var anc = this.get(check_id).ancestors(this);
				var new_pred = function(comb,prev, anc){
					return function(node){return comb( prev(node), node.id in anc) }
				}(combine,predicates,anc);
				var predicates = new_pred;
			}
			else if(pred.startswith("%")){
				var check_id = parseInt(se.substring(1));
				var new_pred = function(comb,prev, checkid){
					return function(node){return comb( prev(node), checkid==node.parent_id) }
				}(combine,predicates,check_id);
				var predicates = new_pred;
			}
			else {
				var args = se.split(":");
				var key = args[0];
				var value = args[1];
				var new_pred = function(comb,prev, key,value){
					return function(node){return comb( prev(node), node.data(key) == value) }
				}(combine,predicates,key, value);
				var predicates = new_pred;
			}
		}
		return predicates;
	}
	this.find = function(expr, from){
		var checker = this.to_checker(exp);
		var nodes = {};
		if(isUndefined(from)){
				for(n in this.nodes){
					nodes[n] = this.nodes[n];
				}
		}
		else{
			nodes = from;
		}
		for(id in nodes){
			if(!checker(nodes[id])){
				delete nodes[id];
			}
		}
		return nodes[id];
	}


	this.toString = function(){
		return JSON.stringify(this.nodes,null,2);
	}
	this.init();
}
