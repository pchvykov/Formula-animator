var Formula = function(data){
	this._to_match_data = function(d){

	}
	this.init = function(d){
		this.data = d;
		this.match = this._to_match_data(this.data);
	}
	this.toString = function(){
		return JSON.stringify(this.data,null,2);
	}
	this.copy = function(){
		return JSON.parse(JSON.stringify(this.data,null,2));
	}
	this.init(data);
}