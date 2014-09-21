function decimalToHexString(number)
{
    if (number < 0)
    {
    	number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

var toUnicodeCharacter = function(code){
	var orig = code.match(/&#([0-9]*);/g);
	
	for(var i = 0; i < orig.length; i++){
		var snum = orig[i].substring(2,orig[i].length-1);
		var hex = decimalToHexString(parseInt(snum));
		var zeroes = "0000";
		hex = zeroes.substring(hex.length)+ hex;
		var re = new RegExp(orig[i], "g");

		code = code.replace(re, '\\u'+hex);
	}

	var res = code.replace(/&#([0-9]*);/g, '\\u$1')
	return res;
}