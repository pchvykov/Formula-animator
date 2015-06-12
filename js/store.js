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

//Array to store the operations:
var ops = new Array();
var orig = [15,30]; step = 50; 

//Execute on double-click
//Draws the pre-transoformation formula, and animates the transformation
var run_anim = function(){
	this.attr({cursor: "default"})
	var R = main_eq.R_form.paper;
	R.clear();
	var n=this.num;
	//console.log(ops[n].old.print())

	//Draw the original formula
	var v = draw_it(ops[n].oldf.copy(), main_eq.origin, true, R, main_eq.fontz);

    //sleep(1000);
    document.getElementById('button').onclick = function() {
    //console.log(110, n, ops[n].new)
    // setTimeout(function())
    v=flow_it(R, ops[n].newf, ops[n].transf, true);
    R.remove();
    main_eq.R_form = v;
	}

	//make_room(SVG.getById(ops[n].transf.get('top')).parent, SVG.getById(ops[n].transf.get('paren')).parent,0);
	//console.log('done animating')
	// make_room(distributor,distributee,0);
}

/**
	 * store the manipulation in an array, and also in the side-bar
	 * @param {tree} oldf - backend tree for the old formula
	 * @param {tree} newf - backend tree for the new formula
	 * @param {obj} transf - transformation object returned by rule.apply(..)
	 */
function add_op(oldf, newf, transf){
	var op_num = ops.length;
	ops.push(
	{
		'oldf':oldf,
		'newf':newf,
		'transf':transf
	});

	//Draw the side-panel functions
	eq = draw_it(newf, [orig[0], orig[1]+ step*(op_num)], false, Mem, 15);
	forEl(eq, function(el){el.num = op_num;});
	eq.dblclick(run_anim)
}


