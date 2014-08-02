

var ActionHandler = function(){
	this.init = function(){
		this.callbacks = {};
	}
	this.class = function(name){
		this.callbacks[name] = {};
	}
	this.add = function(cls, name, cbk){
		if(!this.callbacks.hasOwnProperty(cls)){
			console.log("Failed to bind "+name+": "+cls+" doesn't exist.");
			return;
		}
		this.callbacks[cls][name] = cbk;
	}
	this.trigger = function(cls,data){
		for(var name in this.callbacks[cls]){
			var cb = this.callbacks[cls][name];
			cb(data);
		}
	}
	this.remove = function(cls, name){
		if(!this.callbacks.hasOwnProperty(cls)){
			return;
		}
		delete this.callbacks[cls][name];
	}

	this.init();
}

