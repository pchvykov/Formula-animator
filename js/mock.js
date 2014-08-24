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
	op: "equals",
	code: "=",
	id: 0,
	right: {
		type: "variable",
		id: 1,
		code: "b"
	},
	left: {
		type: "op",
		op: "plus",
		code: "+",
		id: 2,
		left: {
			type: "variable",
			id: 3,
			code: "a"
		},
		right: {
			type: "number",
			id: 4,
			code: 45
		}
	}
}


//a=b
var mock4 = {
	id: 16,
	type: "op",
	op: "equals",
	code: "=",
	right: {
		id: 4,
		type: "variable",
		code: "b",
		name: "b"
	},
	left: {
		id: 3,
		type: "variable",
		code: "a",
		name: "a"
	}
}

//a + b = c + d  (propagtes left)
var mock5 = {
	id: 16,
	type: "op",
	op: "plus",
	code: "+",
	right: {
		id: 4,
		type: "variable",
		code: "d",
		name: "d"
	},
	left: {
		id: 3,
		type: "op",
		op: "equals",
		code: "=",
		right:{
			id: 6,
			type: "variable",
			code: "c",
			name: 'c'
		},
		left: {
			id: 5,
			type: "op",
			op: "plus",
			code: "+",
			right:{
				id: 7,
				type: "variable",
				code: "b",
				name: "b"
			},
			left:{
				id:8,
				type: "variable",
				code: "a",
				name: "a"
			}
		}
	}
}


//a + b = c + d (Centered on equal sign)
var mock6 = {
	id: 16,
	type: "op",
	op: "equal",
	code: "=",
	right: {
		id: 4,
		type: "op",
		op: "plus",
		code: "+",
		right:{
			id: 7,
			type: "variable",
			code: "d",
			name: "d"
		},
		left:{
			id: 8,
			type: "variable",
			code: "c",
			name: "c"
		}
	},
	
	left: {
		id: 9,
		type: "op",
		op: "plus",
		code: "+",
		right:{
			id: 10,
			type: "variable",
			code: "b",
			name: "b"
		},
		left:{
			id: 11,
			type: "variable",
			code: "a",
			name: "a"
		}
	}
}