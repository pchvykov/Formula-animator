$( document ).ready(function() {
    console.log( "ready!" );
    $("#formula_latex").change(function(){
    	var data = $("#formula_latex").val().substr();
    	console.log(data);
    	var structure = parser.parse(data);
    	var structure_str = JSON.stringify(structure,null,2);
    	$("#formula_latex_debug").html(structure_str);
    })
});