
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
    	var form = parser.parse(data);
    	var form_str = form.print();
    	// $("#formula_latex_debug").html(form_str);
    	// console.log(form.data);
       // alert("I am an alert box!");


       //Global variable with info about the main euqations on screen:
       main_eq = {
            'R_form':0,
            'fontz':30,
            'origin': [50, 80]
        }
        v = draw_it(form, main_eq.origin, true, SVG, main_eq.fontz);
        main_eq.R_form = v;

        // alert("Click to see animation!");
 /*      paper = SVG;
        

 

      //  alert("Click to see animation!");
    distributor_set = paper.set();
    edwin_obj = paper.text(400, 400, "40");
    edwin_obj.attr({'font-size':30});
        //path = new AnimationHandler_2().animate_arc(v_original, 250, 250);
        //alert("Click me");
    //animate_sim(v_original,edwin_obj);


    var bracket0 = paper.text(20,150,'('); bracket0.attr({"font-size": 50});
    var a = paper.text(50,150,'a'); a.attr({"font-size": 50});
    var plus0 = paper.text(80,150,'+'); plus0.data('code','+'); plus0.attr({"font-size": 50});
    var f = paper.text(110,150,'f'); f.attr({"font-size": 50});
    var bracket01 = paper.text(140,150,')'); bracket01.attr({"font-size": 50});
    var star = paper.text(170,150,'*'); star.attr({"font-size": 50});
    var bracket1 = paper.text(200,150,'('); bracket1.attr({"font-size": 50});
    var b = paper.text(230,150,"b"); b.attr({"font-size": 50});
    var plus = paper.text(260,150,'+'); plus.data('code','+'); plus.attr({"font-size": 50});
    var c = paper.text(290,150,'c'); c.attr({"font-size": 50});
    var plus2 = paper.text(320,150,'+'); plus2.data('code','+'); plus2.attr({"font-size": 50});
    var d = paper.text(350,150,'d'); d.attr({"font-size": 50});
    var plus3 = paper.text(380,150,'+'); plus3.data('code','+'); plus3.attr({"font-size": 50});
    var e = paper.text(410,150,'e'); e.attr({"font-size": 50});
    var bracket2 = paper.text(440,150,')'); bracket2.attr({"font-size": 50});

    var set_a = paper.set();
    set_a.push(
        a
        );

    var set_f = paper.set();
    set_f.push(
        f
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

    var set_e = paper.set();
    set_e.push(
        e
        );
    
    var set_a_plus_f = paper.set();
    set_a_plus_f.push(
        bracket0,
        set_a,
        plus0,
        set_f,
        bracket01
        );

    var set_b_plus_c_plus_d_plus_e = paper.set();
    set_b_plus_c_plus_d_plus_e.push(
        bracket1,
        set_b,
        plus,
        set_c,
        plus2,
        set_d,
        plus3,
        set_e,
        bracket2
        );

    var set_all = paper.set();
    set_all.push(
        set_a_plus_f,
        star,
        set_b_plus_c_plus_d_plus_e
        );

    distributor = paper.set();
    distributor.push(
        set_a_plus_f,
        star
        );
    distributee = set_b_plus_c_plus_d_plus_e;
    //make_room(distributor,distributee,0);
*/

//====================================================================================

 /*   var a = paper.text(50,150,'a'); a.attr({"font-size": 50});
    var star = paper.text(80,150,'*'); star.attr({"font-size": 50});
    var bracket1 = paper.text(110,150,'('); bracket1.attr({"font-size": 50});
    var b = paper.text(140,150,"b"); b.attr({"font-size": 50});
    var plus = paper.text(170,150,'+'); plus.data('code','+'); plus.attr({"font-size": 50});
    var c = paper.text(200,150,'c'); c.attr({"font-size": 50});
    var plus2 = paper.text(230,150,'+'); plus2.data('code','+'); plus2.attr({"font-size": 50});
    var d = paper.text(260,150,'d'); d.attr({"font-size": 50});
    var plus3 = paper.text(290,150,'+'); plus3.data('code','+'); plus3.attr({"font-size": 50});
    var e = paper.text(320,150,'e'); e.attr({"font-size": 50});
    var bracket2 = paper.text(350,150,')'); bracket2.attr({"font-size": 50});

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

    var set_e = paper.set();
    set_e.push(
        e
        );
    

    var set_b_plus_c_plus_d_plus_e = paper.set();
    set_b_plus_c_plus_d_plus_e.push(
        bracket1,
        set_b,
        plus,
        set_c,
        plus2,
        set_d,
        plus3,
        set_e,
        bracket2
        );

    var set_all = paper.set();
    set_all.push(
        set_a,
        star,
        set_b_plus_c_plus_d_plus_e
        );

    distributor = paper.set();
    distributor.push(
        set_a,
        star
        );
    distributee = set_b_plus_c_plus_d_plus_e;
    make_room(distributor,distributee,0);*/
    
    })
   
});

