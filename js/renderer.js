
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

function create_node(inp, parent_set, paper){
	
	text_object = paper.text(); //Create text object

	if (inp.op != 'paren') { 
		
		text_object.data('code',inp.code);
		text_object.id = inp.id; //Create a custom 'ID' attribute which saves the type of node and its ID
	} //Save symbol
	text_object.parent = parent_set; //Create custom attribute which saves the parent node
	
	return text_object;
}

function scan_tree(input, parent_set, paper) //This is the third version of the scan_tree function. It is different in that instead of outputing a set of objects, it outputs a set of sets.
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
	if (parent_set == 0) //create a root_set if none has been defined
	{
		var parent_set = paper.set();
		parent_set.data('level', 0);
		scan_tree(input, parent_set, paper);
		return parent_set;
	}
	// console.log(input, 'test');
	parent_set.push(create_node(input, parent_set, paper));
	if(input.type == 'op') //Not at a terminal node
	{	
		if(input.op == 'paren'){
			parent_set[0].data('code', '(');
			parent_set[0].id = input.id;

			var expr_set = paper.set();
			expr_set.data('level',parent_set.data('level')+1) //Update level of this node
			scan_tree(input.exp, expr_set, paper);
			parent_set.push(expr_set);

			parent_set.push(create_node(input,parent_set,paper));
			parent_set[2].id = input.id+0.1;
			parent_set[2].data('code', ')');
			
			// tt= parent_set
		}
		else {
			var left_set = paper.set();
			left_set.data('level',parent_set.data('level')+1) //Update level of this node
			scan_tree(input.left, left_set, paper);
			parent_set.push(left_set);
			var right_set = paper.set();
			right_set.data('level',parent_set.data('level')+1) //Update level of this node
			scan_tree(input.right, right_set, paper);
			parent_set.push(right_set);
		}
	}

	return parent_set;
}


// var toRaphaelUnicode = function(t){return t.replace(/&#([0-9]*);/g, '\\u$1')}
function display_equation(parent_set,origin)
{
	//This function parses through the set structure generated by scan_tree and then displays the text as Raphael SVG text objects. Basically, it's just a matter of assigning the right coordinates to those text elements that were already generated
	offset = 30;
	font_size = 30;

	// var daddy_element = parent_set[0];
	if (parent_set.length == 1) //Only display if you've hit a terminal node. A terminal node is a set which has only one element. A single element is not explicitly defined as a set is NOT a set and the .length method is not defined for it
	{
		// console.log(parent_set[0]);
		parent_set[0].attr({text: toUnicodeCharacter(parent_set[0].data('code')), x: (origin[0] + offset), y: origin[1], "font-size": font_size});
		var new_origin = [(origin[0] + offset),origin[1]];
		return new_origin;
	}
	else //Set is not a terminal node
	{
		// console.log(parent_set[0].data('code'))
		if(parent_set[0].data('code') == '('){
			parent_set[0].attr({text: parent_set[0].data('code'), x: (origin[0] + offset), y: origin[1], "font-size": font_size}); //Display middle (or father) element
			var origin_right = [(parent_set[0].attr("x")-offset/2),parent_set[0].attr("y")];
			var right_paren = display_equation(parent_set[1], origin_right);
			parent_set[2].attr({text: parent_set[2].data('code'), x: (right_paren[0] + offset/2), y: right_paren[1], "font-size": font_size}); //Display middle (or father) element
			var coordinates_of_right_element = [(parent_set[2].attr("x")),parent_set[2].attr("y")];
		}
		else{
			var coordinates_of_left_element = display_equation(parent_set[1],origin); //Display left element first
			// console.log(parent_set[0].data('code'));
			parent_set[0].attr({text: parent_set[0].data('code'), x: (coordinates_of_left_element[0] + offset), y: coordinates_of_left_element[1], "font-size": font_size}); //Display middle (or father) element
			var origin_right = [(parent_set[0].attr("x")),parent_set[0].attr("y")];
			var coordinates_of_right_element = display_equation(parent_set[2],origin_right); //Display right element last
		}
		return coordinates_of_right_element;
	}
}
