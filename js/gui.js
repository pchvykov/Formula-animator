// $( document ).ready(function() {
// 	// console.log( "ready!" );
// 	$("#formula").mousemove(move);
// 	$("#formula").mouseup(endMove);
// 	$("*", $("#formula")).mousedown(mouseDown);

// });

// document.onselectstart = function(){ return false; }



window.onload = function(){
    /**
     * holdid = id of the element currently being dragged
     * dropid = id of the element over which another is dropped
     * left = is mouse currently on left side of the drop element? 
     * exec = ??
     * form = mater tree
     * delay = delay on holding one element over another before acting
     * SVG = paper
     * bubb = Raphael paper (bubble) where the temporary equation is displayed
     */
    var holdid = -1,
        dropid = -1, 
        left = false,
        exec = -1,
        form, delay, SVG, temp_R = Raphael(0,0,1,1),
        coursor_now, coord_hold =0;

temp_R.remove();
  
    
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


/**
     * iterates through Raphael tree, executing elfn function only on terminal elements (not subsets)
     * @param {set} el - Raphael tree node
     * @param {function} elfn - function that takes in a terminal element
     */
 forEl = function(el, elfn) { //Execute the function for all elements in set (not sets)
    el.forEach(function(sel) {
        if(sel.constructor.prototype ==  Raphael.st) {
            forEl(sel, elfn);
        }
        else {
            elfn(sel);
        }

    })
}



/**
     * executes on mouse-down for start of a drag
     */
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
/**
     * executes on mouse-move for dragging
     */
move = function (dx, dy, x, y) {
    forEl(this.parent, function(el) {
        el.attr({x: el.ox + dx, y: el.oy + dy})
    });
    if(dropid != -1 && dropid != holdid && dropel.constructor.prototype == Raphael.el){
        left = x < dropel.attr("x") + dropel.getBBox().width / 5;
        //console.log(left)
    }

    coursor_now = [x,y];
    //Delete the proposed manipulation if move mouse more than threshold:
    if(temp_R.width != null && Math.abs(coursor_now[0]-coord_hold[0])+Math.abs(coursor_now[1]-coord_hold[1]) >10){
        temp_R.remove();
    }
    // console.log(this.ox);
},
/**
     * executes on mouse-up at the end of a drag
     */
up = function () {
    //if not hovering, drop back to starting location:
    if(dropid == -1 || dropid == holdid) {
        forEl(this.parent, function(el) {
            el.attr({x: el.ox, y: el.oy})
        });
    }
    //else, update the formula:
    else{
        clearTimeout(delay);
        //console.log(holdid, dropid, left);
        var temp_form = form.copy();
        var rule = new Transforms.Distribute();
        var results= rule.find('src:'+holdid+' dest:'+dropid,form)
        if (results._len > 1){console.log('multiple possibilities!!! choosing first one...')}
        // console.log(results, 'results')
        var transf=rule.apply(results.get(0));
        console.log(form.print(1))
        form.cleanup_and_reassign();
        console.log(form.print(1))
        //Draw new eq, no animation-----------------
        SVG.clear();
        var v = draw_it(form, main_eq.origin, true, main_eq.R_form.paper, main_eq.fontz);
        main_eq.R_form = v;
        temp_R.remove();
        

        //Create animation box---------------

        add_op(temp_form, form, transf);



    }
    
    holdid = -1;
    
    // this.animate({r: 50, opacity: .5}, 500, ">");

    

},
/**
     * executes on mouse-rollover
     */
over = function() {//Temporary display of result
	this.attr({opacity: 0.7, cursor: "default"})
    if (-1 != holdid) { 
        dropid = this.id;
        dropel=this;

        //wait for the user to stay there for a bit
        delay = setTimeout(function(){
            //execute the proposed transformation:
            var temp_form = form.copy();

            //console.log(temp_form.print(), 'src:'+holdid.toString()+', dest:'+dropid.toString());
            //console.log(temp_form.print(), 'holdid', holdid, 'dropid', dropid)

            //backend transformation
            var rule = new Transforms.Distribute();
            var results= rule.find('src:'+Math.floor(holdid)+' dest:'+Math.floor(dropid), temp_form)
            if (results._len > 1){console.log(results._len+' possibilities!!! choosing first one...')}
            //console.log(results[0], 'results')
            var transf = rule.apply(results.get(0))
            //draw_it(form);
            
            //Show transformation in the bubble:
            //var xst = dropel.paper.canvas.offsetLeft+dropel.getBBox().x2+20;
            //var yst = dropel.paper.canvas.offsetTop+dropel.getBBox().y2 +40;
            
            //var v = draw_it(temp_form, [xst, yst])
            coord_hold = coursor_now;

            //Flow to new eq. from old one
            var v = flow_it(SVG, temp_form, transf)
            temp_R = v.paper; // temporary paper to display the tentative transformation
            

            //Change font of the bubble equation:
            // bubb.setViewBox(xst,yst, 200,100,true);
        
            //v.attr({opacity: 0.4})

        },500);
    };
    if(holdid == dropid){clearTimeout(delay);}

},
/**
     * executes on mouse-out
     */
out = function() {
	this.attr({opacity: 1})
    dropid = -1;
    clearTimeout(delay);
},
/**
     * executes on double-click
     */
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
/**
     * assigns the interaction function to all the elements
     * @param {set} res - top-most set of Raphael tree
     * @param {tree} formula - master tree
     * @param {paper} paper - Raphael paper
     */
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