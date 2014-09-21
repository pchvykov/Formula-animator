
//SVG text output to give to Colm




var i = 0;
function original_scan_tree(input) //Sarah gives me the Raphael paper
{

	if (input.left.type == 'op') //Not at a terminal node
	{
		left_result = original_scan_tree(input.left);
	}
	else //Found a terminal node
	{
		left_result = input.left.code; //Save value in terminal node
	}

	if (input.right.type == 'op') //Not at a terminal node
	{
	    right_result = original_scan_tree(input.right);
	}
	else //Terminal node on the right
	{
		right_result = input.right.code;
	}

	text_result = left_result + ' ' + input.code + ' ' + right_result;
	console.log(text_result);
	i = i + 1;
	console.log(i);
	return(text_result);
}

function scan_tree(input,parent_set,parent_node,paper) //This is the third version of the scan_tree function. It is different in that instead of outputing a set of objects, it outputs a set of sets.
/*
This function scans a 'tree object' (provided by Sarah) and then generates Raphael or SVG text objects that have various attributes. Function is recursive.
Inputs are:
-> input: This is the 'tree object' provided by Sarah's parsing function. It should be noted that the current function will only work correctly if the input tree object propagates 'left'. This means that all 'right' branches must be terminal nodes.
-> parent_set: This is the parent_set object that will be passed around. When the function is being called for the first time, put a zero (0) at this point
-> parent_node: This is the parent node text object containing information about a 'parent node'. The information is useful while examininig and defining attributes of a corresponding 'child node'
-> root_node_position: This passes the position of the root (fundamental) text element on the SVG canvas so that all other child nodes can locate themselves relative to this root node.
-> paper: This is the SVG canvas.

The output of this function is a set of Raphael objects. Each object has a number of standard and 'improvised' attributes.
*/
{
	// console.log(input);
	// font_size = 25;

	if (parent_set == 0) //create a root_set if none has been defined
	{
		var parent_set = paper.set(); //Create the empty parent set
		root_text_object = paper.text(); //Create an empty  text object
		//root_text_object.attr({"font-size": font_size});
		root_text_object.data('type','origin_node'); //Create a custom 'type' attribute which saves the type of node and its ID
		//root_text_object.data('id',input.id);//Create a custom 'ID' attribute which saves the type of node and its ID
		root_text_object.id = input.id;//Create a custom 'ID' attribute which saves the type of node and its ID
		root_text_object.data('code',input.code); //Save code
		root_text_object.data('level',0); //Root node should have a level of 0
		//root_text_object.data('whoisyourdad',0); //Create custom attribute which saves the parent node
		root_text_object.parent = parent_set; //Create custom attribute which saves the parent node


		parent_set.push(
	    	root_text_object //Pushes 1st element on to the root set
	    );

	    if(typeof input.left !== 'undefined'){
			scan_tree(input, parent_set, root_text_object, paper);}

		
	}
	else //No longer at starting node
	{

		///-->Left ....
		if (input.left.type == 'op') //Not at a terminal node
		{
			left_text_object = paper.text(); //Create text object
			left_text_object.data('type','non_terminal_node_left'); //Create a custom 'type' attribute which saves the type of node and its ID
			//left_text_object.data('id',input.left.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			left_text_object.id = input.left.id;
			left_text_object.data('code',input.left.code); //Save symbol
			left_text_object.data('level',(parent_node.data('level') + 1)); //Update level of this node
			//left_text_object.data('whoisyourdad', parent_node); //Create custom attribute which saves the parent node
			left_text_object.data('absolute_orientation', parent_node.data('absolute_orientation'));

		   //Create a new set and add node to set
		   	var another_set = paper.set();
		   
		   	another_set.push(
		   		left_text_object
		   	);
		   	left_text_object.parent = another_set; //Create custom attribute which saves the parent node
			
		   	scan_tree(input.left, another_set, left_text_object, paper); //Recursively call scan_tree to descend down the tree further

		   	parent_set.push(
		   		another_set
		   	);
		    //result_set = scan_tree(input.left, another_set, left_text_object, root_node_position, paper); //Recursively call scan_tree to descend down the tree further
		}
		else //Found a terminal node
		{
			left_text_object = paper.text(); //Create text object
			left_text_object.data('type','terminal_node_left'); //Create a custom 'type' attribute which saves the type of node and its ID
			//left_text_object.data('id',input.left.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			left_text_object.id = input.left.id;
			left_text_object.data('code',input.left.code); //Save symbol
			left_text_object.data('level',(parent_node.data('level') + 1)); //Update level of this node
			//left_text_object.data('whoisyourdad', parent_node); //Create custom attribute which saves the parent node
			left_text_object.data('absolute_orientation', parent_node.data('absolute_orientation')); //Inherits absolute orientation of its parent

			var another_set = paper.set();
			another_set.push(
				left_text_object
				);
			left_text_object.parent = another_set; //Create custom attribute which saves the parent node
			
		    // Add terminal node to the set
		    parent_set.push(
		    	//left_text_object
		    	another_set
		    );
		}

		///Right--->>>

		if (input.right.type == 'op') //Not at a terminal node
		{
			right_text_object = paper.text(); //Create text object
			right_text_object.data('type','non_terminal_node_right'); //Create a custom 'type' attribute which saves the type of node and its ID
			//right_text_object.data('id',input.right.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			right_text_object.id = input.right.id;
			right_text_object.data('code',input.right.code); //Save symbol
			right_text_object.data('level',(parent_node.data('level') + 1)); //Update level of this node
			//right_text_object.data('whoisyourdad', parent_node); //Create custom attribute which saves the parent node
			right_text_object.data('absolute_orientation', parent_node.data('absolute_orientation')); //Inherits absolute orientation of its parent

		    // Add terminal node to the set
		    var another_set = paper.set();

		    another_set.push(
				right_text_object
			);
		    right_text_object.parent = another_set; //Create custom attribute which saves the parent node
			
			scan_tree(input.right, another_set, right_text_object, paper); //Recursively call scan_tree to descend down the tree further

		    parent_set.push(
		    	another_set
		    );
		}
		else //Found a terminal node
		{
			right_text_object = paper.text(); //Create text object
			right_text_object.data('type','terminal_node_right'); //Create a custom 'type' attribute which saves the type of node and its ID
			//right_text_object.data('id',input.right.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			right_text_object.id = input.right.id;
			right_text_object.data('code',input.right.code); //Save symbol
			right_text_object.data('level',(parent_node.data('level') + 1)); //Update level of this node
			//right_text_object.data('whoisyourdad', parent_node); //Create custom attribute which saves the parent node
			right_text_object.data('absolute_orientation', parent_node.data('absolute_orientation')); //Inherits absolute orientation of its parent

			var another_set = paper.set();
			another_set.push(
				right_text_object
				);
			right_text_object.parent = another_set; //Create custom attribute which saves the parent node
			
		    // Add terminal node to the set
		    parent_set.push(
		    	//right_text_object
		    	another_set
		    );
		}
	}

	return(parent_set);
}


