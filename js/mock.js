// <text x="250" y="50" dy="-10">B &#948 </text> <!-- This positions letter B and greek letter small delta-->


var mock1 = {
	type: "op",
	op: "plus",
	left: {
		type: "symbol",
		value: "a"
	},
	right: {
		type: "number",
		value: 52

	}
}

//a + 45 = b
var mock2 = {
	type: "op",
	op: "=",
	right: {
		type: "symbol",
		value: "b"
	},
	left: {
		type: "op",
		op: "+",
		left: {
			type: "symbol",
			value: "a"
		},
		right: {
			type: "number",
			value: 45
		}
	}
}

//a = 45
var mock3 = {
	type: "op",
	op: "=",
	right: {
		type: "symbol",
		value: "a"
	},
	left: {
		type: "number",
		value: 45
	}
}


