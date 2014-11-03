
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
    console.log( "ready Edwin!" );
    //http://zreference.com/raphael-animation-along-a-path/
    SVG = new Raphael($("#formula_container")[0],screen.width, screen.height/2);
    // var rect = SVG.rect(0, 0, screen.width, screen.height);
    // rect.attr("fill", "#fff");

    $("#formula_latex").change(function(){
        SVG.clear();
    	var data = $("#formula_latex").val().substr();
    	var form = parser.parse(data);
    	var form_str = form.print();
    	// $("#formula_latex_debug").html(form_str);
    	// console.log(form.data);
        alert("I am an alert box!");

        var v = draw_it(form, [50,30], true, SVG)
        v_original = v;

         alert("Click to see animation!");
        paper = SVG;
        edwin_obj1 = paper.text(180, 150, "40");
        edwin_obj1.attr({
          'font-size':30
        });
        edwin_obj2 = paper.text(250, 150, "+ 30");
        edwin_obj2.attr({
          'font-size':30
        });
        simple_set = SVG.set();
        simple_set.push(
            edwin_obj1,
            edwin_obj2
            );

        var path = new AnimationHandler().animate_arc(edwin_obj1,200, 100);


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