// var toRaphaelUnicode = function(t){return t.replace(/&#([0-9]*);/g, '\\u$1')}
function display_equation(parent_set,origin)
{
	//This function parses through the set structure generated by scan_tree and then displays the text as Raphael SVG text objects. Basically, it's just a matter of assigning the right coordinates to those text elements that were already generated
	offset = 30;
	font_size = 30;

	var daddy_element = parent_set[0];

	if (parent_set.length == 1) //Only display if you've hit a terminal node. A terminal node is a set which has only one element. A single element is not explicitly defined as a set is NOT a set and the .length method is not defined for it
	{
		// console.log(daddy_element);
		daddy_element.attr({text: toUnicodeCharacter(daddy_element.data('code')), x: (origin[0] + offset), y: origin[1], "font-size": font_size});
		var new_origin = [(origin[0] + offset),origin[1]];
		return new_origin;
	}
	else //Set is not a terminal node
	{
		var coordinates_of_left_element = display_equation(parent_set[1],origin); //Display left element first
		// console.log(daddy_element.data('code'));
		daddy_element.attr({text: daddy_element.data('code'), x: (coordinates_of_left_element[0] + offset), y: coordinates_of_left_element[1], "font-size": font_size}); //Display middle (or father) element
		var origin_right = [(daddy_element.attr("x")),daddy_element.attr("y")];
		var coordinates_of_right_element = display_equation(parent_set[2],origin_right); //Display right element last
		return coordinates_of_right_element;
	}
}
