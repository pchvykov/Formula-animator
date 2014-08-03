
//SVG text output to give to Colm



//This script moves through a 'tree' dictionary (for now these have been defined in mock.js) and then creates a text output which will then be sent to SVG for display. Function requires a global variable because it is recursive.
	
function scan_tree(input,parent_node)
{
	console.log(input);
	if (input.left.type == 'op') //Not at a terminal node
	{
		symbol = input.code; //Get ID of this node
		left_result = scan_tree(input.left);
		parent_node = parent_node.text(50, 50, symbol);//parent_node.data("NODE_ID","node_ID"); //Create a parent node and give it an ID (Rapahel)

	}
	else //Found an terminal node
	{
		left_result = input.left.code; //Save value in terminal node
		node_ID = input.left.ID; //Get ID of this node
		//parent_node.data('NODE_ID',node_ID); //Create sub attribute of the most recent parent node and give it an ID(Rapahel)

		//$("formular_render").append()
	}
	if (input.right.type == 'op')
	{
		symbol = input.code; //Get ID of this node
		right_result = scan_tree(input.right);
		parent_node = parent_node.text(50, 50, symbol);//parent_node.data("NODE_ID","node_ID"); //Create a parent node and give it an ID (Rapahel)parent_node = parent_node.data("NODE_ID",node_ID); //Create a parent node and give it an ID (Rapahel)

	}
	else //Terminal node on the right
	{
		right_result = input.right.code;
		node_ID = input.right.ID; //Get ID of this node
		//parent_node.data("NODE_ID",node_ID); //Create sub attribute of the most recent parent node and give it an ID(Rapahel)
	}

	text_result = left_result + ' ' + input.op + ' ' + right_result;
	return (text_result);
}

