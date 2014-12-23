function for_each_element(input_item, output_set) 
{ 
//This function extracts all the items of a given input set and places them as items in an output set.
    input_item.forEach(function(sel) 
    {
        if(sel.constructor.prototype ==  Raphael.st) 
        {
            for_each_element(sel, output_set);
        }
        else 
        {
            output_set.push(
                sel);
        }
    })
}


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


	 empty_space_width = distributor.getBBox().width; //Get the empty space we need to create
	 array_of_relative_movements = [];
	 multiplier = 1;
	 number_of_plus_signs = 0;
	 BBox_of_plus_signs = [];
	 array_of_clones = [];
	 array_of_relative_movements_of_plus_signs = [];
	 table_of_distributor_element_final_positions = [];
	//var 

	//Now we find all the items that are not elements
	//distributee[0] <=> 1st bracket
	//distributee[distributee.length-1] <=> last bracket
	for	(var index = 1; index < distributee.length; index +=1)  //Index begins from '1' and not '0' because the first element of the distributee is always a bracket '(' and should not be moved
	{
		//array_of_relative_movements[i] = empty_space_width;
		if (distributee[index].data('code') == '+')//If item is an element whose code is the plus sign then proceed to shift everything to its right.
		{
			array_of_relative_movements[index] = multiplier*empty_space_width;
			array_of_relative_movements_of_plus_signs[number_of_plus_signs] = multiplier*empty_space_width;
			BBox_of_plus_signs[number_of_plus_signs] = distributee[index].getBBox(); //Just get the BBox of all the plus signs of the distributee
			multiplier +=1;
			//console.log('Incremented multiplier');
			number_of_plus_signs += 1;

		}
		else
		{
			array_of_relative_movements[index] = multiplier*empty_space_width;
		}
	}

	// document.getElementById('button').onclick = function() 
	// {

		//We need as many clones as there are plus signs.
		for (var index = 1; index <= number_of_plus_signs; index +=1)
		{
			array_of_clones[index] = distributor.clone(); //Make a clone of the distributor. Make as many clones as there are plus signs minus one. In total we'd have the same number of distributors as there are plus signs.
		}
		array_of_clones[0] = distributor; //The original distributor takes the 0th position in the array of clones table.

		//There are two different sets of movements going on here.
		//1. The distributee items will be moving to "make room"
		//2. The distributor and its clones will be moving in to the room left by step 1.
		paper = main_eq.R_form.paper;
		//First use the forEl function to extract all elements of the distributor in to a set.
		distributor_set = paper.set(); //Create an empty set in to which we will load all the elements of the distributor
		for_each_element(distributor,distributor_set); //This loads all the elements of the distributor on to distributor_set
		
		//var table_of_distributor_element_final_positions[(number_of_plus_signs + 1),distributor_set.length]; //Declare the table of distributor element final positions.
		//The number of plus signs plus 1 determines the rows, while the number of distributee elements determines the columns
		//It appears that it is quite tricky to pre-allocate an array in javascript. And the literature seems to indicate that there is no significant gain (sometimes
			//even losses!) in doing this. Below is one way to pre-allocate a table.

		
		for(var x = 0; x < number_of_plus_signs+1; x++)
		{
		    table_of_distributor_element_final_positions[x] = [];    
		    for(var y = 0; y < distributor_set.length; y++)
		    { 
		        table_of_distributor_element_final_positions[x][y] = [];    
		    }    
		}
		
		
		//Now we compute the relative offsets that are required for each element of the distributor. Please refer to the worksheet for a better understanding of the concept.

		//Do the case of row 0 separately because the 1st reference point of the distributee is a bracket. All other subsequent reference points are '+' signs.
						//Do the particular case of element[0,0] separately because we need the position of the first bracket in the distributee
		table_of_distributor_element_final_positions[0][0] = distributee[0].getBBox().x + distributee[0].getBBox().width*1.5 + distributor_set[0].getBBox().width/2; //final_position of element[0,0]
		for (var k = 1; k <= distributor_set.length-1; k += 1) //For the other distributor elements
		{
			table_of_distributor_element_final_positions[0][k] = table_of_distributor_element_final_positions[0][k - 1] + distributor_set[k-1].getBBox().width;// + distributor_set[k].getBBox().width; //Fine-tune?
		}


		//Do the case of rows 1 to length of plus signs
		for (var i = 1; i <= number_of_plus_signs; i +=1)
		{
			table_of_distributor_element_final_positions[i][0] = array_of_relative_movements_of_plus_signs[i-1] + BBox_of_plus_signs[i-1].x + BBox_of_plus_signs[i-1].width*1.5;//distributor_set[0].getBBox().width/2;
			//The reason for defining [i,0] element separately is because we need the initial d+ (see worksheet for definition of 'd+')

			for (var k = 1; k <= distributor_set.length-1; k += 1)
			{
				table_of_distributor_element_final_positions[i][k] = table_of_distributor_element_final_positions[i][k - 1] + distributor_set[k-1].getBBox().width;// distributor_set[k].getBBox().width/2;
			}
		}
		
		var Ey = (distributor.getBBox().y + distributor.getBBox().y2)/2; //The y-coordinate does not change

		//This 'for' loop has the effect of calling the animationhandler function on each element of the distributor. This is in order to avoid the 'collapse' problem we had before.
		for (var i = 0; i <= number_of_plus_signs; i +=1)
		{
			//console.log(i);
			distributor_set = paper.set(); //Create an empty set in to which we will load all the elements of the distributor
			for_each_element(array_of_clones[i],distributor_set); //This loads all the elements of the clone onto distributor_set
			for (var k = 0; k <= distributor_set.length-1; k += 1)
			{
				//console.log(k);
				var Ex = table_of_distributor_element_final_positions[i][k];
				path = new AnimationHandler_2().animate_along_a_path(distributor_set[k], Ex, Ey);
			}
		}


		//Ex_original_clone and Ey_original_clone should be deleted. No longer needed
		//Below we determine the end points for the the movement of the original distributor clone just after the first bracket and then animate the movement.
		var Ex_original_clone = distributee[0].getBBox().x + distributee[0].getBBox().width + distributor.getBBox().width/2;
		var Ey_original_clone = (distributor.getBBox().y + distributor.getBBox().y2)/2;

		//path = new AnimationHandler_2().animate_along_a_path(array_of_clones[0], Ex_original_clone, Ey_original_clone); //First we animate the original "distributor"


		//--> Delete this 'for' loop because it is no longer needed
		//Below we determine the end points for the the movement of the other distributor clones and animate their movements.
		for (var index = 1; index <= number_of_plus_signs; index +=1)
		{
			var Ex = BBox_of_plus_signs[index-1].x + array_of_relative_movements_of_plus_signs[index - 1];
			var Ey = Ey_original_clone;
			//path = new AnimationHandler_2().animate_along_a_path(array_of_clones[index], BBox_of_plus_signs[index-1].x + array_of_relative_movements_of_plus_signs[index - 1]  , BBox_of_plus_signs[index-1].y);
			//path = new AnimationHandler_2().animate_along_a_path(array_of_clones[index], Ex, Ey);
			//console.log(index);
		}

		//Below is a "for" loop that animates "make room"
		for (var index = 1; index < distributee.length; index +=1) //Index begins from '1' and not '0' because the first element of the distributee is always a bracket '(' and should not be moved
		{
			distributee[index].animate({transform: "t" + array_of_relative_movements[index] + "," + "0"}, 1000);
		}
	//};


	return;
}

//make_room.js
//This function makes room in a set

