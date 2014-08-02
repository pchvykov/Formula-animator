
//SVG text output to give to Colm



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



$("formula_render").attr()
<svg height="30" width="200">
  <text x="0" y="15" fill="red">I love SVG!</text>
</svg>