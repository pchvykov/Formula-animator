//Class for the object formula, containing all the necessary properties:

//note: currently Rtree is created each time right before use.


Equation = function(form, paper, coord){
	this.master; //master tree
	this.Rtree; //Raphael tree
	this.Rcoord = [10,10]; //origin coord. in Paper
	this.gui_fl = true; //gui on the eq.
	this.format = {fontz:23, spacing:6}; //formatting
	this.R = Raphael(30, 300, 400, 50); //the Raphael paper
	//this.R.ID = 0;
	this.R.canvas.style.backgroundColor = '#FFF';
	this.map = {}; //mapping between ids of the Rtree : ids of the master (this.map[Rid] = mid)
	this.anim_t = 500; this.long_anim_t = 2000; //time in ms for the flow animation; long for nice one
	//var cursor = this.Rcoord; //current cursor position
	var debug = false; //flag to show some useful output

	this.forEl = function(elfn, el) { //Execute the function for all elements in set (not sets)
		if (isUndefined(el)) el = this.Rtree;
		var eq = this;
	    el.forEach(function(sel) {
	        if(sel.constructor.prototype ==  Raphael.st) {
	            eq.forEl(elfn, sel);
	        }
	        else {
	            elfn(sel);
	        }

	    })
	}

	//return array of R-tree ids for a given master tree id
	this.get_R_id = function(mid){
		var res = [];
		for(id in this.map){
			if(this.map[id] == mid){
				res.push(id)
			}
		}
		return res;
	}


	/**
	 * Creates a node for the Raphael tree, with all the desired properties
	 * @param {tree node} inp - node from master tree to create the Raphael object for
	 * @param {R.set} parent_set - Raphael set that the node will be in
	 * @param {paper} paper - Raphael paper to add the node to
	 */
	var create_node = function(inp, parent_set){
		var R = parent_set.paper;
		var text_object = R.text(); //Create text object
		text_object.code = inp.data('code');
			//console.log(inp.data('code'))
		text_object.attr({'text-anchor': 'start'});
		text_object.parent = parent_set; //Create custom attribute which saves the parent node
		parent_set.push(text_object);
		text_object.myEq=parent_set.myEq;
		
		var i = 1;
		while(R.getById(i) != null){ i++; }//guarantee that the new id is unique in the paper
		text_object.id = i; //Create a custom 'ID' attribute to label nodes
		parent_set.myEq.map[i] = inp.id;
		//R.ID++;
		return text_object;
	}


	/**
		 * Scan the master tree and return the Raphael tree for it (but not displayed yet)
		 * @param {tree} input - the master tree
		 * @param {paper} paper - Raphael paper to create tree in
		 */
	this.make_Rtree = function() {
		var R = this.R;
		
		//Recursive function to scan with:
		var visit_child = function(node, idx, pset){

			if (node.n_children() == 0){
				create_node(node, pset);
			}
			else if (node.data('op') == 'paren'){
				//Left parenthesis
				var pl = create_node(node,pset);
				//pl.id = node.get_id();
				pl.code = '(';

				visit_child(node.child(0), idx, pset);

				//Right parenthesis
				var pr = create_node(node,pset);
				//pr.id = node.get_id()+0.1;
				pr.code = ')';
			}
			else{	
				var op_i = 0;
				node.foreach_child(function(child, cidx){
					if(cidx > 0){ //create nodes for the operators + and *:
						var op = create_node(node,pset);
						op.op_i = op_i; //label the operators sequentially
						op_i++;
						//op.id += cidx/100; //distinct ids for each instance of the repeated operator (e.g., '+')
					}
					var cset = R.set();
					cset.myEq=pset.myEq;
					pset.push(cset);
					visit_child(child,cidx,cset);
				})

			}
		}
		//this.R.clear();
		if(!isUndefined(this.Rtree)) this.Rtree.remove();
		// if (!isUndefined(this.Rtree)) {
		// 	this.forEl(function(el){el.remove()})
		// 	this.Rtree.clear();
		// 	//console.log("removing")
		// }
		this.Rtree=R.set();
		this.map = {};
		var node = this.master.root();
		//console.log(this.R)
		this.Rtree.myEq=this;
		visit_child(node, 0, this.Rtree);
		if(debug) console.log("map: ", this.map);
		if(this.gui_fl) manip_gui(this);
		//return;
	}



	//traverse Raphael sub-tree from "top" node left to right, executing function cbk on each leaf
	//and moving the cursor through, setting coordinates of all elements sequentially and displaying them
	this.display = function(cbk,top,cursor){
		//if(this.gui_fl){
		this.make_Rtree();

		if (isUndefined(top)) top = this.Rtree;
		if (isUndefined(cursor)){ cursor = this.Rcoord.slice(0);}
		//if (isUndefined(cbk)) cbk = function(el){};
		var offset = this.format.spacing;
		var fontz = this.format.fontz;

		var iterate = function(cbk,top,cursor){
			if(top.constructor.prototype == Raphael.el) { //If it's an element
				if(top.code == ')') cursor[0]-=offset/2;
				cursor[0]+=offset;
				top.attr(
				{
					x: cursor[0], 
					y: cursor[1],
					text: toUnicodeCharacter(top.code), 
					"font-size": fontz
				}); 
				if(!isUndefined(cbk)) cbk(top); 
				cursor[0] = top.getBBox().width + cursor[0];
				if(top.code == '('){
					cursor[0]-=offset/2;
				}
			}
			else //if it's a set
			{
				
				for(var i=0; i<top.length; i++){
					cursor = iterate(cbk, top[i],cursor);
				}			
			}
			return cursor;
		}

		iterate(cbk,top,cursor);
	}

	//quick preview animation:
	this.flow_from = function(eq_old, transf){
		var R_old = eq_old.R;
		var eq = this;
		var flow_el = function(elt){
			//Find the old ID corresponding to the current new element:
			var old_id = eq_old.get_R_id(transf.from(eq.map[elt.id]));
			//console.log(old_id)
			if(elt.code == '(') old_id = old_id[0];
			if(elt.code == ')') old_id = old_id[1];
			var start_el = R_old.getById(old_id);
			//console.log('ids:', elt.id, old_id)
			if(start_el != null){
				//store the destination location:
				destx=elt.attr('x');
				desty=elt.attr('y');
				//Set the starting position to that in the old equation:
				elt.attr(
					{
						x: start_el.attr('x'),
						y: start_el.attr('y')
					});
				//straight animation for roll-over proposed transformation
				elt.animate(
					{
						x: destx, 
						y: desty
					},eq.anim_t,"bounce");
			
			}
			else{ // if element was not present in the original, fade it in
				elt.attr(
				{
					opacity:0
				});
				var fade = Raphael.animation({opacity:1}, eq.anim_t);
				//if (nice_fl) elt.animate(fade.delay(long_anim_t-anim_t));
				elt.animate(fade);
			}
		}
		this.display(flow_el);
	}

	//nice animation, also sets gui:
	this.animate_from = function(eq_old, transf){
		var eq = this;
		var R_old = eq_old.R;
		var R = this.R;
		var long_anim_t = this.long_anim_t;
		var anim_t = this.anim_t;
		//Animate along a path - custom attribute:-----------------
		//Array to store paths for all the elements
		var paths = [];
		//along: [5, 0.3] - go to 30% of the way along path 5
		this.R.customAttributes.along = function (n, v) {
	        var point = paths[n].getPointAtLength(v * paths[n].getTotalLength());
	        return {
	            transform: "t" + [point.x, point.y]// + "r" + point.alpha
	        };
	    };

	    //Create an array with all old R ids of the expression being moved - for distribution
		var d_ids = [];
		//console.log(transf.get('top'),eq_old.get_R_id(transf.get('top')),R_old.getById(eq_old.get_R_id(transf.get('top'))[0]))
		this.forEl(function(el){d_ids.push(el.id.toString())}, R_old.getById(eq_old.get_R_id(transf.get('top'))[0]).parent);
		//console.log(d_ids);
		//console.log(elt.id);

		var anim_el = function(elt){
			//Find the old ID corresponding to the current new element:
			var old_id = eq_old.get_R_id(transf.from(eq.map[elt.id]));
			switch (elt.code){
				case '(': old_id = old_id[0]; break;
				case ')': old_id = old_id[1]; break;
				case '+':
				case '*': old_id = old_id[elt.op_i]; break;
				default:  old_id = old_id[0];
			}
			var start_el = R_old.getById(old_id);
			//console.log('ids:', elt.id, old_id)
			if(start_el != null){
				//store the destination location:
				destx=elt.attr('x');
				desty=elt.attr('y');
				//Set the starting position to that in the old equation (R_old and R must be aligned!):
				elt.attr(
					{
						x: start_el.attr('x'),
						y: start_el.attr('y')
					});

				//condition on type of transformation goes here - assume disribution for now

				//check if the current element is in the part being moved, and animate along a path
				//console.log(d_ids, old_id)
				if(d_ids.indexOf(old_id)>-1){
					//console.log('in');

					//Create the path for animation:
					var	Ex=destx-elt.attr('x'), Ey = desty-elt.attr('y'),
						midx = Ex/2, midy = -80;
					//console.log('in',elt.id, Ex)
					var p  = R.path("M" + 0 + "," + 0 + "Q" + midx + "," + midy + "," + Ex + "," + Ey);
					p.attr({opacity:0});
					//console.log("path", p)

					//Animate along path[n] = p:
					var n = paths.length;
					paths.push(p);
					elt.attr({along: [n, 0]});
					elt.animate({along: [n, 1]}, long_anim_t, "<>");  
					//animateAlong(elt, path, long_anim_t);
				}
				//Straight animation for everything not being distributed
				else{
					elt.animate(
					{
						x: destx, 
						y: desty
					},long_anim_t);
				}
					
		
			}
			else{ // if element was not present in the original, fade it in
				elt.attr(
				{
					opacity:0
				});
				var fade = Raphael.animation({opacity:1}, eq.anim_t);
				elt.animate(fade.delay(long_anim_t-anim_t));
			}
		}
		this.display(anim_el);
		if(this.gui_fl) manip_gui(this);
	}


	/*
	//Update the Rtree and displayed eq. from the master tree.
	this.refresh = function(){
		this.make_Rtree();
		this.display();
	}*/

	//copies the whole equation structure into the SAME paper, but does not display the new one or set the gui for it.
	this.copy = function(){
		var form_c = this.master.copy();
		var f = new Equation(form_c);
		f.Rcoord = this.Rcoord.slice(0); //origin coord. in Paper
		f.format = copyData(this.format); //formatting
		//var psize = [this.R.canvas.offsetLeft, this.R.canvas.offsetTop, this.R.width, this.R.height];
		//console.log(psize);
		//f.R = new Raphael($("#formula_container")[0],screen.width, screen.height/2); //the Raphael paper
		//f.R = new Raphael(this.R.canvas.parentElement);//, this.R.width, this.R.height);
		//f.R.canvas.style.backgroundColor = this.R.canvas.style.backgroundColor;
		f.R = this.R;
		f.map = copyData(this.map);
		//f.R.ID = 0;
		f.anim_t = this.anim_t; f.long_anim_t = this.long_anim_t; //time in ms for the flow animation; long for nice one
		f.gui_fl = this.gui_fl;

		//console.log(this.Rtree)
		return f;
	}
	
	this.delete = function(){
		if(!isUndefined(this.Rtree)) this.Rtree.remove();
		for(n in this.master.nodes) delete this.master.nodes[n];
	}

	this.distribute = function(holdid,dropid){
		//if(isUndefined(map) && isUndefined(this.Rtree)) this.make_Rtree();
		//if(!isUndefined(map)) this.map=copyData(map);
		//backend transformation
        var rule = new Transforms.Distribute();
        var results= rule.find('src:'+this.map[holdid]+' dest:'+this.map[dropid], this.master)

	        if(debug) {
	        	console.log(this.master.print(true))
	        	console.log("holding:", holdid, " dropping:", dropid);
	        	console.log('src:'+this.map[holdid]+' dest:'+this.map[dropid]);
	        }
	        if (results._len > 1){console.error(results._len+' possibilities!!! choosing first one...')}
	        if (results._len == 0){console.error('no options found!'); return undefined;}

        var transf = rule.apply(results.get(0))

	    	if(debug) {
	        	console.log(results.get(0), transf.get('top'), 'results')
	        	console.log(this.master.print(true))
	        }
        return transf
	}

	this.init = function(form, paper, coord){
		if(!isUndefined(paper)){
			this.R = paper;
			//if(isUndefined(paper.ID)) this.R.ID = 0;
		}
		if(!isUndefined(coord)) {this.Rcoord = coord};
		//console.log(this.R)
		if(isUndefined(form)) console.error("input is required to create Equation")
		if (typeof(form)=="string"){
			this.master = parser.parse(form);
			//console.log("test1")
		}
		else this.master = form;
		//if(!isUndefined(gui_fl)) this.gui_fl = gui_fl;
		//this.make_Rtree();	
	}

	this.init(form, paper, coord);
}

