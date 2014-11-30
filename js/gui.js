// $( document ).ready(function() {
// 	// console.log( "ready!" );
// 	$("#formula").mousemove(move);
// 	$("#formula").mouseup(endMove);
// 	$("*", $("#formula")).mousedown(mouseDown);

// });

// document.onselectstart = function(){ return false; }
var v_original
var v_over


window.onload = function(){
    var holdid = -1,
        dropid = -1, 
        left = false,
        exec = -1,
        form, delay, SVG, bubb = Raphael(0,0,1,1);

    
    
// var tree = { "id": 29, "type": "op", "op": "eq", "code": "=", "left": 
// { "id": 16, "type": "op", "op": "plus", "code": "+", "left": 
// { "id": 3, "type": "number", "value": 5 }, "right": { "id": 15, "type": "number", "value": 6 } }, 
// "right": { "id": 28, "type": "number", "value": 7 } };

// var R = Raphael(0, 0, "100%", "100%"),
//     s1 = R.text(250, 100, '='),
//     s2 = R.text(150, 100, '+'),
// 	s3 = R.text(100, 100, '5'),
// 	s4 = R.text(200, 100, '6'),
// 	s5 = R.text(300, 100, '7'),
//     s = R.set(s1, R.set(s2, R.set(s3), R.set(s4)), R.set(s5)),
//     dropel = s1;


//     s.forEach(function(el) {el.parent = s;});
//     s[1].forEach(function(el) {el.parent = s[1];});
//     s[2].forEach(function(el) {el.parent = s[2];});
//     s[1][1].forEach(function(el) {el.parent = s[1][1];});
//     s[1][2].forEach(function(el) {el.parent = s[1][2];});

//     // s.push(R.text(250, 100, '='));
//     s1.id=3; s2.id=16; s3.id=15; s4.id=29; s5.id=28;


//function forEl(el,elfn){
 forEl = function(el, elfn) { //Execute the function for all elements in set (not sets)
    el.forEach(function(sel) {
        if(sel.constructor.prototype ==  Raphael.st) {
            forEl(sel, elfn);
        }
        else {
            elfn(sel);
            distributor_set.push(
                sel);
        }

    })
}

edwin_dummy_function = function(input)
{
    console.log(input);
}


var start = function () {
    test = this.parent;
    forEl(this.parent, function(el) {
        el.ox = el.attr("x");
        el.oy = el.attr("y");
    });
    holdid = this.id;
    this.toBack();
    // console.log(this.ox, this.oy);
    // this.animate({r: 70, opacity: .25}, 500, ">");
},
move = function (dx, dy, x) {
    forEl(this.parent, function(el) {
        el.attr({x: el.ox + dx, y: el.oy + dy})
    });
    if(dropid != -1 && dropid != holdid && dropel.constructor.prototype == Raphael.el){
        left = x < dropel.attr("x") + dropel.getBBox().width / 5;
        console.log(left)
    }
    // console.log(this.ox);
},
up = function () {
    if(dropid == -1 || dropid == holdid) {
        forEl(this.parent, function(el) {
            el.attr({x: el.ox, y: el.oy})
        });
    }
    else{
        clearTimeout(delay);
        bubb.clear();
        console.log(holdid, dropid, left);

        var rule = new Transforms.Distribute()
        var results= rule.find('src:'+holdid.toString()+', dest:'+dropid.toString(),form)
        if (results.length > 1){console.log('multiple possibilities!!! choosing first one...')}
        // console.log(results, 'results')
        rule.apply(results.get(0));

        SVG.clear();

       draw_it(form, [50,30], true, SVG)

    }
    
    holdid = -1;
    
    // this.animate({r: 50, opacity: .5}, 500, ">");

    

},
over = function() {//Temporary display of result
	this.attr({opacity: 0.7, cursor: "default"})
    if (-1 != holdid) { 
        dropid = this.id;
        dropel=this;
        delay = setTimeout(function(){
            //execute the proposed transformation:
            var temp_form = form.copy();

            //console.log(temp_form.print(), 'src:'+holdid.toString()+', dest:'+dropid.toString());
            var rule = new Transforms.Distribute();
            results= rule.find('src:'+holdid.toString()+', dest:'+dropid.toString(),temp_form)
            if (results.length > 1){console.log('multiple possibilities!!! choosing first one...')}
            //console.log(results[0], 'results')
            
            rule.apply(results.get(0))
            //draw_it(form);
            
            //Show transformation in the bubble:
            xst = dropel.paper.canvas.offsetLeft+dropel.getBBox().x2+20;
            yst = dropel.paper.canvas.offsetTop+dropel.getBBox().y2 +40;
            
            var v = draw_it(temp_form, [xst, yst])
            v_over = v;
            

            //Change font of the bubble equation:
            // bubb.setViewBox(xst,yst, 200,100,true);
        
            v.attr({opacity: 0.4})

        },500);
    };
    if(holdid == dropid){clearTimeout(delay);}

},
out = function() {
	this.attr({opacity: 1})
    dropid = -1;
    clearTimeout(delay);
    bubb.clear();
},
dblcl = function() {
    exec = this.id;
    this.attr({stroke: "red"})
    console.log(exec);
};


// var bot = R.bottom, res = []; 
// while (bot) { 
//      res.push(bot); 
//      bot = bot.next; 
// } 
// span.def{cursor:default};
// res.node.setAttribute("class","def")

//==============================================
set_gui = function(res,formula, paper){
    form = formula;
    SVG = paper;
    // R.set(res).attr({"font-size": 55})
    res.drag(move, start, up);
    res.mouseover(over);
    res.mouseout(out);
    res.dblclick(dblcl);
};
};