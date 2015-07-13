// $( document ).ready(function() {
// 	// console.log( "ready!" );
// 	$("#formula").mousemove(move);
// 	$("#formula").mouseup(endMove);
// 	$("*", $("#formula")).mousedown(mouseDown);

// });

// document.onselectstart = function(){ return false; }

//-----------------------
//Set up the manipulation gui on the equation eq. 

manip_gui = function(eq){
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
    var holdid = -1;
    var dropid = -1;
    var left = false;
    var exec = -1;
    var delay;
    var temp_eq;
    var transf;
    var cursor_now;
    var coord_hold =0;
    var ulAllCoord ={}; //array of upper left coordinates of all the elements in the equation
    var lrAllCoord ={}; //array of upper left coordinates of all the elements in the equation
    var dragging = {}; // array of elements being dragged

    /**
         * executes on mouse-down for start of a drag
         */
    var start = function () {
        eq.forEl(function(el) {
            el.ox = el.attr("x");
            el.oy = el.attr("y");
            dragging[el.id] = el;
        }, this.parent);
        holdid = this.id;
        this.toBack();
        //console.log(this.ox, this.oy);
        // this.animate({r: 70, opacity: .25}, 500, ">");
    }

    //check if the dragged element overlaps with something
    var checkOverlap = function(){
        //console.log(ulAllCoord)
        for(eid in ulAllCoord){
            //console.log(ulAllCoord[eid], cursor_now , lrAllCoord[eid], eq.R.getById(eid).code)
            //Check if the current mouse position overlaps: ----------------
            if(eid in dragging) continue;
            if (ulAllCoord[eid][0] < cursor_now[0] && cursor_now[0] < lrAllCoord[eid][0] &&
                ulAllCoord[eid][1] < cursor_now[1] && cursor_now[1] < lrAllCoord[eid][1]){
                //eq.R.getById(eid).attr({stroke: "red"});
                return eid;
            }
        }
        return -1;
    }

    /**
         * executes on mouse-move for dragging
         */
    var move = function (dx, dy, x, y) {
        eq.forEl(function(el) {
            el.attr({x: el.ox + dx, y: el.oy + dy})
        }, this.parent);
        // if(dropid != -1 && dropid != holdid && dropel.constructor.prototype == Raphael.el){
        //     left = x < dropel.attr("x") + dropel.getBBox().width / 5;
        //     //console.log(left)
        // }

        cursor_now = [x-eq.R.canvas.offsetLeft, y-eq.R.canvas.offsetTop];
        //Delete the proposed manipulation if move mouse more than threshold:
        if(!isUndefined(temp_eq) && Math.abs(cursor_now[0]-coord_hold[0])+Math.abs(cursor_now[1]-coord_hold[1]) >10){
            temp_eq.delete();
            temp_eq = undefined;
            //console.log(temp_eq, "temp eq")
            eq.Rtree.attr({opacity:1});
        }

        //If not moving for 0.5 second, check if hovering and propose a tranformation:
        if(!isUndefined(delay)) clearTimeout(delay);
        delay = setTimeout(function(){
            dropid = checkOverlap();
            console.log("dropid", dropid)
            if (dropid != -1) {  //If dragging over some element
                var dropel=eq.R.getById(dropid);
                //execute the proposed transformation:
                temp_eq = eq.copy();
                //if(gui_fl == false) temp_eq.gui_fl = false;
                transf = temp_eq.distribute(holdid,dropid);
                if (! transf) {temp_eq = undefined; return;}
                eq.Rtree.attr({opacity:0})
                temp_eq.flow_from(eq, transf);
                coord_hold = cursor_now; //to determine when you move out again
            }
        },500);
        // console.log(this.ox);
    }


    /**
         * executes on mouse-rollover
         */
    var over = function() {//Temporary display of result
        this.attr({opacity: 0.7, cursor: "default"})

    };

    /**
         * executes on mouse-up at the end of a drag
         */
    var up = function () {
        var temp_form = eq.master.copy();
        if(isUndefined(temp_eq)){
            clearTimeout(delay);
            //if not hovering, drop back to starting location:
            dropid = checkOverlap();
            if(dropid == -1 || dropid == holdid) {
                eq.forEl(function(el) {
                    el.attr({x: el.ox, y: el.oy})
                }, this.parent);
                return;
            }
            //else, update the formula:
            
            //execute the proposed transformation:
            temp_eq = eq.copy();
            //if(gui_fl == false) temp_eq.gui_fl = false;
            transf = temp_eq.distribute(holdid,dropid);
            if (!transf) {
                temp_eq = undefined;
                eq.forEl(function(el) {
                    el.attr({x: el.ox, y: el.oy})
                }, this.parent);
                return;
            }
            eq.Rtree.attr({opacity:0})
            temp_eq.flow_from(eq, transf);
        }
        eq.delete();
        eq = temp_eq; 
        eq0=eq;

            

        //Create animation box---------------
        var new_form = eq.master.copy();
        //console.log(transf, "trasf")
        memory.add_op(temp_form, new_form, transf);

        
        
        holdid = -1;
        
        // this.animate({r: 50, opacity: .5}, 500, ">");
    }

    
    /**
         * executes on mouse-out
         */
    var out = function() {
    	this.attr({opacity: 1})
    }
    /**
         * executes on double-click
         */
    var dblcl = function() {
        exec = this.id;
        this.attr({stroke: "red"})
        console.log(exec);
    };


    

    //==============================================
    /**
     * assigns the interaction function to all the elements
     * @param {set} res - top-most set of Raphael tree
     * @param {tree} formula - master tree
     * @param {paper} paper - Raphael paper
     */
    // R.set(res).attr({"font-size": 55})
    eq.Rtree.drag(move, start, up);
    eq.Rtree.mouseover(over);
    eq.Rtree.mouseout(out);
    eq.Rtree.dblclick(dblcl);

    eq.forEl(function(el){
        var bbox = el.getBBox();
        //console.log(bbox);
        ulAllCoord[el.id] = [bbox.x, bbox.y];
        lrAllCoord[el.id] = [bbox.x2, bbox.y2];
        //console.log(el.id, lrAllCoord[el.id]);
    })
};
