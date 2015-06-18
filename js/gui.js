// $( document ).ready(function() {
// 	// console.log( "ready!" );
// 	$("#formula").mousemove(move);
// 	$("#formula").mouseup(endMove);
// 	$("*", $("#formula")).mousedown(mouseDown);

// });

// document.onselectstart = function(){ return false; }



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
    var cursor_now;
    var coord_hold =0;

    /**
         * executes on mouse-down for start of a drag
         */
    var start = function () {
        eq.forEl(function(el) {
            el.ox = el.attr("x");
            el.oy = el.attr("y");
        }, this.parent);
        holdid = this.id;
        this.toBack();
        //console.log(this.ox, this.oy);
        // this.animate({r: 70, opacity: .25}, 500, ">");
    }
    /**
         * executes on mouse-move for dragging
         */
    var move = function (dx, dy, x, y) {
        eq.forEl(function(el) {
            el.attr({x: el.ox + dx, y: el.oy + dy})
        }, this.parent);
        if(dropid != -1 && dropid != holdid && dropel.constructor.prototype == Raphael.el){
            left = x < dropel.attr("x") + dropel.getBBox().width / 5;
            //console.log(left)
        }

        cursor_now = [x,y];
        //Delete the proposed manipulation if move mouse more than threshold:
        //console.log(coord_hold);
        if(!isUndefined(temp_eq) && Math.abs(cursor_now[0]-coord_hold[0])+Math.abs(cursor_now[1]-coord_hold[1]) >10){
            temp_eq.Rtree.remove();
            eq.Rtree.attr({opacity:1});
        }
        // console.log(this.ox);
    }

    /**
         * executes on mouse-rollover
         */
    var over = function() {//Temporary display of result
        this.attr({opacity: 0.7, cursor: "default"})
        if (-1 != holdid) {  // if already dragging something
            dropid = this.id;
            dropel=this;

            //wait for the user to stay there for a bit
            delay = setTimeout(function(){
                //execute the proposed transformation:
                temp_eq = eq.copy();
                temp_eq.gui_fl = false;
                var transf = temp_eq.distribute(holdid,dropid, eq.map);
                if(transf){
                    eq.Rtree.attr({opacity:0})
                    temp_eq.flow_from(eq, transf);
                }
                coord_hold = cursor_now; //to determine when you move out again
            },500);
        };
        if(holdid == dropid){clearTimeout(delay);}

    };

    /**
         * executes on mouse-up at the end of a drag
         */
    var up = function () {
        //if not hovering, drop back to starting location:
        if(dropid == -1 || dropid == holdid) {
            eq.forEl(function(el) {
                el.attr({x: el.ox, y: el.oy})
            }, this.parent);
        }
        //else, update the formula:
        else{
            clearTimeout(delay);
            //console.log(holdid, dropid, left);
            var temp_form = eq.master.copy();
            var transf = eq.distribute(holdid,dropid);
            if (!transf) {
                eq.forEl(function(el) {
                    el.attr({x: el.ox, y: el.oy})
                }, this.parent);
                return;
            }
            if(!isUndefined(temp_eq)) temp_eq.Rtree.remove();
            eq.display();            
            

            //Create animation box---------------
            var new_form = eq.master.copy();
            memory.add_op(temp_form, new_form, transf);

        }
        
        holdid = -1;
        
        // this.animate({r: 50, opacity: .5}, 500, ">");
    }

    
    /**
         * executes on mouse-out
         */
    var out = function() {
    	this.attr({opacity: 1})
        dropid = -1;
        clearTimeout(delay);
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
};
