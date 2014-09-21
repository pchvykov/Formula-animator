
//this binds everything in the svg to the actionhandler
var BindActionHandlerToSVG = function(sv, data){
	var a = new ActionHandler();
	a.class('down');
	a.class('up');
	a.class('drag');
	a.class('click');

	var that = this;

	var sel = $("*",sv);
	
	sel.click(function(evt, node){
		var selem = evt.target;
		var delem = data.findById(selem.id);
		a.trigger('click', {view:selem, data:delem});
	})
	return a;
}


var SVG = null;
$( document ).ready(function() {
    console.log( "ready!" );
    //http://zreference.com/raphael-animation-along-a-path/
    SVG = new Raphael($("#formula_container")[0],screen.width, screen.height/2);
    // var rect = SVG.rect(0, 0, screen.width, screen.height);
    // rect.attr("fill", "#fff");

    $("#formula_latex").change(function(){
    	var data = $("#formula_latex").val().substr();
    	var form = parser.parse(data);
    	var form_str = form.toString();
    	// $("#formula_latex_debug").html(form_str);
    	// console.log(form.data);
        v = scan_tree(form.data, 0,0,SVG);
        // console.log(v)
        display_equation(v,[0,30]);

        set_gui(v);
    	/*
    	var srndr=$("#formula_render")
    	
    	var actionHandler = BindActionHandlerToSVG(srndr, form);
    	//
    	actionHandler.add("click", "print", function(args){
    		var selem = args.view;
    		var data = args.data;
    		console.log("Clicked:");
    		$("#"+selem.id).attr("fill","yellow");
    		console.log(selem);
    	})
		*/
    })

   
});