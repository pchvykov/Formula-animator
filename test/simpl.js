QUnit.test( "simpl.distribute", function( assert ) {
  function test_dist(expr, search, idx, key){
  	var form = parser.parse(expr);	
  	var rule = new Transforms.Distribute();
  	var res = rule.find(search,form);
  	rule.apply(res[idx],form);
  	assert.equal(form.print(), key, "dist  with "+search+" on result "+idx+" : "+expr +
  		 "=>"+form.print() + " (expected: \""+key+"\")");
  }
  test_dist('a*(b+c)', '', 0, '(a*(b)+a*(c))');
  test_dist('(b+c)*a', '', 0, '(a*(b)+a*(c))');
  test_dist('a*(b+c+d)', '', 0, '(a*(b)+a*(c)+a*(d))');
  test_dist('(a+q)*(b+c)', '', 0, '((a+q)*(b)+(a+q)*(c))');
});