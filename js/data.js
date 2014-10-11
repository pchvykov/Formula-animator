/**
 * What does this function do?
 * @constructor
 * @param {string} f - What does f represent?
 * @param {string} handle - What does handle represent?
 */
var Node = function(f, handle){
	//ids of children
	this.NODE ={
			base: {type:'unknown', code:'?'},
			children: {
				OP: {
					base: {type:'op', code:'?', type:'op', op:'unknown'},
					children: {
						MULT: {base:{op:'mult', code:'*'}, children:{}}, //
						DIV: {base:{op:'div', code:'/'}, children:{}}, //top -> bottom, numerator to denominator
						ADD: {base:{op:'plus', code:'+'}, children:{}},
						SUB: {base:{op:'sub', code:'-'}, children:{}},
						EXPO: {base:{op:'power', code:'^'}, children:{}},
						EQ: {base:{op:'eq', code:'='}, children:{}},
						PAREN: {base:{op:'paren',code:'()', children:{}}}
					}
				},
				VAR: {base:{type:'variable', name:null},children:{}},
				NUMBER: {base:{type:'number', value:null},children:{}}
			}
	}
	this.get_id = function(){
		return this.id;
	}
	/**
	 * Evaluate the numerical value, ignoring any symbols in the expression.
	 * This is useful for evaluating operations on constants.
	 */
	this.eval = function(){
		var type = this.data('type');
		var op = this.data('op');
		switch(type){
			case 'variable':
				return null;
			case 'number':
				return this.data('value');
			case 'op':
				switch(op){
					case 'plus': var ex = function(a,b){return a+b}; break;
					case 'mult': var ex = function(a,b){return a*b}; break;
					case 'div': var ex = function(a,b){return a/b}; break;
					case 'sub': var ex = function(a,b){return a-b}; break;
					case 'power': var ex = function(a,b){return Math.pow(a,b)}; break;
					case 'eq': var ex = function(a,b){return a}; break;
					case 'paren': var ex = function(a,b){return a}; break;
				}
				var res;
				for(var i=0; i < this.children.length; i++){
					if(i == 0){
						var e = this.child(i).eval();
						while(e == null){
							e = this.child(i).eval();
							i++;
						}
						if(i > 1) i--;
						var res = e;
					}
					else{
						var e = this.child(i).eval();
						if(e != null)
							res = ex(res, e);
					}
				}
				if(this.children.length == 1){
					var res = this.childAt(0).eval();
				}
				return res;
		}
	}
	/**
	 * iterate over all the children in left-right order, invoking function cbk.
	 * @param {function} cbk - a function that takes in a (Node,number), where the
	 node is the child node, the number is the position.
	 * @param {string} handle - What does handle represent?
	 */
	this.foreach_child = function(cbk){
		var f = this.formula;
		for(var i=0; i < this.children.length; i++){
			if(f.has(this.children[i]))
				cbk(f.get(this.children[i]),i);
		}
	}
	/**
	 * Add child before the node at position j.
	 * @param {number} child_id - The id number of the child to add.
	 * @param {number} j - the position to insert the child before. Refer to get_index
	 * for more info.
	 */

	this.add_child_before = function(child_id, j){
		this.children.splice(j,0,child_id);
	}
	/**
	 * Add a child to the leftmost or rightmost position.
	 * @param {number} child_id - id number of child to add.
	 * @param {boolean} tofront - whether to add it before the first node.
	 */
	this.add_child = function(child_id, tofront){
		if(isUndefined(tofront) || ! tofront){
			if(this.children.indexOf(child_id) < 0)
				this.children.push(child_id);
		}
		else {
			if(this.children.indexOf(child_id) < 0)
				this.children.unshift(child_id);
		}
	}
	/**
	 * number of children node has.
	 */
	this.n_children = function(){
		return this.children.length;
	}
	/**
	 * remove the child at position j. This does not change the parent id of the child.
	 * @param {string} j - position of child to remove.
	 */
	this.remove_child = function(j){
		var f = this.formula;
		if(j >= 0) this.children.splice(j,1); // removes that child.
	}
	/**
	 * Initialize the node.
	 * @constructor
	 * @param {Formula} f - the formula to add the node to.
	 * @param {String} handle - The type of node to add. Must be a key in NODES.
	 */
	this.init = function(f,handle){
		var that = this;
		var cobble_data = function(data,name){
			var node = {}; //copy base info.
			for(var b in data.base){
				node[b] = copyData(data.base[b]);
			}
			if(name == handle){
				return {found:true, data:node};
			}
			else{
				for(child in data.children){
					var res = cobble_data(data.children[child], child);
					//copy returned structure.
					if(res.found){
						for(var k in node){
							if(!(k in res.data))
								res.data[k] = node[k];
						}
						return {found:true, data:res.data}; //exists in one of our children.
					}
				}
			}
			//did not find this.

			return {found:false, data:{}};
		}
		var data = cobble_data(this.NODE,'NODE').data;
		this.HANDLE = handle;
		this.id = f.fresh_id();
		this.parent_id = -1;
		this.children = [];
		this.formula = f;
		this._data = data;
		return data;
	}
	/**
	 * Replace the current node, with the node that has the id new_id, preserving the position
	 * of the node.
	 * @param {number} new_id - Id of the node to replace this node with.
	 */
	this.replace = function(new_id){
		var f = this.formula;
		var par = this.parent();
		if(par != null){
			par.add_child_before(new_id, par.get_index(this.id));
			par.remove_child(par.get_index(this.id));
			this.parent_id = -1;
			f.get(new_id).parent_id = this.parent_id;
		}
		else{
			f.get(new_id).parent_id = -1;
			if(f.root().id == this.id){
				f.set_root(new_id);
			}
		}
		return this;
	}
	/**
	 * Remove the current node, replacing it with one of its child nodes. 
	 * @param {number} child_to_move up. If not defined, doesn't move up any children.
	 */
	this.remove = function(child_to_moveup){
		if(isUndefined(child_to_moveup)){
			var par = this.parent();
			par.remove_child(par.get_index(this.id));
			this.parent_id = -1;
		}
		else
			this.replace(child_to_moveup);
	}
	/**
	 * get the value of a particular property. To see which properties are available,
	 * refer to the NODES data structure.
	 * @param {string} key - The name of the property to get.
	 */
	this.data = function(key){
		return this._data[key];
	}
	/**
	 * set the value of a particular property.
	 * @param {string} key - name of property.
	 * @param {anything} value - value of property.
	 */
	this.set = function(key, value){
		this._data[key] = value;
	}
	/**
	 * set the parent of the current node, appending the node to the end of
	 * the parent's children, unless tofront=true (in which case, it is 
	 * inserted in the beginning)
	 *
	 * @param {string} id - id of desired parent 
	 * @param {boolean} tofront - if true, insert node in front.
	 */
	this.set_parent = function(id,tofront){
		var f = this.formula;
		this.parent_id = id;
		var par = f.get(id);
		if(par != null){
			par.add_child(this.id,tofront);
		}
	}
	/**
	 * get the parent node.
	 */
	this.parent = function(){
		var f = this.formula;
		return f.get(this.parent_id);
	}
	/**
	 * get the node at position i. See get_index for more info.
	 * @param {number} i - the index of the child to get.
	 */
	this.child = function(i){
		var f = this.formula;
		return f.get(this.children[i]);
	}
	/**
	 * Print the node and all its children (outputs the formula)
	 * + -> a+b+c
	 */
	this.print = function(){
		var f = this.formula;
		var str = "";
		var type = this.data('type');
		var op = this.data('op');
		if(type == "op" && op == "paren"){
			var chl = f.get(this.children[0]);
			if(chl != null){
				str += "(";
				str += chl.print();
				str += ")";
			}
		}
		else if(type == 'op'){
			for(var i in this.children){
				if(!f.has(this.children[i])) continue;
				var chl = f.get(this.children[i]);
				if(i > 0){
					str += (this.data('code'));
				}
				str += chl.print();
			}
		}
		else if(type == 'variable'){
			str = this.data('code');
		}
		else if(type == 'number'){
			str = (this.data('code'));
		}
		return str;
	}
	/**
	 * find all the nodes that are descendents of this node, including this node.
	 * TODO: change function name to descendents.
	 */
	this.ancestors = function(){
		var f = this.formula;
		var ancestors = function(d){
			var a = {};
			d.foreach_child(function(child){
				var child_id = child.id;
				a[child_id] = child;

				var anc = ancestors(child);
				for(var ancestor in anc){
					a[ancestor] = anc[ancestor];
				}
			});
			return a;
		}
		var a = ancestors(this);
		a[this.id] = this;
		return a;

	}
	/**
	 * copy the current node, inserting it into the formula nf. If no formula
	 * is provided, the formula the current node belongs to is used.
	 * @param {Formula} f - Formula to add node to.
	 */
	this.copy = function(nf){ // copy into potentially new Formula
		if(isUndefined(nf)) nf = this.formula;
		var n = nf.add(this.HANDLE);
		n._data = copyData(this._data);
		n.children = copyData(this.children);
		n.parent_id = this.parent_id;
		return n;
	}

	this.set_formula = function(f){
		this.formula = f;
	}
	this.get_formula = function(){
		return this.formula;
	}
	/**
	 * iterate over the subtree contained by this node, invoking the function
	 * cbk on each node.
	 * @param {function} cbk - Function to invoke on each node. Accepts node as first argument.
	 */
	this.foreach_subtree = function(cbk){
		cbk(this);
		this.foreach_child(function(node){
			cbk(node);
			node.foreach_subtree(node);
		});
	}
	/**
	 * find all the nodes that match a particular search expression.
	 * @param {string} expr - specially formed query. See formula.search
	 */
	this.find = function(expr){
		var f = this.formula;
		return f.find(expr, this.ancestors());
	}
	/**
	 * get the position of the child with the id 'id'
	 * @param {number} id - id number of child.
	 */
	this.get_index = function(id){
		for(var i=0; i < this.children.length;i++){
			if(this.children[i] == id) return i;
		}
		return -1;
	}
	this.copy_subtree = function(nf){ //copy into potentially new tree
		var f = this.formula;
		var anc = this.ancestors();
		var mappings = {};
		var nodes = {};
		//copy all elements
		for(a in anc){
			var el = anc[a].copy(nf);
			mappings[anc[a].id] = el.id;
			nodes[el.id] = el;
		}
		if(this.id == f.root().id){
			nf.set_root(mappings[this.id]);
		}
		for(var nid in nodes){
			var n = nodes[nid];
			if(n.parent_id in mappings){
				n.parent_id = mappings[n.parent_id];
			}
			else{
				n.parent_id = -1;
			}
			n.foreach_child(function(child,i){
				if(child.id in mappings){
					n.children[i] = child.id;
				}
				else{
					n.children[i] = -1;
				}
			})
		}
		return nodes;
	}
	this.init(f,handle);
}
var Formula = function(){

	this.init = function(){
		this.nodes = {};
		this.ID = 0;
		this.root_id = -1;
	}
	this.has = function(id){
		return (id in this.nodes);
	}
	this.set_root = function(id){
		this.root_id = id;
	}
	this.root = function(){
		return this.get(this.root_id);
	}
	this.add = function(handle){
		var node = new Node(this, handle);
		this.nodes[node.id] = node;
		return node;
	}
	this.fresh_id = function(){
		var id= this.ID;
		this.ID++;
		return id;
	}
	this.get = function(id){
		if(this.has(id)) return this.nodes[id];
		else return null;
	}
	this.copy = function(){
		var f = new Formula();
		this.root().copy_subtree(f);
		return f;
	}

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
			var combine = function(a,b){return a&&b};
			subexp = exp.split(' ');
		}
		var predicates = function(){return true;};
		for(var i=0; i < subexp.length; i++){
			var pred = subexp[i];
			if(pred.startsWith("#")){
				var check_id = parseInt(se.substring(1))
				var new_pred = function(comb,prev, checkid){
					return function(node){return comb( prev(node), checkid==node.id) }
				}(combine,predicates,check_id);
				var predicates = new_pred;
			}
			else if(pred.startsWith("%%")){
				var check_id = parseInt(se.substring(2));
				var anc = this.get(check_id).ancestors(this);
				var new_pred = function(comb,prev, anc){
					return function(node){return comb( prev(node), node.id in anc) }
				}(combine,predicates,anc);
				var predicates = new_pred;
			}
			else if(pred.startsWith("%")){
				var check_id = parseInt(se.substring(1));
				var new_pred = function(comb,prev, checkid){
					return function(node){return comb( prev(node), checkid==node.parent_id) }
				}(combine,predicates,check_id);
				var predicates = new_pred;
			}
			else {
				var args = pred.split(":");
				var key = args[0];
				var value = args[1];
				var new_pred = (function(comb,prev, key,value){
					return function(node){return comb( prev(node), node.data(key) == value) }
				})(combine,predicates,key, value);
				var predicates = new_pred;
			}
		}
		return predicates;
	}
	this.find = function(exp, from){
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
		return nodes;
	}


	this.toString = function(){
		return JSON.stringify(this.nodes,null,2);
	}
	this.print = function(){
		return this.root().print(this);
	}

	this.cleanup_and_reassign = function(){
		var tree = this.root().ancestors();
		var cnt = 0;
		var mapping = {};
		//initialize to 0
		for(var id in this.nodes){
			if(! (id in tree)){
				delete this.nodes[id];
			}
			else{
				mapping[id] = cnt;
				cnt++;
			}
		}
		for(var id in this.nodes){
			var node = this.nodes[id];
			node.id = mapping[node.id];
			node.parent_id = mapping[node.parent_id];
			for(var i=0; i < node.children.length; i++){
				node.children[i] = mapping[node.children[i]];
			}
			delete this.nodes[id];
			this.nodes[mapping[id]] = node;


		}
		this.root_id = mapping[this.root_id];
		this.ID = cnt;
	}
	this.cleanup = function(){
		var tree = this.root().ancestors();
		//initialize to 0
		for(var id in this.nodes){
			if(! (id in tree)){
				delete this.nodes[id];
			}
		}

	}
	this.init();
}
