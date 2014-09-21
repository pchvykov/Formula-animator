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

// <<<<<<< HEAD
	var res = code.replace(/&#([0-9]*);/g, 'F\\u$1')
	return res;
// =======
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
// >>>>>>> a7a84ac1d896e91ac619ec390381b61ac51e02c9
}