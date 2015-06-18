function decimalToHexString(number)
{
    if (number < 0)
    {
    	number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

var toUnicodeSequence = function(code){
	var orig = code.match(/@([0-9]*)/g);
	if(orig == null) return code;
	for(var i = 0; i < orig.length; i++){
		var snum = orig[i].substring(1);
		var hex = decimalToHexString(parseInt(snum));
		var zeroes = "0000";
		hex = zeroes.substring(hex.length)+ hex;
		var re = new RegExp(orig[i], "g");

		code = code.replace(re, 'F\\\\u'+hex);
	}
	return code;
}

var toUnicodeCharacter = function(code){
	var orig = code.match(/@([0-9]*)/g);
	if(orig == null) return code;
	for(var i = 0; i < orig.length; i++){
		var snum = orig[i].substring(1);
		var dec = (parseInt(snum));
		var sym = String.fromCharCode(dec);
		var re = new RegExp(orig[i], "g");
		code = code.replace(re, sym);
	}
	console.log(code);
	return code;
}

var copyData = function(d){
  return JSON.parse(JSON.stringify(d,null,2));
}

var isUndefined = function(v){
  return (v == undefined);
}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

var countKeys = function(myobj){
	var count = 0;
	for (k in myobj) if (myobj.hasOwnProperty(k)) count++;
	return count;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
    while ((new Date().getTime() - start) < milliseconds){
        
    }
}
