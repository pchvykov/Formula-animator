
var Formula = function(data){
	this.init = function(d){
		this.data = d;
	}
	this.findById = function(id){
		return {};
	}
	this.toString = function(){
		return JSON.stringify(this.data,null,2);
	}
	this.init(data);
}