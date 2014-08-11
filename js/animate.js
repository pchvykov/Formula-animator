var AnimationHandler = function(){
	this.init = function(){
		this.callbacks = {};
	}
	this.path = function(pts){
		
		var res = "";
		var sx = pts[0].x;
		var sy = pts[0].y;
		var ex = pts[pts.length-1].x;
		var ey = pts[pts.length-1].y;

		res = res + "M " + sx + " " + sy + " " 
		for	(var index = 1; index < pts.length -1; index +=1) {
    		var qx = pts[index].x;
    		var qy = pts[index].y;

    		res+= " " + "q" + " " + (qx-sx) + " " + (qy-sy);

		}
		res += " " +  ex + " " + ey;
		return res;
	}

	this.arc = function(name, sx, sy, ex, ey, duration){

		var qx = (sx + sy)/2;
		var qy = sy - (((3)^0.5)/2)*(ex-sx);

		var spath = this.path([{x:sx,y:sy}, {x:qx, y:qy},{x:ex, y:ey}]);

		return spath;
	}


	this.init();
}

anim = new AnimationHandler();