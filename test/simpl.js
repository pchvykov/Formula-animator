QUnit.test( "simpl.distribute", function( assert ) {
  function test_trans(expr, search, idx, key){
  	var form = parser.parse(expr);	
  	var rule = new Transforms.Distribute();
  	var res = rule.find(search,form);
  	rule.apply(res[idx],form);
  	assert.equal(form.print(), key, "dist  with "+search+" on result "+idx+" : "+expr +
  		 "=>"+form.print() + " (expected: \""+key+"\")");
  }
  test_trans('a*(b+c)', '', 0, '(a*(b)+a*(c))');
  test_trans('(b+c)*a', '', 0, '(a*(b)+a*(c))');
  test_trans('a*(b+c+d)', '', 0, '(a*(b)+a*(c)+a*(d))');
  test_trans('(a+q)*(b+c)', '', 0, '((a+q)*(b)+(a+q)*(c))');
   test_trans('3*r+s+a+a*(b+c)', '', 0, '3*r+s+a+(a*(b)+a*(c))');
});

QUnit.test( "simpl.const_eval", function( assert ) {
  function test_trans(expr, search, idx, key){
  	var form = parser.parse(expr);	
  	var rule = new Transforms.SimplifyConstants();
  	var res = rule.find(search,form);
  	console.log(res);
  	rule.apply(res[idx],form);
  	assert.equal(form.print(), key, "ceval  with "+search+" on result "+idx+" : "+expr +
  		 "=>"+form.print() + " (expected: \""+key+"\")");
  }
  function test_trans_len(expr,search){
  	var form = parser.parse(expr);	
  	var rule = new Transforms.SimplifyConstants();
  	var res = rule.find(search,form);
  	console.log(res.length > 0);
  	assert.ok((res.length > 0),  "ceval  with "+search+" : "+expr +' => solution exists');
  }
  test_trans('4+5', '', 0, '9');
  test_trans('4-5', '', 0, '-1');
  test_trans('4*5', '', 0, '20');
  test_trans('4/5', '', 0, '0.8');
  test_trans('2^5', '', 0, '32');
  
  test_trans_len('x*2*5', '');
  test_trans('x*2*5', '', 0, 'x*10');
  test_trans_len('2*5*x', '');
  test_trans('2*5*x', '', 0, 'x*10');
});