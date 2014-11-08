
var AnimationHandler_2 = function(){

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

	this.arc_path = function(Sx, Sy, Ex, Ey){ //Arc path creates a text string in the correct format used for creating a Bezier path
		//Sx  = absolute starting x point
		//Sy = absolute starting y point
		//Ex = end x point
		//Ey = end y point
		//returns a text string in the correct format used for raphael and svg paths

		console.log('in arc part')
		var Qx = (Sx + Ey)/2; //x-coordinate of the mid-point of the bezier curve
		var Qy = Sy - 100; //y-coordinate of the mid-point of the bezier curve. Note that this value usually does NOT exactly match the observed y-coordinate
		var spath = "M" + Sx + "," + Sy + "Q" + Qx + "," + Qy + "," + Ex + "," + Ey;
		return spath;
	}

	this.line_path = function(paper,sx, sy, ex, ey){ //line_path creates a straigh line path
		console.log('in length part')
		line_path_input = "M" + sx + "," + sy + " L" + ex + "," + ey;
		dummy_rect = paper.rect(v_original.getBBox().x, v_original.getBBox().y,20, 20);
		return line_path_input;
	}

	var animation; //Ask Colm what this means.
	this.animate_along_a_path = function(raph_object,Ex,Ey)
	{
		//This function animates an input (input description below) along a given path (which could be an arc or a line)
		//paper = Raphael paper on which we will perform the animation
		//raph_object = "Item" (which could be a Raphael Set, or a simple Raphael element)  which we want to animate along a path
		//ex = Absolute end point x-coordinate
		//ey = Absolute end point y-coordinate

		var Sx = (raph_object.getBBox().x + raph_object.getBBox().x2) / 2; //Defines start x position
		var Sy = (raph_object.getBBox().y + raph_object.getBBox().y2) / 2;// + v_original.getBBox().y2) / 2; //Defines start y position
		var myPath_text_string = this.arc_path(Sx, Sy, Ex, Ey); //Get the correct bezier text string
		var raphPath = paper.path(myPath_text_string); //Create the bezier path

		raphPath.attr(
		{
			"stroke-opacity": 0.2
		})

		var counter = 0;    // a counter that counts animation steps
		//var c = paper.rect(raph_object.getBBox().x, raph_object.getBBox().y, raph_object.getBBox().width, (raph_object.getBBox().y2 - raph_object.getBBox().y)); //Draw a rectangle around object for debugging purposes
		//dummy_circle = paper.circle(raph_object.getBBox().x, raph_object.getBBox().y,1); //Draw a circle to mark the object movement for debugging purposes

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

			//c.remove(); //Remove rectangle (for debugging purposes)
			var transform_input = "T" + (final_pos.x) + "," + (final_pos.y); //Capital "T" uses absolute positions while "t" does relative positions
			raph_object.attr({x: final_pos.x, y: final_pos.y});
			//raph_object.animate({transform: transform_input},10);//raph_object.transform(transform_input); This does the animation between two points

			//console.log(final_pos);

			counter=counter+3; // Increase increment to increase speed
			//c = paper.rect(raph_object.getBBox().x, raph_object.getBBox().x, raph_object.getBBox().y,1); //for debugging
		};

		animation = window.setInterval(this.animate, 10);  //execute the animation function all 10ms (Smaller value increases speed)

		//var path = new AnimationHandler_2().animate_arc(v_original, 250, 100);
		//v_original.transform("T100,100")
		return myPath_text_string;
	}
	return 1;
}


function animate_sim(in1,in2) //This dummy function is used to test my ability to animate two raphael objects simulataneously
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


