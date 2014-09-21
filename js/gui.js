// $( document ).ready(function() {
// 	// console.log( "ready!" );
// 	$("#formula").mousemove(move);
// 	$("#formula").mouseup(endMove);
// 	$("*", $("#formula")).mousedown(mouseDown);

// });

// document.onselectstart = function(){ return false; }
window.onload = function () {
    holdid = -1; dropid = -1; left = false;

// var tree = { "id": 29, "type": "op", "op": "eq", "code": "=", "left": 
// { "id": 16, "type": "op", "op": "plus", "code": "+", "left": 
// { "id": 3, "type": "number", "value": 5 }, "right": { "id": 15, "type": "number", "value": 6 } }, 
// "right": { "id": 28, "type": "number", "value": 7 } };

 R = Raphael(0, 0, "100%", "100%");
    s1 = R.text(250, 100, '='),
    s2 = R.text(150, 100, '+'),
	s3 = R.text(100, 100, '5'),
	s4 = R.text(200, 100, '6'),
	s5 = R.text(300, 100, '7'),
    s = R.set(s1, R.set(s2, R.set(s3), R.set(s4)), R.set(s5)),
    dropel = s1;


    s.forEach(function(el) {el.parent = s;});
    s[1].forEach(function(el) {el.parent = s[1];});
    s[2].forEach(function(el) {el.parent = s[2];});
    s[1][1].forEach(function(el) {el.parent = s[1][1];});
    s[1][2].forEach(function(el) {el.parent = s[1][2];});

    // s.push(R.text(250, 100, '='));
    s1.id=3; s2.id=16; s3.id=15; s4.id=29; s5.id=28;


	
    // r = R.circle(100, 100, 50).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5}),
    // g = R.circle(210, 100, 50).attr({fill: "hsb(.3, 1, 1)", stroke: "none", opacity: .5}),
    // b = R.circle(320, 100, 50).attr({fill: "hsb(.6, 1, 1)", stroke: "none", opacity: .5}),
    // p = R.circle(430, 100, 50).attr({fill: "hsb(.8, 1, 1)", stroke: "none", opacity: .5});

var forEl = function(el, elfn) { //Execute the function for all elements in set (not sets)
    el.forEach(function(sel) {
        if(sel.constructor.prototype ==  Raphael.st) {
            forEl(sel, elfn);
        }
        else {elfn(sel);}

    })
}


var start = function () {
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
    if(dropid !== -1 && dropid !== holdid){
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
    };
    console.log(holdid, dropid, left);
    holdid = -1;
    // this.animate({r: 50, opacity: .5}, 500, ">");
    

},
over = function() {
	this.attr({opacity: 0.7, cursor: "default"})
    if (-1 !== holdid) { 
        dropid = this.id;
        dropel=this; 
    };
},
out = function() {
	this.attr({opacity: 1})
    dropid = -1;
};


var bot = R.bottom, res = []; 
while (bot) { 
     res.push(bot); 
     bot = bot.next; 
} 
// span.def{cursor:default};
// res.node.setAttribute("class","def")

//==============================================

R.set(res).attr({"font-size": 55})
R.set(res).drag(move, start, up);
R.set(res).mouseover(over);
R.set(res).mouseout(out);
};

s1.attr({
    "font-size":200
});