
var copy = function(d){
	return JSON.parse(JSON.stringify(d,null,2))
}
var Comparer = (function(){
	this.strict = function(){
		var strict_cmp = function(a,b){
			return (JSON.stringify(a) == JSON.stringify(b));
		}
		return strict_cmp;
	}

	return this;
})()

var Matcher = (function(){
	this.fields = function(d){
		return function(o){
			for(var key in d){
				if(d[key].indexOf(o[key]) < 0)
					return false;
			}
			return true;
		}
	}

	return this;
})()
//define a matching rule, and a node equality test
var MatchExpr = function(){
	this.init = function(){
		this.root = null;
		this.parents = [];
		this.curr = null;
		this.curr_names = [];
	}
	this.init_ = function(root){
		this.init();
		this.root = root;
	}
	this._match = function(meta, data){
		var eq = Comparer.strict();
		if(meta.c.type == "concrete"){
			var res = meta;
			res.matches = meta.c.test(data);
			if(res.matches){
				var match_all = true;
				for(var cname in meta.c.children){
					var cmeta = {c:meta.c.children[cname], bindings:{}};
					var cres = this._match(cmeta, data[cname]);
					res.matches = res.matches && cres.matches;
					//update matching
					for(var b in cres.bindings){
						var nbnd = cres.bindings[b];
						if(res.bindings.hasOwnProperty(b)){
							var is_same = eq(res.bindings[b], nbnd);
							res.matches = res.matches && is_same;
						}
						res.bindings[b] = nbnd;
					}
				}
				if(res.matches){
					res.bindings[meta.c.name] = data;
				}
			}
			
			return res;

		}
		else if(meta.c.type == "hole"){
			var bindings = {};
			bindings[meta.c.name] = data;
			return {matches:true, bindings:bindings};
		}
	}
	this.match = function(data){
		//
		var meta = {c:this.root, bindings:{}, matches:true};
		var result = this._match(meta, data);
		if(result.matches){
			return {instance:this.copy(), bindings:result.bindings, matches:true};
		}
		else {
			return {instance:null, bindings:null, matches:true};
		}
		
	}
	this._add = function(c){
		this.curr = c;
		return this;
	}
	this.conc = function(label, test){ // match a concrete node.
		var c = {};
		c.type = "concrete";
		c.name = label;
		c.children = {};
		c.test = test;
		return this._add(c);
	}
	this.hole = function(label){
		var c = {};
		c.type = "hole";
		c.name = label;
		return this._add(c);
	}
	//match root
	this.get = function(name){
		var that = this;
		this.parents = []; //clear parents
		this.curr = null;
		var get_ = function(name, node){
			if(node.name == name){
				return node;
			}
			else {
				if(node.hasOwnProperty('children')){
					that.parents.push(node);
					for(var child in node.children){
						var res = get_(name, node.children[child]);
						if(res != null) return res;
					}
				}
				else{
					return null;
				}
			}
		}
		this.curr = get_(name, this.root);
		return this;
	}
	//delete current element from the tree
	this.remove = function(child_name){
		var curr = this.curr;
		var curr_name = curr.name;
		//if we have children, and an existing child to replace with, and are not the root node
		if(curr.hasOwnProperty('children') && !curr.children.hasOwnProperty(child_name) && this.parents.length > 0){
			console.log("ERROR: Cannot replace with nonexistent child");
		}
		
		//delete from parent if there is a parent
		if(this.parents.length > 0){
			var parent = this.parents[this.parents.length - 1];
			var parent_name = parent.name;
			delete parent.children[curr.handle];
		}
		else{
			//we are deleting the root node
			this.root = curr.children[child_name];
		}
		//if we are pushing up a child
		if(curr.hasOwnProperty('children') && this.parents.length > 0){
			var parent = this.parents[this.parents.length - 1];
			curr.children[child_name].handle = curr.handle;
			parent.children[curr.handle] = curr.children[child_name]; // set as parent node
		}
		this.curr = null;
		return this;
	}
	//replace current element in the tree with a concrete node.
	this.replace = function(new_name, test){
		var handle = this.curr.handle;
		this.child(handle);
		this.conc(new_name, test);
		this.done();
		this.remove(new_name);
	}
	this.insert = function(child_handle, new_name, test){
		this.child(child_handle);
		this.conc(new_name, test);
		this.done();
	}
	this.child = function(name){ //set a concrete node child.
		this.parents.push(this.curr);
		this.curr_names.push(name);
		this.curr = null;
		return this;
	}
	this.done = function(){
		if(this.parents.length > 0){
			var tmp = this.curr
			var name = this.curr_names.pop()
			this.curr = this.parents.pop();
			this.curr.children[name] = tmp;
			tmp.handle = name;
		}
		else {
			this.root = this.curr;
			this.curr = null;
		}
		return this;
	}
	this.copy = function(){
		var m = new MatchExpr();
		var rt = JSON.parse(JSON.stringify(this.root,null,2));
		m.init_(rt);
		return m;
	}
	this.init();
}

