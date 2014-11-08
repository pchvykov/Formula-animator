var AnimationHandler = function(){
	console.log('in top part')
	//var keeps AnimationKandler scope within this script...
	//var declares local variable
	//alternatively we could write: function AnimationHandler(){
	//but this has the risk of becoming global
	this.init = function(){
		this.callbacks = {};
	}
	this.path = function(pts){
		
		var res = "";
		var sx = pts[0].x;
		var sy = pts[0].y;
		var ex = pts[pts.length-1].x;
		var ey = pts[pts.length-1].y;

		res = res + "M " + sx + " " + sy + " " 
		for	(var index = 1; index < pts.length -1; index +=1) {
    		var qx = pts[index].x;
    		var qy = pts[index].y;

    		res+= " " + "q" + " " + (qx-sx) + " " + (qy-sy);

		}
		res += " " +  ex + " " + ey;
		return res;
	}

	//this.arc = function(name, sx, sy, ex, ey, duration){
	this.arc_path = function(name, Sx, Sy, Ex, Ey){
		sx=Sx;
		sy=Sy;
		ex=Ex-sx;
		ey=Ey-sy;
		console.log('in arc part')
		var qx = (sx + sy)/2;
		//var qy = sy - (((3)^0.5)/2)*(ex-sx);
		var qy = sy - 100;



		var spath = this.path([{x:sx,y:sy}, {x:qx, y:qy},{x:ex, y:ey}]);

		return spath;
		//return name;
	}


	this.animate_arc = function(raph_object,ex,ey)
	{
		var sx = raph_object.attr('x');
		var sy = raph_object.attr('y');
		var raph_name = raph_object.attr('id');

		var myPath = this.arc_path(raph_name, sx, sy, ex, ey);
		var raphPath = paper.path(myPath);
		raphPath.attr(
		{
			"stroke-opacity": 0.2
		})

		var counter = 0;    // a counter that counts animation steps

		this.animate = function() //function animate()
		{

			console.log("boom!!!")
			if(raphPath.getTotalLength() <= counter)
			{   //break as soon as the total length is reached
	   		 	clearInterval(animation); //without this line animate function well execute forever
	   		 	//you won't notice it executing forever because counter>myPath.getTotalLength()
	    		return;
			 }

			var pos = raphPath.getPointAtLength(counter);   //get the position (see Raphael docs)
			raph_object.attr({x: pos.x, y: pos.y});  //set the object position

			counter=counter+1; // Increase increment to increase speed
		};

		var animation = window.setInterval(this.animate, 10);  //execute the animation function all 10ms (Smaller value increases speed)
		
		return myPath;
	}

	// this.distribution_compare = function(intial_set, final_set, counter) //This function compares two raphael sets and has two outputs. The first output is the element which is being distributed.
	// //The second is the element into which the first output is being distributed. e.g. initial: a*(b+c)*(d+e)  = f; final: (b + c)*(a*d + a*e) = f; The output is "a" and "(d + e)"
	// {
	// 	for	(var index = 0; index < initial_set.length; index++)
	// 	{
	// 		var dummy = initial_set[index];
	// 		if (dummy.constructor.prototype == Raphael.st)
	// 		{
	// 			distribution_compare(dummy, final_set)
	// 		}
	// 		else
	// 		{
	// 			found_id = dummy.id;
	// 			for (var index = 0; index < set_of_found_ids.length; index++)
	// 			{
	// 				if (found_id == set_of_found_ids[index].id)
	// 				{
	// 					set_of_found_ids[index].code('count')++;
	// 				}
	// 				else //if found_id is new
	// 				{

	// 				}
	// 			}
	// 		}
	// 		//First identify which elements have remained the same, so that we can then identify 
	// 	}
	// }

	this.init();
}

//anim = new AnimationHandler();