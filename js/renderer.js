
//SVG text output to give to Colm

	
function scan_tree(input,parent_set,parent_node,root_node_position,paper) //Sarah gives me the Raphael paper

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
	console.log(input);
	font_size = 15;

	if (parent_set == 0) //create a root_set if none has been defined
	{
		var parent_set = paper.set(); //Create the empty parent set
		root_text_object = paper.text(100,100,input.code); //Creat a text object with the code as the text
		root_text_object.attr({"font-size": font_size});
		root_text_object.data('type','origin_node'); //Create a custom 'type' attribute which saves the type of node and its ID
		root_text_object.data('id',input.id);//Create a custom 'ID' attribute which saves the type of node and its ID
		root_text_object.data('code',input.code); //Save code
		root_text_object.data('level',0); //Root node should have a level of 0
		root_text_object.data('parent_node',0); //Create custom attribute which saves the parent node

		parent_set.push(
	    	root_text_object //Pushes 1st element on to the root set
	    );

	    root_node_position[0] = root_text_object.attr('x'); //Get the position of the root_text_object
		root_node_position[1] = root_text_object.attr('y');

	    if (input.left.type == 'op') //Not at a terminal node
		{
			var left_text_object = paper.text(); //Create text object
			left_text_object.data('type','non_terminal_node_left'); //Create a custom 'type' attribute which saves the type of node and its ID
			left_text_object.data('id',input.left.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			left_text_object.data('code',input.left.code); //Save symbol
			left_text_object.data('level',1); //Level 1 element
			left_text_object.data('parent_node', root_text_object); //Create custom attribute which saves the parent node
			left_text_object.data('absolute_orientation', 'left'); //Absolute orientation is either left or right. As in, the tree must only have two main branches.

			var x_center = root_text_object.attr('x') - 15*2; //x-position of this element relative to the root_text_object
			var y_center = root_text_object.attr('y');
			left_text_object.attr('x',x_center);
			left_text_object.attr('y',y_center);
			left_text_object.attr('text',input.left.code);
			left_text_object.attr({"font-size": font_size});


		    // Add terminal node to the set
		    parent_set.push(
		    	left_text_object
		    );

		    result_set = scan_tree(input.left, parent_set, left_text_object, root_node_position, paper); //Recursively call scan_tree to descend down the tree further
		}
		else //Found a terminal node
		{
			var left_text_object = paper.text(); //Create a text object containing terminal node result
			left_text_object.data('type','terminal_node_left'); //Create a custom 'type' attribute which saves the type of node and its ID
			left_text_object.data('id',input.left.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			left_text_object.data('code',input.left.code); //Save symbol
			left_text_object.data('level',1);
			left_text_object.data('parent_node', root_text_object); //Create custom attribute which saves the root node
			left_text_object.data('absolute_orientation', 'left');

			var x_center = root_text_object.attr('x') - 15;
			var y_center = root_text_object.attr('y');
			left_text_object.attr('x',x_center);
			left_text_object.attr('y',y_center);
			left_text_object.attr('text',input.left.code);
			left_text_object.attr({"font-size": font_size});


		    // Add terminal node to the set
		    parent_set.push(
		    	left_text_object
		    );
		}
		///Right
		if (input.right.type == 'op') //Not at a terminal node
		{
			var right_text_object = paper.text(); //Create text object
			right_text_object.data('type','non_terminal_node_right'); //Create a custom 'type' attribute which saves the type of node and its ID
			right_text_object.data('id',input.right.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			right_text_object.data('code',input.right.code); //Save symbol
			right_text_object.data('level',1); //Level 1 element
			right_text_object.data('parent_node', root_text_object); //Create custom attribute which saves the parent node
			right_text_object.data('absolute_orientation', 'right');

			var x_center = root_text_object.attr('x') + 15;
			var y_center = root_text_object.attr('y');
			right_text_object.attr('x',x_center);
			right_text_object.attr('y',y_center);
			right_text_object.attr('text',input.right.code);
			right_text_object.attr({"font-size": font_size});

		    // Add terminal node to the set
		    parent_set.push(
		    	right_text_object
		    );

		    result_set = scan_tree(input.right, parent_set, right_text_object, root_node_position, paper); //Recursively call scan_tree to descend down the tree further
		}
		else //Found a terminal node
		{
			var right_text_object = paper.text(); //Create a text object containing terminal node result
			right_text_object.data('type','terminal_node_right'); //Create a custom 'type' attribute which saves the type of node and its ID
			right_text_object.data('id',input.right.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			right_text_object.data('code',input.right.code); //Save symbol
			right_text_object.data('level',1);
			right_text_object.data('parent_node', root_text_object); //Create custom attribute which saves the parent node
			right_text_object.data('absolute_orientation', 'right');

			var x_center = root_text_object.attr('x') + 15;
			var y_center = root_text_object.attr('y');
			right_text_object.attr('x',x_center);
			right_text_object.attr('y',y_center);
			right_text_object.attr('text',input.right.code);
			right_text_object.attr({"font-size": font_size});

		    // Add terminal node to the set
		    parent_set.push(
		    	right_text_object
		    );

		}

	}

	else //We are no longer at the topmost parent node
	{

		///-->Left ....
		if (input.left.type == 'op') //Not at a terminal node
		{
			left_text_object = paper.text(); //Create text object
			left_text_object.data('type','non_terminal_node_left'); //Create a custom 'type' attribute which saves the type of node and its ID
			left_text_object.data('id',input.left.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			left_text_object.data('code',input.left.code); //Save symbol
			left_text_object.data('level',(parent_node.data('level') + 1)); //Update level of this node
			left_text_object.data('parent_node', parent_node); //Create custom attribute which saves the parent node
			left_text_object.data('absolute_orientation', parent_node.data('absolute_orientation'));

		/*
		If the 'input' to this function is defined correctly, then all 'right' nodes are situated exactly 'one step' to the right of the parent_node (because they are terminal nodes).
		All 'left' nodes that are not terminal nodes will be situated exactly 'level*2' steps to the left of the 'root_text_object'.
		All 'left' nodes that are terminal nodes will be situated exactly one step to the left of the 'parent_node'.
		A 'step' represents a number of pixels which for now is chosen as 15.
		*/
			var x_center = root_node_position[0] - left_text_object.data('level')*2*15; 
			var y_center = root_text_object.attr('y');
			left_text_object.attr('x',x_center);
			left_text_object.attr('y',y_center);
			left_text_object.attr('text',input.left.code);
			left_text_object.attr({"font-size": font_size});

		   //Add node to set
		    parent_set.push(
		    	left_text_object
		    );

		    result_set = scan_tree(input.left, parent_set, left_text_object, root_node_position, paper); //Recursively call scan_tree to descend down the tree further
		}
		else //Found a terminal node
		{
			left_text_object = paper.text(); //Create text object
			left_text_object.data('type','terminal_node_left'); //Create a custom 'type' attribute which saves the type of node and its ID
			left_text_object.data('id',input.left.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			left_text_object.data('code',input.left.code); //Save symbol
			left_text_object.data('level',(parent_node.data('level') + 1)); //Update level of this node
			left_text_object.data('parent_node', parent_node); //Create custom attribute which saves the parent node
			left_text_object.data('absolute_orientation', parent_node.data('absolute_orientation')); //Inherits absolute orientation of its parent

			var x_center = parent_node.attr('x') - 15;
			var y_center = root_text_object.attr('y');
			left_text_object.data('x_center',x_center);
			left_text_object.data('y_center',y_center);
			left_text_object.attr('x',x_center);
			left_text_object.attr('y',y_center);
			left_text_object.attr('text',input.left.code);
			left_text_object.attr({"font-size": font_size});

		   //Add node to set
		    parent_set.push(
		    	left_text_object
		    );
		}

		///Right--->>>

		if (input.right.type == 'op') //Not at a terminal node
		{
			right_text_object = paper.text(); //Create text object
			right_text_object.data('type','non_terminal_node_right'); //Create a custom 'type' attribute which saves the type of node and its ID
			right_text_object.data('id',input.right.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			right_text_object.data('code',input.right.code); //Save symbol
			right_text_object.data('level',(parent_node.data('level') + 1)); //Update level of this node
			right_text_object.data('parent_node', parent_node); //Create custom attribute which saves the parent node
			right_text_object.data('absolute_orientation', parent_node.data('absolute_orientation')); //Inherits absolute orientation of its parent


			var x_center = parent_node.attr('x') + 15;
			var y_center = root_text_object.attr('y');
			right_text_object.data('x_center',x_center);
			right_text_object.data('y_center',y_center);
			right_text_object.attr('x',x_center);
			right_text_object.attr('y',y_center);
			right_text_object.attr('text',input.right.code);
			right_text_object.attr({"font-size": font_size});

		   //Add node to set
		    parent_set.push(
		    	right_text_object
		    );

		    result_set = scan_tree(input.right, parent_set, right_text_object, root_node_position, paper); //Recursively call scan_tree to descend down the tree further
		}
		else //Found a terminal node
		{
			right_text_object = paper.text(); //Create text object
			right_text_object.data('type','terminal_node_right'); //Create a custom 'type' attribute which saves the type of node and its ID
			right_text_object.data('id',input.right.id); //Create a custom 'ID' attribute which saves the type of node and its ID
			right_text_object.data('code',input.right.code); //Save symbol
			right_text_object.data('level',(parent_node.data('level') + 1)); //Update level of this node
			right_text_object.data('parent_node', parent_node); //Create custom attribute which saves the parent node
			right_text_object.data('absolute_orientation', parent_node.data('absolute_orientation')); //Inherits absolute orientation of its parent


			var x_center = parent_node.attr('x') + 15;
			var y_center = root_text_object.attr('y');
			right_text_object.data('x_center',x_center);
			right_text_object.data('y_center',y_center);
			right_text_object.attr('x',x_center);
			right_text_object.attr('y',y_center);
			right_text_object.attr('text',input.right.code);
			right_text_object.attr({"font-size": font_size});

		   //Add node to set
		    parent_set.push(
		    	right_text_object
		    );
		}
	}
	return(parent_set);
}



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