
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

	this.line_path = function(sx, sy, ex, ey){ //Arc path creates a bezier-curve path
		console.log('in length part')
		line_path_input = "M" + sx + "," + sy + " L" + ex + "," + ey;
		//console.log(v_original.getBBox());
		dummy_rect = paper.rect(v_original.getBBox().x, v_original.getBBox().y,20, 20);
		//var line = paper.path( line_path_input);
		return line_path_input;
	}


	this.animate_arc = function(raph_object,ex,ey)
	{
		var sx = (raph_object.getBBox().x);// + v_original.getBBox().x2) / 2; //Defines start x position
		var sy = (raph_object.getBBox().y)+ 100;// + v_original.getBBox().y2) / 2; //Defines start y position
		var myPath = this.arc_path(sx, sy, ex, ey);
		var raphPath = paper.path(myPath);
		//var myPath = this.line_path(sx, sy, ex, ey);
		//var raphPath = paper.path(myPath);


		raphPath.attr(
		{
			"stroke-opacity": 0.2
		})

		var counter = 0;    // a counter that counts animation steps
		var c = paper.rect(raph_object.getBBox().x, raph_object.getBBox().y, raph_object.getBBox().width, (raph_object.getBBox().y2 - raph_object.getBBox().y));
		dummy_circle = paper.circle(raph_object.getBBox().x, raph_object.getBBox().y,1);
		//console.log(raph_object.getBBox());
		alert("Click to see animation!");

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
			
			//var initial_pos = [v_original.getBBox().x,v_original.getBBox().y];
			//var x_offset = final_pos.x - initial_pos[0];
			//var y_offset = final_pos.y - initial_pos[1];
			//var transform_input = "t" + x_offset + "," + y_offset;
			c.remove();
			var transform_input = "T" + (final_pos.x-60) + "," + (final_pos.y-15); //Capital "T" uses absolute positions while "t" does relative positions
			raph_object.transform(transform_input);

			//console.log(final_pos);

			counter=counter+3; // Increase increment to increase speed
			c = paper.rect(raph_object.getBBox().x, raph_object.getBBox().y, raph_object.getBBox().width, (raph_object.getBBox().y2 - raph_object.getBBox().y));
			dummy_circle = paper.circle(raph_object.getBBox().x, raph_object.getBBox().y,1);
		};

		var animation = window.setInterval(this.animate, 10);  //execute the animation function all 10ms (Smaller value increases speed)

		//var path = new AnimationHandler_2().animate_arc(v_original, 250, 100);
		//v_original.transform("T100,100")
		return myPath;
	}
	return 1;
}

function animate_sim(in1,in2)
{
	first_animation = Raphael.animation({transform: "t200,0"}, 1000);
	second_animation = Raphael.animation({transform: "t200,0"}, 1000);
	//in1.animate(first_animation);
	//in2.animate(second_animation);
	in1.animate({transform: "t200,0"}, 1000);
	in2.animate({transform: "t200,0"}, 1000);
	//in2.animateWith(in1, first_animation, first_animation);
	return;
}


