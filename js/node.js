//this is the class for nodes of the master tree
//handle most of the operations at this level

/**
 * Create a class the nodes of the master tree
 * @constructor
 * @param {string} f - What does f represent?
 * @param {string} handle - What does handle represent?
 */
var Node = function Node(f, handle, nid){
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
	 */
	this.foreach_child = function(cbk){
		var f = this.formula;
		for(var i=0; i < this.children.length; i++){
			//if(f.has(this.children[i])){
			if(!f.has(this.children[i])) console.error("lost child", this.children[i], "of", this, "in", f.nodes)
			cbk(f.get(this.children[i]),i);
			//}
			//else console.error("lost a child...")
		}
	}
	/**
	 * Add child before the node at position j.
	 * @param {number} child_id - The id number of the child to add.
	 * @param {number} j - the position to insert the child before. Refer to get_index
	 * for more info.
	 */

	this.add_child_before = function(child_id, j){
		var f = this.formula;
		f.get(child_id).parent_id = this.id;
		if(this.children.indexOf(child_id) < 0){
			this.children.splice(j,0,child_id);
		}
	}
	/**
	 * Add a child to the leftmost or rightmost position.
	 * @param {number} child_id - id number of child to add.
	 * @param {boolean} tofront - whether to add it before the first node.
	 */
	this.add_child = function(child_id, tofront){
		var f = this.formula;
		f.get(child_id).parent_id = this.id;
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
	 * remove the child at position j. 
	 * @param {string} j - position of child to remove.
	 * returns the orphaned child
	 */
	this.remove_child = function(j){
		var f = this.formula;
		var chil;
		if(j >= 0) {
			chil = this.children[j];
			//console.log(this.children)
			chil.parent = -1;
			this.children.splice(j,1); // removes that child.
		}
		return chil;
	}
	/**
	 * Initialize the node.
	 * @constructor
	 * @param {Formula} f - the formula to add the node to.
	 * @param {String} handle - The type of node to add. Must be a key in NODES.
	 * @param {int} nid - if want to force the id of the new element
	 */
	this.init = function(f,handle, nid){
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
		if (isUndefined(nid)) this.id = f.fresh_id();
		else {
			if(nid in f.nodes) log.error("warning: overwriting an existing node!")
			this.id = nid; 
			f.ID = Math.max(nid+1, f.ID);
		}
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
		if(par != null && par != -1){
			par.add_child_before(new_id, par.get_index(this.id));
			par.remove_child(par.get_index(this.id));
			f.get(new_id).parent_id = this.parent_id;
			this.parent_id = -1;
		}
		else{
			console.error("replacing root element?!")
			f.get(new_id).parent_id = -1;
			if(f.root().id == this.id){
				f.set_root(new_id);
			}
		}
		return this;
	}
	/**
	 * Remove the current node, replacing it with the passed in node 
	 * @param {number} child_to_move up. If not defined, doesn't move up any children.
	 */
	this.remove = function(child_to_moveup){
		if(isUndefined(child_to_moveup)){
			var par = this.parent();
			par.remove_child(par.get_index(this.id));
			this.parent_id = -1;
			//cleanup if leaving an orphaned * or +. moved to flatten():
			/*if((par.data('op') === 'mult' || par.data('op') === 'plus') && par.n_children() == 1){
				var grandpa = par.parent();
				grandpa.add_child_before(par.children[0], grandpa.get_index(par.id));
				par.remove();
			}*/
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
	 * lev - specifies current level in the tree, fl - true to display level and id
	 */
	this.print = function(lev, fl){
		var f = this.formula;
		var str = "";
		var type = this.data('type');
		var op = this.data('op');
		var curr_node=this;
		var show = function(ch){
			if(fl === 5.78) {
				var nid = curr_node.get_id();
				if (nid < 10) return "{"+lev+"," + curr_node.get_id() + " } ";
				else return "{"+lev+"," + curr_node.get_id() + "} ";
			}
			if (fl) return "   " + ch + "   ";
			return ch;
		}

		if(type == "op" && op == "paren"){
			var chl = f.get(this.children[0]);
			if(chl != null){
				str += show("(");
				str += chl.print(lev+1,fl);
				str += show(")");
			}
		}
		else if(type == 'op'){
			for(var i in this.children){
				if(!f.has(this.children[i])) {console.error("lost a child..");}
				var chl = f.get(this.children[i]);
				if(i > 0){
					str += show(this.data('code'));
				}
				str += chl.print(lev+1,fl);
			}
		}
		else if(type == 'variable'){
			str = show(this.data('code'));
		}
		else if(type == 'number'){
			str = show(this.data('code'));
		}
		return str;
	}
	/**
	 * find all the nodes that are descendents of this node, including this node.
	 */
	this.descendants = function(){
		var f = this.formula;
		var descendants = function(d){
			var a = {};
			d.foreach_child(function(child){
				var child_id = child.id;
				a[child_id] = child;

				var desc = descendants(child);
				for(var descendant in desc){ //descendant takes on the id values 
					a[descendant] = desc[descendant];
				}
			});
			return a;
		}
		var a = descendants(this);
		a[this.id] = this;
		return a;

	}
	/**
	 * copy the current node, inserting it into the formula nf. If no formula
	 * is provided, the formula the current node belongs to is used.
	 * @param {Formula} f - Formula to add node to.
	 * @param {int} nid - force the id of the new node to = nid
	 */
	this.copy = function(nf, nid){ // copy into potentially new Formula
		//var n_id = this.id; 
		if(isUndefined(nf)) {
			nf = this.formula;
		}
		//if(nf === this.formula) n_id = this.new_id(1)[0];
		var n = nf.add(this.HANDLE, nid);
		n._data = copyData(this._data);
		n.children = copyData(this.children);
		n.parent_id = this.parent_id;
		//n.id = n_id; 
		//console.log(n.id)
		return n;
	}

	
	//create a new unique id for a node (num - number of ids to return):
	/*this.new_id = function(num){
		var f = this.formula;
		var old_ids=[];
		var new_ids=[];
		for (var id in f.nodes) old_ids.push(id);
		var i = old_ids.length;
		while (new_ids.length < num){
			if(old_ids.indexOf(i.toString()) < 0) new_ids.push(i.toString());
			i++;
		}
		return new_ids;
	}*/
	

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
			node.foreach_subtree(cbk);
		});
	}
	/**
	 * find all the nodes that match a particular search expression.
	 * @param {string} expr - specially formed query. See formula.search
	 */
	this.find = function(expr){
		var f = this.formula;
		return f.find(expr, this.descendants());
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

	//copy into potentially new tree, and log in tranformation
	//if copying into the same tree, all ids in the copy are fresh
	//if copying into a new tree, all ids are kept the same
	// nf - tree to copy into
	// 
	this.copy_subtree = function(nf, log){ 
		var f = this.formula;
		//console.log(f.print())
		
		//if(this === f.root()) {var desc = f.nodes;
		//	console.log(desc, this.descendants())}
		var desc = this.descendants();
		var mappings = {};
		var nodes = {};
		var keep_id = nf.isEmpty();
		//copy all elements and add them to the nodes list of nf
		//console.log("before1", nf.nodes, mappings)
		for(a in desc){
			if(keep_id) var el = desc[a].copy(nf, desc[a].id); //if copying into a new tree, make sure to keep the same ids
			else var el = desc[a].copy(nf);
		
			//console.log("id check ",a,desc[a].id)
			mappings[desc[a].id] = el.id;
			if (!isUndefined(log)) log.map(desc[a].id, el.id);
			nodes[el.id] = el;
			//console.log("element",el.id, el, nodes[el.id])
		}
		//console.log(nf.nodes, mappings)
		// if(this === f.root()){
		// 	nf.set_root(mappings[this.id]);
		// }

		//set relationships (after mappings have been established):
		if(!keep_id){
			for(var nid in nodes){
				var n = nodes[nid];
				if(n.parent_id in mappings){
					n.parent_id = mappings[n.parent_id];
				}
				else{
					n.parent_id = -1;
					//console.error("could not copy parent")
				}
				for (var i =0; i < n.children.length; i++){
					if(n.children[i] in mappings){
						n.children[i] = mappings[n.children[i]];
						//console.log("new child id ", child.id, "to", mappings[child.id])
					}
					else{
						n.children[i] = -1;
						console.error("could not copy child")
					}
				}
			}
		}

		return nodes[mappings[this.id]];
	}

	this.init(f,handle, nid);
}
