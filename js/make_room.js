function make_room(distributor,distributee,idle_sets)
{
	//This function will be explained by an example:
	//Suppose the original set is: (a + b)*((c + d) + (e + f))*(g + h)
	//And the final result is: ((a + b)*(c+d) + (a+b)*(e + f))*(g + h)
	//Then the inputs to this function are defined as:
	//distributor: (a + b)
	//distributee: (c + d) and (e + f)
	//idle_sets: (g + h)

	//The output is a set as follows: (________(c + d) + _______(e + f))*(g+h)
	//Where the lines represent empty space


	var empty_space_width = distributor.getBBox().width; //Get the empty space we need to create
	var array_of_relative_movements = [];
	var multiplier = 1;
	var number_of_plus_signs = 0;
	var BBox_of_plus_signs = [];
	var array_of_clones = [];
	var array_of_relative_movements_of_plus_signs = [];

	//Now we find all the items that are not elements
	//distributee[0] <=> 1st bracket
	//distributee[distributee.length-1] <=> last bracket
	for	(var index = 1; index < distributee.length; index +=1)  //Index begins from '1' and not '0' because the first element of the distributee is always a bracket '(' and should not be moved
	{
		//array_of_relative_movements[i] = empty_space_width;
		if (distributee[index].data('code') == '+')//If item is an element whose code is the plus sign then proceed to shift everything to its right.
		{
			array_of_relative_movements[index] = multiplier*empty_space_width;
			multiplier +=1;
			console.log('Incremented multiplier');
			BBox_of_plus_signs[number_of_plus_signs] = distributee[index].getBBox();
			array_of_relative_movements_of_plus_signs[number_of_plus_signs] = multiplier*empty_space_width;
			number_of_plus_signs += 1;

		}
		else
		{
			array_of_relative_movements[index] = multiplier*empty_space_width;
		}
	}

	document.getElementById('button').onclick = function() 
	{

		//We need as many clones as there are plus signs.
		for (var index = 1; index <= number_of_plus_signs; index +=1)
		{
			array_of_clones[index] = distributor.clone(); //Make a clone of the distributor
		}
		array_of_clones[0] = distributor; //The original distributor takes the 0th position in the array of clones table.

		//There are two different sets of movements going on here.
		//1. The distributee items will be moving to "make room"
		//2. The distributor and its clones will be moving in to the room left by step 1.

		//Below we determine the end points for the the movement of the original distributor clone just after the first bracket and then animate the movement.
		var Ex_original_clone = distributee[0].getBBox().x + distributee[0].getBBox().width + distributor.getBBox().width/2;
		var Ey_original_clone = (distributor.getBBox().y + distributor.getBBox().y2)/2;

		path = new AnimationHandler_2().animate_along_a_path(array_of_clones[0], Ex_original_clone, Ey_original_clone); //First we animate the original "distributor"


		//Below we determine the end points for the the movement of the other distributor clones and animate their movements.
		for (var index = 1; index <= number_of_plus_signs; index +=1)
		{
			var Ex = BBox_of_plus_signs[index-1].x + array_of_relative_movements_of_plus_signs[index - 1];
			var Ey = Ey_original_clone;
			//path = new AnimationHandler_2().animate_along_a_path(array_of_clones[index], BBox_of_plus_signs[index-1].x + array_of_relative_movements_of_plus_signs[index - 1]  , BBox_of_plus_signs[index-1].y);
			path = new AnimationHandler_2().animate_along_a_path(array_of_clones[index], Ex, Ey);
			console.log(index)
		}

		//Below is a "for" loop that animates "make room"
		for (var index = 1; index < distributee.length; index +=1) //Index begins from '1' and not '0' because the first element of the distributee is always a bracket '(' and should not be moved
		{
			distributee[index].animate({transform: "t" + array_of_relative_movements[index] + "," + "0"}, 1000);
		}

	};


	return;
}

//make_room.js
//This function makes room in a set

