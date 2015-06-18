


$( document ).ready(function() {
    console.log( "ready!" );

    //Main Raphael paper:
    SVG = new Raphael($("#formula_container")[0],screen.width, screen.height/2);
    //Raphael paper for the stored operations:
    Mem = new Raphael(900,20,500,500);
    var divider = Mem.path("M0,0L0,500");
    divider.attr({stroke:'#000',"stroke-width":5});


    $("#formula_latex").change(function(){
      SVG.clear();
    	var data = $("#formula_latex").val().substr();
      eq0 = new Equation(data,SVG,[50,50]);
      eq0.display();

    	console.log(eq0.master.print(1));

      memory = new Memory(Mem);
       // alert("I am an alert box!");

    
    })
   
});

