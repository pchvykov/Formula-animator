/*
function sleep(milliseconds) {
  var start = new Date().getTime();
    while ((new Date().getTime() - start) < milliseconds){
        
    }
}

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
*/

var SVG = null;
$( document ).ready(function() {
    console.log( "ready!" );
    //Animation box coordinates - global

    //http://zreference.com/raphael-animation-along-a-path/
    //Main Raphael paper:
    SVG = new Raphael($("#formula_container")[0],screen.width, screen.height/2);
    //Raphael paper for the stored operations:
    Mem = new Raphael(900,60,500,500);
    var divider = Mem.path("M0,0L0,500");
    divider.attr({stroke:'#000',"stroke-width":5});
    // var rect = SVG.rect(0, 0, screen.width, screen.height);
    // rect.attr("fill", "#fff");

    $("#formula_latex").change(function(){
        SVG.clear();
    	var data = $("#formula_latex").val().substr();
      eq0 = new Equation(data,SVG,[50,50]);
      eq0.display();
    	//form = parser.parse(data);
        //console.log(form.nodes[1].new_id(5))
    	//var form_str = form.print();
    	// $("#formula_latex_debug").html(form_str);
    	console.log(eq0.master.print(1));
       // alert("I am an alert box!");


       //Global variable with info about the main euqations on screen (handle for the formula, font size, position in SVG paper):
       // main_eq = {
       //      'R_form':0,
       //      'fontz':30,
       //      'origin': [50, 80]
       //  }
       //  var v = draw_it(form, main_eq.origin, true, SVG, main_eq.fontz);
       //  main_eq.R_form = v;


    
    })
   
});

