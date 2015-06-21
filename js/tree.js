//this is the class for the master tree object
//note that most of the operations are handled by the child node class


var Formula = function Formula(){

	this.init = function(){
		this.nodes = {}; //all the nodes in the tree
		this.ID = 0; //max id of any node in the tree (for adding new nodes)
		this.root_id = -1; // id of root node
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
	this.add = function(handle, nid){
		var node = new Node(this, handle, nid);
		this.nodes[node.id] = node;
		return node;
	}
	this.isEmpty = function(){
		return (this.ID==0)
	}
	this.fresh_id = function(){
		var id= this.ID;
		this.ID++;
		//console.log("new id", id);
		return id;
	}
	this.get = function(id){
		if(this.has(id)) return this.nodes[id];
		else return null;
	}
	this.copy = function(){
		var f = new Formula();
		//this.cleanup();
		n_root = this.root().copy_subtree(f); // copy tree into f
		//console.log("copy results", n_root, f.nodes);
		f.ID = this.ID;
		f.root_id = this.root_id;
		if(this.print(true) !== f.print(true)){ 
			console.error("COPYING FAILED:", this.print(), this.nodes, "to", f.print(), f.nodes)
			console.log(f)
		}
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
				var check_id = parseInt(pred.substring(1))
				var new_pred = (function(comb,prev, checkid){
					return function(node){return comb( prev(node), checkid==node.id) }
				})(combine,predicates,check_id);
				predicates = new_pred;
			}
			else if(pred.startsWith("%%")){
				var check_id = parseInt(pred.substring(2));
				var anc = this.get(check_id).descendants(this);
				var new_pred = function(comb,prev, anc){
					return function(node){return comb( prev(node), node.id in anc) }
				}(combine,predicates,anc);
				var predicates = new_pred;
			}
			else if(pred.startsWith("%")){
				var check_id = parseInt(pred.substring(1));
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
	//Returns nodes matching criteria in exp from the form subtree (entire formula by default)
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
	//set fl to true to display levels with each node:
	this.print = function(fl){
		var str = this.root().print(0,fl);
		if (fl) str += ('\n' + this.root().print(0,5.78));
		return str;
	}

	//flatten the operations like mult or add:
	this.flatten = function(){
		var done = false;
		while(!done){
			done=true;
			for(var id in this.nodes){
				var top = this.nodes[id];
				if(top.data('op') === 'mult' || top.data('op') === 'plus'){
					var top_op = top.data('op');
					//remove orphaned * or + nodes:
					if(top.n_children() === 1){
						var grandpa = top.parent();
						if(grandpa) {
							grandpa.add_child_before(top.children[0], grandpa.get_index(top.id));
							top.remove();
						}
						continue;
					}
					//consolidate multi-layer * or + 
					top.foreach_child(function(mid){
						if(mid.data('op')==top_op){
							done=false;
							mid_idx = top.get_index(mid.id);
							//console.log('n1_idx',n1_idx)
							//top.remove_child(mid_idx);
							var ci=0;
							mid.foreach_child(function(ch){
								top.add_child_before(ch.id,mid_idx+ci);
								ci++; //to keep the children in the same order
							})
							mid.remove();
						}
					})
				}
			}
		}
	}

	//delete nodes not connected to tree, reassign ids (and log if transf is given)
	//also flatten the tree:
	this.cleanup_and_reassign = function(transf){
		var tree = this.root().descendants();
		var cnt = 0;
		var mapping = {};
		this.flatten();
		//initialize to 0
		for(var id in this.nodes){
			if(! (id in tree)){
				delete this.nodes[id];
			}
			else{
				mapping[id] = cnt;
				if (!isUndefined(transf)) { //if a transformation is passed in, update:
					transf.map_repl_new_el(id,cnt);
				}
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

	//Delete any nodes not actually connected to the root:
	this.cleanup = function(){
		var tree = this.root().descendants();
		//initialize to 0
		for(var id in this.nodes){
			if(! (id in tree)){
				delete this.nodes[id];
			}
		}

	}
	this.init();
}
