//Store the animated previous manipulations and make them accessible. 


/*Some syntax from Sara's part - needed for any animation:
obj = rule.apply(resutls...);
then:
obj.to(oldid)
convert an old id to a new id
obj.from(newid)
convert a new id to the originating id
obj.get('paren')
get the id of the top + node inside where distributing
obj.get('top')
get the id of top node of expression being distributed

*/


//Class for a stored equation
var Operation = function(oldf, newf, transf, orig, memID, mem){


	//Execute on double-click
	//Draws the pre-transoformation formula, and animates the transformation
	var oper = this;
	var run_anim = function(){
		this.attr({cursor: "default"})

		//Draw the original formula
		var mID = this.memID;
		eq0.master = oper.oldf.copy();
		eq0.display();
		//console.log(ops[n].oldf.print(true), "\n", ops[n].newf.print(true))

	    //sleep(1000);
	    document.getElementById('button').onclick = function() {
	    //console.log(110, n, ops[n].new)
	    // setTimeout(function())
	    	oper = oper.mem.ops[mID];
		    eq0.master = oper.oldf.copy();
			eq0.display();

	    	var eq1 = eq0.copy();
	    	eq1.master = oper.newf.copy();
	    	//eq0.display();
	    	eq0.Rtree.attr({opacity:0});
		    eq1.animate_from(eq0, oper.transf);
		    eq0.delete();
		    eq0=eq1;
		    //workaround since the gui isn't being setup correctly after the animation (some timing issue..)
		    setTimeout(function(){eq0.display()}, eq0.long_anim_t+10); 
		    //sleep(eq0.long_anim_t);
		    //eq0.display();

		    mID++;
		    
		    
		}

		//make_room(SVG.getById(ops[n].transf.get('top')).parent, SVG.getById(ops[n].transf.get('paren')).parent,0);
		//console.log('done animating')
		// make_room(distributor,distributee,0);
	}

	//Initialization:
	/**
		 * store the manipulation in an array, and also in the side-bar
		 * @param {tree} oldf - backend tree for the old formula
		 * @param {tree} newf - backend tree for the new formula
		 * @param {obj} transf - transformation object returned by rule.apply(..)
		 */
	this.format = {fontz:15, spacing:3}; //formatting
	this.oldf = oldf; //old master tree
	this.newf = newf; //new tree
	this.transf = transf; //the transformation
	this.mem = mem; //parent memory class
	this.origin = orig; //origin coordinates in the paper
	this.memID = memID; //id of this element in the memory class

	//Draw the side-panel functions
	this.eq = new Equation(oldf, mem.R, orig);
	this.eq.format = this.format;
	this.eq.gui_fl = false;
	this.eq.display();
	// var oper = this;
	this.eq.forEl(function(el){el.memID = memID});
	this.eq.Rtree.dblclick(run_anim)

	//return this;
}


//Class for the entire memory box:
Memory = function(paper){
	this.step = 50;
	this.R = paper;
	this.ops = []; //array to store the operations

	this.add_op = function(oldf, newf, transf){
		var id = this.ops.length;
		if(id>0) var orig = this.ops[id-1].origin;
		else var orig = [30,10]
		this.ops.push(new Operation(oldf, newf, transf, [orig[0], orig[1]+this.step], id, this));
	}
}