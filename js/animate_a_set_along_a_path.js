paper = SVG;
var AnimationHandler_2 = function(){
	// this.init = function(){
	// 	this.callbacks = {};
	// }
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

	this.arc_path = function(sx, sy, ex, ey){ //Arc path creates a bezier-curve path
		console.log('in arc part')
		var qx = (sx + sy)/2;
		var qy = sy - 100;
		var spath = this.path([{x:sx,y:sy}, {x:qx, y:qy},{x:ex, y:ey}]);
		return spath;
	}

	this.animate_arc = function(raph_object,ex,ey)
	{
		var sx = (v_original.getBBox().x + v_original.getBBox().x2) / 2; //Defines start x position
		var sy = (v_original.getBBox().y + v_original.getBBox().y2) / 2; //Defines start y position
		var myPath = this.arc_path(sx, sy, ex, ey);
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

			var final_pos = raphPath.getPointAtLength(counter);   //get the position (see Raphael docs)
			var initial_pos = [v_original.getBBox().x,v_original.getBBox().y];
			
			var x_offset = final_pos.x - initial_pos[0];
			var y_offset = final_pos.y - initial_pos[1];

			var transform_input = "t" + x_offset + "," + y_offset;
			//var transform_input = "T" + (final_pos.x - v_original.getBBox().width/2) + "," + final_pos.y; //Capital "T" uses absolute positions while "t" does relative positions
			v_original.transform(transform_input);

			counter=counter+1; // Increase increment to increase speed
		};

		var animation = window.setInterval(this.animate, 10);  //execute the animation function all 10ms (Smaller value increases speed)
		//var path = new AnimationHandler_2().animate_arc(v_original, 250, 100);
		//v_original.transform("T100,100")
		console.log('edwin')
		return myPath;
	}
	return 1;
}
