// <text x="250" y="50" dy="-10">B &#948 </text> <!-- This positions letter B and greek letter small delta-->


var mock1 = {
	type: "op",
	op: "plus",
	left: {
		type: "symbol",
		value: "a"
	},
	right: {
		type: "number",
		value: 52

	}
}

//a + 45 = b
var mock2 = {
	type: "op",
	op: "=",
	right: {
		type: "symbol",
		value: "b"
	},
	left: {
		type: "op",
		op: "+",
		left: {
			type: "symbol",
			value: "a"
		},
		right: {
			type: "number",
			value: 45
		}
	}
}

//a = 45
var mock3 = {
	type: "op",
	op: "=",
	right: {
		type: "symbol",
		value: "a"
	},
	left: {
		type: "number",
		value: 45
	}
}


//This script moves through a 'tree' dictionary (for now these have been defined in mock.js) and then creates a text output which will then be sent to SVG for display. Function requires a global variable because it is recursive.
	
function scan_tree(input)
{
	if (input.left.type == 'op')
	{
		left_result = scan_tree(input.left);
	}
	else
	{
		left_result = input.left.value;
	}
	if (input.right.type == 'op')
	{
		right_result = scan_tree(input.right);
	}
	else
	{
		right_result = input.right.value;
	}
	text_result = left_result + ' ' + input.op + ' ' + right_result;
	return (text_result);
}



