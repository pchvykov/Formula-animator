
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
       // alert("I am an alert box!");

        var v = draw_it(form, [50,30], true, SVG)
        v_original = v;

        // alert("Click to see animation!");
        paper = SVG;
        

 /*       edwin_obj1 = paper.text(180, 150, "40");
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
*/


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

      //  alert("Click to see animation!");
    edwin_obj = paper.text(400, 400, "40");
    edwin_obj.attr({'font-size':30});
        //path = new AnimationHandler_2().animate_arc(v_original, 250, 250);
        //alert("Click me");
    animate_sim(v_original,edwin_obj);


    var a = paper.text(50,150,'a'); a.attr({"font-size": 50});
    var star = paper.text(80,150,'*'); star.attr({"font-size": 50});
    var bracket1 = paper.text(110,150,'('); bracket1.attr({"font-size": 50});
    var b = paper.text(140,150,"b"); b.attr({"font-size": 50});
    var plus = paper.text(170,150,'+'); plus.data('code','+'); plus.attr({"font-size": 50});
    var c = paper.text(200,150,'c'); c.attr({"font-size": 50});
    var plus2 = paper.text(230,150,'+'); plus2.data('code','+'); plus2.attr({"font-size": 50});
    var d = paper.text(260,150,'d'); d.attr({"font-size": 50});
    var bracket2 = paper.text(290,150,')'); bracket2.attr({"font-size": 50});

    var set_a = paper.set();
    set_a.push(
        a
        );
    
    var set_b = paper.set();
    set_b.push(
        b
        );
        
    var set_c = paper.set();
    set_c.push(
        c
        );

    var set_d = paper.set();
    set_d.push(
        d
        );
    
    
    var set_b_plus_c_plus_d = paper.set();
    set_b_plus_c_plus_d.push(
        bracket1,
        set_b,
        plus,
        set_c,
        plus2,
        set_d,
        bracket2
        );

    var set_all = paper.set();
    set_all.push(
        set_a,
        star,
        set_b_plus_c_plus_d
        );

    distributor = paper.set();
    distributor.push(
        set_a,
        star
        );
    distributee = set_b_plus_c_plus_d;
    make_room(distributor,distributee,0);


    })

   
});