//given a binding, construct a new tree
var Transformation = function(){
	this.init = function(){
		this.steps = [];
		this.curr_binds = {};
		this.curr_step = {};
	}
	this.done = function(){
		this.steps.push({bindings:this.curr_binds, step:this.curr_step});
		this.curr_binds = {};
		this.curr_step = {};
		return this;
	}
	this.bind = function(k, d){
		this.curr_binds[k] = d;
		return this;
	}
	this.step  =function(d){
		this.curr_step = d;
		return this;
	}
	this.transform = function(binding, attach){
		var transform_step = function(node, nbinds, binds){
			var name = node.name;
			
			if(binds.hasOwnProperty(name)){
				var par = copy(binds[name]); //get data bindings
			}
			else if(nbinds.hasOwnProperty(name)){
				var par = copy(nbinds[name]);
			}
			else return null;
			//
			for(var handle in node.children){
				var res = transform_step(node.children[handle], nbinds, binds);
				attach(par, res, handle)
			}
			return par;
		}
		for(var i=0; i < this.steps.length; i++){
			var res = transform_step(this.steps[i].step, this.steps[i].bindings, binding);
		}

		return res;
	}

	this.init();
}

//match, transform
var Rule = function(){

	this.init = function(){
		this._match = null;
		this._transform = null;
	}
	//define a match expression
	this.create_matcher = function(){
		this._match = new MatchExpr();
		return this._match;
	}
	this.create_transform = function(){
		this._transform = new Transformation();
		return this._transform;
	}
	this.match = function(data){
		return this._match.match(data);
	}
	this.transform = function(data){
		return this._transform.transform(data);
	}
	this.init();
}


var distRule = new Rule();
//define match tree
distRule.create_matcher().conc('root', Matcher.fields({op:['mult']}))
	.child('left').hole('A').done()
	.child('right').conc('paren', Matcher.fields({op: ['paren']}))
		.child('exp').conc('BopC', Matcher.fields({op: ['plus','minus']}))
			.child('left').hole('B').done()
			.child('right').hole('C').done()
		.done()
	.done()
.done()

distRule.create_transform().step(
	{
	name:'paren', 
	children:{
				exp:{
					name:'BopC',
					children:{
						left:{name:'X', children:{
							left:{name:'A', children:{}}, 
							right:{name:'C', children:{}}
							}
						},
						right:{name:'X', children:{
							left:{name:'A', children:{}}, 
							right:{name:'C', children:{}}
							}
						},
					}
				}
			}
	}
)
.bind('X', {type:'op', op:'mult', code:"\\cdot", children:{left:null, right:null}})
.done()


function test(){
	DATA = parser.parse('a*(b+c)').data
	MATCHER = distRule.match(DATA)
	MINST = MATCHER.instance;
	MBIND = MATCHER.bindings;
	MFXN = function(parent, child, handle){
		parent[handle] = child;
	}
}
/*
distRule.transform()
	.replace('B', 
			(new ReplaceExpr()).conc("prodB").field({op:"mult",type:"op"})
				.child('left').hole("B'").done()
				.child('right').ref("B").done()
			.done()
			)
	.replace('C', 
			(new ReplaceExpr()).conc("prodC").field({op:"mult",type:"op"})
				.child('left').hole("C'").done()
				.child('right').ref("C").done()
			.done()
			)
	.move('A', "B'")
	.move('A', "C'")
	.remove('A')
	.remove('root', 'right') //remove and replace with child right
	.done();
*/